# 배포

이 템플릿에는 실제 호스팅·계정·도메인이 연결되어 있지 않다.
`src/config/site.mjs`의 `site` 기본값은 `https://example.com`, `base` 기본값은 `/`다.
배포 전 `site`를 실제 대표 주소로 바꾸고, 하위 경로에 게시하면 `base`도 바꾼다.
두 값은 빌드 환경의 `SITE_URL`·`SITE_BASE`로 덮어쓸 수 있다.
사이트 이름은 `astro.config.mjs`의 Starlight `title`과 `src/content/docs/index.mdx`에서 바꾼다.

## 공통 준비

```bash
npm ci
npm run check
```

- Node.js 24와 npm을 사용한다. `.nvmrc`와 `package-lock.json`을 함께 보관한다.
- 정적 빌드 명령은 `npm run build`, 출력 폴더는 `dist`다.
- 도메인 루트와 `/저장소이름/` 같은 하위 경로 배포를 모두 지원한다. 본문·덱 데이터에는 base 없는
  사이트 경로를 쓰고 빌드가 게시 경로를 붙인다. `npm run check`는 실제 빌드의 `site`·`base`를 읽어
  링크·자산·canonical·sitemap을 검사하고, `npm run check:base`는 두 하위 경로로 빌드해 같은 검사를 한다.
- 설정을 바꾼 뒤에는 같은 환경 변수로 `npm run check`와 `npm run preview`를 실행한다.
- Git 이력이 없는 문서는 마지막 수정일 계산에서 제외된다. 수정일을 표시하려면 콘텐츠 커밋과
  빌드 환경의 Git 이력이 필요하다.

호스팅별 설명은 [웹으로 공유하기](../src/content/docs/starlight/publishing.mdx)에서 이어진다.
빌드 검증과 실제 공개 완료는 별개이며, 배포 후 공개 주소에서 결과를 확인한다.

## Cloudflare Pages

Git 저장소를 연결할 때 자신의 저장소를 선택하고 아래 값을 넣는다.

| 항목 | 값 |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |

Node 버전은 `.nvmrc`로 관리하며 D2용 환경 변수는 필요 없다.
`npm run build`의 `prebuild`는 Cloudflare Pages가 넣은 `CF_PAGES=1`을 확인하고,
얇은 Git checkout이면 `git fetch --unshallow` 후 Astro 빌드를 시작한다.
연결 절차와 완료 확인은 [Cloudflare Pages 안내](../src/content/docs/starlight/cloudflare-pages.mdx)를 따른다.

## 선택용 GitHub Pages 워크플로

`.github/workflows/deploy.yml`은 기본적으로 `workflow_dispatch` 수동 실행만 허용한다.
게시 주소에 맞춰 `src/config/site.mjs`의 `site`·`base`를 정하고(또는 빌드 단계에 `SITE_URL`·`SITE_BASE`를
전달하고) 저장소 Pages의 Source를 GitHub Actions로 설정한다.
자동 배포가 필요하면 YAML의 `push`·`branches` 두 줄의 주석을 해제한다.
워크플로는 전체 Git 이력을 받아 빌드한 뒤 `dist`를 배포한다.
GitHub의 `Disable workflow` 상태는 YAML 기본값이 아니라 GitHub에서 따로 관리한다.

[GitHub Pages 안내](../src/content/docs/starlight/github-pages.mdx)에 사용자 사이트·프로젝트 사이트별 준비 절차가 있다.
`.github/workflows/check.yml`은 main push·pull request에서 `npm ci`, `npm run check`, `npm run check:base`를 실행하는 검증용이다.

## Vercel과 다른 정적 호스팅

`npm run build`와 `dist`를 기준으로 연결한다.
수정일을 표시하려면 빌드 환경의 Git 이력도 확인한다. Cloudflare Pages용 이력 준비는
다른 호스팅에서는 실행되지 않는다. [Vercel 안내](../src/content/docs/starlight/vercel.mdx)를 참고한다.

## D2 native 바이너리는 어떻게 준비하나

