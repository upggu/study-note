# Study Note — Starlight 템플릿

[Astro Starlight](https://starlight.astro.build) 기반의 한국어 스터디 노트 템플릿.
AI와 함께 내용을 쓰고 **축적·검색·참조**하는 문서 사이트를 만든다.
덱별 사이드바, 이름·태그로 찾는 사이트 홈, Pagefind 검색, D2 다이어그램·이미지 확대·단계별 흐름(`LearningFlow`)을 포함한다.

## 빠른 시작

Node.js 24와 npm이 필요하다. `.nvmrc`를 지원하는 환경에서는 `nvm use`로 맞춘다.

```bash
npm ci
npm run dev
```

`http://localhost:4321`에서 확인한다. 첫 실행에는 고정 버전 D2 바이너리를 GitHub에서 내려받는다.
D2 준비 스크립트는 macOS와 Linux의 arm64/x64를 지원한다. Windows에서는 WSL의 Linux 환경을 사용한다.

## 포함된 덱

| 덱 | 내용 |
|---|---|
| `starlight` | AI에게 문서 작성·수정을 요청하고 시각 자료·검색·배포를 활용하는 방법 |
| `ai-trend` | Jev·Meta Muse·Google AX의 배경과 핵심 개념 |
| `coding-agents` | AGENTS.md, 스펙·설계·계획 문서와 코딩 에이전트 작업 흐름 |

예제의 공식 출처는 각 페이지와 `_baseline.md`에 보존했다.
Starlight 덱의 화면 명칭 이미지는 원본 사이트의 캡처여서 이 템플릿과 덱 목록이 다르다.

## 내 사이트로 바꾸기

1. `src/config/site.mjs`의 `site` 기본값 `https://example.com`을 실제 배포 주소로 바꾼다.
   `/저장소이름/` 같은 하위 경로에 게시하면 같은 파일의 `base` 기본값도 바꾼다.
   파일을 고치지 않고 빌드 환경의 `SITE_URL`·`SITE_BASE`로 넘겨도 된다.
2. `astro.config.mjs`의 Starlight `title`, `src/content/docs/index.mdx`의 제목·설명, `public/favicon.svg`를 바꾼다.
3. 아래 절차로 덱을 추가한다. 예제 덱을 없애면 연결된 링크·이미지도 정리한다.
   `src/data/catalog.mjs`에는 실제 덱에서 사용하는 태그만 둔다.
4. `npm run check`가 통과하면 [배포 안내](docs/deploy.md)에 따라 호스팅을 연결한다.

커밋 전에는 Git 이력이 없으므로 덱의 마지막 수정일이 표시되지 않을 수 있다.
계정·도메인·배포 연결과 원본 Git 이력은 포함하지 않는다. 검증 CI와 수동 GitHub Pages 배포 워크플로를 제공한다.

GitHub에 공개할 때 저장소 설정의 **Template repository**를 활성화하면 다른 사람이
**Use this template**으로 시작할 수 있다.

## 구조

```
astro.config.mjs              # 사이트 설정 — 파생된 덱 데이터를 Starlight에 연결
src/config/site.mjs           # 대표 주소(site)·게시 경로(base) — 배포 전에 바꾼다
src/integrations/site-paths.mjs # 본문 링크·이미지에 게시 경로를 붙이는 remark integration
src/utils/site-path.mjs       # withBase 등 공용 경로 함수
src/route-middleware.ts       # topic 사이드바·이전/다음 링크의 경로 보정
src/data/catalog.mjs          # 전역 category·tag 어휘
src/data/load-decks.mjs       # 덱별 설정과 MDX 파일을 대조하는 파생 loader
src/data/decks.mjs            # 기존 import를 위한 loader re-export (직접 편집하지 않음)
src/content/docs/
  index.mdx                   # 랜딩 페이지 (splash + 덱 카드)
  starlight/ …                 # 덱 하나 = 디렉터리 하나 = topic 하나
    _deck.mjs                 #   이 덱의 메타데이터·사이드바 목록·DeckMap
    _baseline.md              #   기준 버전·서술 규칙·범위 경계
    index.mdx                 #   덱 개요 페이지
    intro.mdx …               #   번호 없는 본문 페이지 — 제목·설명은 frontmatter
src/components/               # layout / docs / demos 역할별 컴포넌트
src/styles/custom.css         # 폰트·본문 폭·검색 UI 전역 커스텀
docs/                         # 작성·검증·배포·Starlight 운영 문서
AGENTS.md                     # 에이전트 작업 진입점 — Codex·Claude Code가 함께 읽는 공유 정본
```

어떤 덱이 있는지는 `src/content/docs/*/_deck.mjs` 또는 사이트 상단의 topic 전환 메뉴를 보면 된다.
덱 목록·랜딩 카드는 이 파일들에서 파생되고, 사이드바는 각 덱의 `sidebar` 목록 순서를 따른다.

- **덱 하나 = topic 하나** — [starlight-sidebar-topics](https://starlight-sidebar-topics.netlify.app)가
  상단에서 덱을 전환하고 덱마다 독립된 사이드바를 준다
- **검색은 Pagefind 내장** — 빌드 시 정적 인덱스가 생성된다. 별도 설정 없음
- **다이어그램은 자체 D2 integration**(`src/integrations/d2.mjs`) — ```` ```d2 ```` 펜스를 빌드 때
  고정 버전의 native D2로 SVG로 만들어 문법 오류를 빌드가 잡는다
- **이미지 확대는 [starlight-image-zoom](https://github.com/HiDeoo/starlight-image-zoom)** —
  본문 이미지와 D2 다이어그램을 클릭하면 전체 화면 dialog로 연다
- **단계별 흐름은 `LearningFlow`** — 누가 무엇을 보관하는지 단계마다 비교하는 설명에 쓴다
- **테마는 [starlight-theme-rapide](https://starlight-theme-rapide.vercel.app), 본문 폰트는
  Pretendard**(셀프호스팅, dynamic subset)
- **루트·하위 경로 배포 모두 지원** — 본문에는 base 없는 사이트 경로를 쓰고 빌드가 게시 경로를 붙인다

## 사용법

```bash
npm ci
npm run dev         # http://localhost:4321
npm run build       # dist/ 생성 + Pagefind 인덱스
npm run check       # 경로 단위 검사 + 콘텐츠 규칙 + build + 렌더된 내부 링크·자산 검사
npm run check:base  # /study-notes/와 /team/notes/ 하위 경로 빌드·검사 (공용 경로 처리를 바꿀 때)
npm run report:content # 덱별 Thesis 이관 현황
npm run preview
```

하위 경로 게시를 미리 보려면 `SITE_URL=https://<계정>.github.io SITE_BASE=/<저장소>/ npm run preview`처럼
빌드와 같은 환경 변수를 준다.

## 새 페이지 추가

1. 대상 덱의 `_baseline.md`를 읽고 `service-account.mdx`처럼 개념·작업 이름으로 `.mdx`를 만든다.
   제목·파일명·URL에는 페이지 번호를 붙이지 않는다.
2. frontmatter에는 `title`·`description`을 적는다. 같은 덱 `_deck.mjs`의 `sidebar[].pages`에
   확장자 없는 상대 경로를 원하는 위치에 추가한다. 그룹과 페이지 모두 배열 순서대로 표시된다.
3. 새 본문에는 `<Thesis>`를 두고, `_deck.mjs`의 `termIntro`가 `required`면 glossary·wrapup을
   제외한 학습 본문에 `<TermIntro>`도 둔다.
4. `npm run check`를 실행한다. 실행 중인 dev 서버에서 페이지를 새로 만들거나 이름을 바꿨다면
   파생 사이드바를 다시 읽도록 서버를 재시작한다.

페이지 URL은 파일 경로가, 그룹·읽는 순서는 덱의 `sidebar`가 정한다. 새 페이지를 추가할 때는
그 덱의 목록에 한 줄을 추가하며, 전역 파일은 고칠 필요가 없다.
페이지 추가·분할·순서 변경은 `npm run check`와 메타데이터 확인으로 마치며, 브라우저는 구체적인
화면 동작·레이아웃 확인이 필요할 때만 쓴다. 지침·계획 문서만 바꾼 경우에는 diff와 참조 경로 확인으로 충분하다.
자세한 범위는 [검증 지침](docs/verification.md)을 따른다.

## 새 덱 추가

1. `src/content/docs/<덱이름>/`을 만들고 가까운 성격의 `_deck.mjs`를 복사해 메타데이터,
   `navOrder`, `catalogOrder`, 사이드바 `sidebar`, index의 `map`을 정의한다.
2. `_baseline.md`를 만들어 기준 버전·서술 규칙·범위 경계를 적고, `index.mdx`와 본문 페이지를 만든다.
   index의 구성 절에는 `<DeckMap deck="<덱이름>" />`를 둔다.
3. `category`(4종 중 하나)와 `tags` 목록을 정한다. 정말 새 전역 어휘가 필요할 때만
   `src/data/catalog.mjs`를 고친다. 한 페이지에서 스치는 주제는 태그로 붙이지 않는다.
   해당하는 태그가 없으면 `tags: []`로 둔다.
4. 개념 학습 덱은 `termIntro: 'required'`, 실습·문제풀이 위주 덱은 `not-required`로 정한다.
   `legacy`는 기존 미이관 덱에만 쓴다.
5. `npm run check`로 설정·파일·링크가 모두 맞는지 확인한다.

`_`로 시작하는 `_deck.mjs`와 `_baseline.md`는 콘텐츠 컬렉션·검색·사이드바에 나오지 않는다.

## 더 읽을 것

| 문서 | 내용 |
|---|---|
| [AGENTS.md](AGENTS.md) | 작업 진입점, 반드시 읽을 문서와 깨뜨리면 안 되는 설정 — Claude Code v2.1.277 이상은 CLAUDE.md 없이 이 파일을 직접 읽는다 |
| [docs/exec-plans/README.md](docs/exec-plans/README.md) | 명시적으로 요청한 계획의 번호·`active`/`completed` 이동·실행 기록 규칙 |
| [docs/content-authoring.md](docs/content-authoring.md) | 제목 계층, 프론트매터, 컴포넌트 작성 규칙 |
| [docs/d2-authoring.md](docs/d2-authoring.md) | D2를 추가·수정할 때만 읽는 배치·문법·의미 팔레트 |
| [docs/learning-flow-authoring.md](docs/learning-flow-authoring.md) | `LearningFlow`를 추가·수정할 때만 읽는 적용 경계·흐름 데이터·검증 |
| [docs/verification.md](docs/verification.md) | 자동 검사와 변경별 브라우저 검증 |
| [docs/starlight-changes.md](docs/starlight-changes.md) | 기본 Starlight에서 바꾼 것 전체 목록 — 업그레이드 전에 볼 것 |
| [docs/deploy.md](docs/deploy.md) | 배포 주소·게시 경로·정적 호스팅·D2·Git 이력 준비 |
| `src/content/docs/<덱>/_baseline.md` | 덱별 기준 버전·서술 규칙·범위 경계 — 모든 덱에 있고, 그 덱을 고치기 전에 반드시 먼저 읽는다 |