D2 다이어그램은 **native D2 `v0.8.2`**로 빌드한다. 시스템 전역 설치나 Cloudflare 대시보드
설정에 기대지 않고, `astro.config.mjs`가 로드될 때 `scripts/prepare-d2.mjs`를 먼저 호출한다.
그래서 `npx astro dev --background`·`npm run build`·`npm run check` 어느 진입점이든 같은 준비
경로를 거친다.

- 현재 플랫폼에 맞는 공식 standalone archive를 받는다. 지원 조합은 macOS arm64/x64와
  Linux x86_64/arm64이며, Cloudflare Pages는 `linux-x64`를 쓴다.
- 버전과 네 archive의 SHA-256은 스크립트에 고정돼 있다. 다운로드는 임시 디렉터리에서 하고,
  체크섬 검증 → 압축 해제 → 실행 권한 설정 → `d2 --version`이 정확히 `v0.8.2`인지 확인한 뒤
  검증된 디렉터리만 rename으로 캐시에 반영한다.
- 캐시는 `node_modules/.astro/d2/v0.8.2/<platform-arch>/bin/d2`다. 설정을 읽을 때마다 캐시된
  파일의 실행 권한과 버전을 다시 확인하고, 그 `bin`을 현재 프로세스의 `PATH` 앞에 붙인다.
- Cloudflare Pages에서 build cache 기능이 켜져 있으면 Astro용
  [`node_modules/.astro`를 보존한다](https://developers.cloudflare.com/pages/configuration/build-caching/).
  캐시가 복원되면 다운로드를 건너뛰고, 없거나 검증에 실패하면 다시 설치하므로 이 대시보드
  기능은 성능 최적화일 뿐 빌드 성공 조건이 아니다. cold build에는 GitHub release 다운로드가 필요하다.
- 다운로드는 Node 내장 `fetch`를 쓴다. 셸의 `HTTP_PROXY`·`HTTPS_PROXY`를 따르게 하려면 `NODE_USE_ENV_PROXY=1`을,
  TLS를 재서명하는 프록시 뒤라면 그 CA 파일을 `NODE_EXTRA_CA_CERTS`로 함께 넘긴다. 둘이 없으면 `[D2 네트워크 실패]`로 멈춘다.

D2 버전을 올릴 때는 `D2_VERSION`만 바꾸지 말고 네 archive 이름·SHA-256, 이 문서, SVG 레이아웃
회귀 검증을 한 세트로 갱신한다. 바이너리와 `public/d2/` 산출물은 Git에 넣지 않는다.

## 왜 빌드 전에 Git 이력을 받나

랜딩 카드의 **마지막 수정**은 덱 폴더 안 문서들의 최신 커밋일이다.
Cloudflare Pages의 얇은 checkout에서는 HEAD가 실질적인 root commit으로 보여
모든 문서가 HEAD에서 추가된 것처럼 보이고, 모든 덱이 같은 날짜를 갖게 된다.

`scripts/prepare-git-history.mjs`는 Cloudflare Pages 빌드이고 실제로 얇은 저장소인 경우에만
전체 이력을 받는다. 로컬 빌드와 이미 전체 이력이 있는 checkout에서는 아무 작업도 하지 않는다.
이 fetch가 실패하면 잘못된 수정일을 배포하지 않도록 빌드도 실패한다.

이력이 커져서 이 fetch가 부담되면 수정일을 수동 메타데이터로 옮기지 말고, 이 스크립트의
`--unshallow`를 `--shallow-since="1 year ago"` 같은 기간 제한 fetch로 바꾼다. 최근 수정일
표시에는 최근 이력만 있으면 되고, 그보다 오래 안 고친 덱만 날짜가 경계값으로 뭉개진다.

## 도메인을 바꿀 때

`src/config/site.mjs`의 `site`를 함께 바꾼다. canonical 링크와 sitemap이 이 값을 기준으로 생성된다.
배포 후에는 실제 주소에서 페이지·검색·다이어그램과 canonical·sitemap 주소를 확인한다.

```bash
# YOUR-DOMAIN.example을 실제 대표 도메인으로 바꾼다.
curl -s 'https://YOUR-DOMAIN.example/' | grep -o '<link rel="canonical"[^>]*>'
curl -s 'https://YOUR-DOMAIN.example/sitemap-0.xml' | grep -o '<loc>[^<]*</loc>' | head -3
```
