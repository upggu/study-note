# 기본 Starlight에서 바꾼 것

바닐라 Starlight와 다른 지점을 전부 모은 문서. **업그레이드하거나 "이거 왜 이렇게 나오지?" 싶을 때**
여기부터 본다. 각 항목의 "왜"까지 적어 두었다 — 내부 동작에 기댄 항목은
**Starlight 0.41.x 기준으로 확인한 것**이라 메이저 업그레이드 때 재확인이 필요하다.

## 한눈에 보기

| 변경 | 방법 | 파일 |
|---|---|---|
| 덱 = topic 사이드바 | 덱별 설정·MDX를 파생 loader로 합성 + [starlight-sidebar-topics](https://starlight-sidebar-topics.netlify.app/) | `src/content/docs/*/_deck.mjs` · `src/data/load-decks.mjs` · `astro.config.mjs` |
| 테마 (Dracula · 라이트는 Alucard) | [starlight-theme-dracula](https://wasi-master.github.io/dracula-for-starlight/) 플러그인, accent 기본 보라 | `astro.config.mjs` |
| Markdown 프로세서 | `site-paths` integration 호환을 위해 `unified()` 명시 | `astro.config.mjs` |
| D2 펜스 렌더 (다이어그램) | 자체 integration + native D2 v0.9.0 (**starlight보다 먼저**) | `src/integrations/d2.mjs` · `scripts/prepare-d2.mjs` · `astro.config.mjs` |
| 이미지 클릭 확대 | [starlight-image-zoom](https://starlight-image-zoom.vercel.app/) 플러그인 + 기존 override 합성 | `astro.config.mjs` · `MarkdownContent.astro` · `SourceFigure.astro` |
| 하위 경로 배포 | 본문 경로 변환·공용 URL 함수·topics 경로 보정 | `src/config/site.mjs` · `src/integrations/site-paths.mjs` · `src/utils/site-path.mjs` · `src/route-middleware.ts` |
| 검색 결과에 덱 이름 표시 | `MarkdownContent` 컴포넌트 override | `src/components/layout/MarkdownContent.astro` |
| 덱 index 별칭 검색 | `_deck.mjs`의 `aliases`를 본문 앞에 표시 | `src/content/docs/*/_deck.mjs` · `MarkdownContent.astro` |
| 검토 이력 표시 | 검토 날짜·명시적 경고만 표시하고 기록 누락은 보고서에서 관리 | `content.config.ts` · `MarkdownContent.astro` · `scripts/report-content-health.mjs` |
| 랜딩 덱 카탈로그 | 이름 검색·태그 필터 + 카테고리 카드/테이블 전환 + 덱 이름·카테고리·최근 수정일 정렬 + Git 이력으로 수정일 계산 | `scripts/prepare-git-history.mjs` · `src/components/docs/DeckCatalog.astro` |
| 본문 폰트 Pretendard | `customCss` (dynamic subset) | `astro.config.mjs` |
| 본문 폭 45→55rem | `--sl-content-width` | `src/styles/custom.css` |
| 헤더 테마 선택 → 해/달 토글 | `ThemeSelect` override. light↔dark만 오가고 auto 없음. 기본 select는 한국어 라벨이 말줄임되고 목록에 아이콘을 못 넣는다 | `src/components/layout/ThemeToggle.astro` |
| 검색 덱 라벨 위치·모양 | Pagefind UI 태그 칩 재스타일 | `src/styles/custom.css` |
| 한국어 단일 로케일 | `defaultLocale: 'root'` + `ko` | `astro.config.mjs` |

integration 등록 순서·사이드바 등록·topic `exclude`처럼 "깨뜨리면 안 되는" 항목은
[AGENTS.md](../AGENTS.md)에 있다. 아래는 그 밖의 항목.

## 덱 데이터와 자동 사이드바

덱별 목차를 한눈에 편집하도록 `_deck.mjs`의 배열에 그룹·페이지 순서를 모았다.
정보의 소유 위치는 다음과 같고 `load-decks.mjs`가 최종 데이터를 만든다.

- `src/data/catalog.mjs`: 모든 덱이 공유하는 category·tag 통제 어휘
- `src/content/docs/<덱>/_deck.mjs`: 덱 메타데이터, topic·랜딩 순서, `sidebar` 목록, index `DeckMap`
- 각 본문 MDX: 제목·설명·검색 별칭

loader는 `_deck.mjs`가 있는 폴더를 덱으로 발견하고 `sidebar: [{ label, pages }]`를 실제 MDX와
대조한다. 누락·중복·없는 파일 참조·빈 그룹·map 링크·전역 어휘를 검증한 뒤 topic 사이드바와
랜딩 카탈로그를 파생한다. **새 페이지는 MDX를 만들고 그 덱의 `pages` 목록에 추가한다.**
배열 순서가 읽는 순서이며 `index.mdx`는 자동으로 맨 앞에 붙인다.
index의 구성도는 `<DeckMap deck="…" />`가 같은 폴더의 `map`을 읽는다.
`src/data/decks.mjs`는 기존 컴포넌트 import를 유지하기 위한 re-export다.

사이드바 상단 덱 전환 드롭다운은 `Sidebar.astro`에서 **최근 수정일 내림차순**으로 정렬한다.
`src/data/deck-updated-at.ts`가 랜딩과 공통으로 덱 안 문서의 가장 최근 Git 커밋 시각을 계산한다.
수정 시각이 같으면 `_deck.mjs`의 `navOrder` 순서를 유지하고, Git 이력이 없는 덱은 마지막에 둔다.
정렬은 빌드 때 반영되며, dev에서는 다음 페이지 요청 때 새 커밋을 반영한다.

새 파일 추가·이름 변경을 실행 중 dev 서버가 즉시 config 변경으로 인식하지 못할 수 있으므로 이때는
서버를 재시작한다. 빌드와 `npm run check`는 매번 전체 source tree를 새로 읽는다.

## 루트와 하위 경로 배포

`src/config/site.mjs`의 `site`·`base`는 `SITE_URL`·`SITE_BASE` 환경 변수로 덮어쓸 수 있다.
본문·덱 메타데이터의 URL은 base 없는 사이트 경로다. `withBase()`는 이 입력에 base를 붙이며,
이미 게시 경로가 붙은 URL에 다시 호출하지 않는다. `/starlight/`에 배포하는 경우 본문의
`/starlight/intro/`는 `/starlight/starlight/intro/`가 맞으므로 prefix 일치로 중복 여부를 추측하지 않는다.

- `sitePaths()`를 D2보다 먼저 등록한다. remark가 Markdown 링크·이미지·참조 정의와
  MDX의 `LinkCard`·`LinkButton` 및 기본 링크·이미지·미디어 문자열 속성을 처리한다.
  코드 블록·인라인 코드·JavaScript 표현식은 변환하지 않는다.
- `DeckCatalog`·`DeckMap`·`SourceFigure`·`ExternalLink`는 자신의 props를 렌더할 때 처리한다.
  MDX 변환기는 이 컴포넌트들의 props를 건드리지 않는다. 새 컴포넌트도 소유 지점을 하나만 둔다.
- Starlight 기본 사이트 제목·사이드바·검색은 Starlight가, D2 생성 이미지 경로는 `src/integrations/d2.mjs`가 base를 처리한다.
  생성된 결과 전체에 prefix를 다시 붙이는 후처리는 하지 않는다.
- topics 0.8은 root locale의 topic 링크에 base를 붙이지 않으며, 덱 경계에서 게시 URL과 content id를
  비교한다. topics의 `pre` middleware 뒤에 실행되는 `src/route-middleware.ts`가 링크를 보정하고
  덱 사이드바의 `isCurrent`로 첫·끝 페이지의 이전·다음 이동 경계를 유지한다.
  헤더와 드롭다운은 같은 보정된 링크를 쓰며 최근 수정일 정렬은 base를 벗긴 덱 slug로 계산한다.
- hero action·직접 지정한 prev/next 링크도 route middleware가 처리한다.
  다국어 지원 확대는 별도 범위이며 현재 검증은 한국어 root locale 기준이다.
- `.astro/site-build.json`은 실제 빌드의 base·site·outDir를 기록한다. 내부 링크 검사는 이 값을
  읽어 게시 URL을 출력 파일에 대응하고 base 밖의 내부 참조를 오류로 잡는다.

패키지 업그레이드 시 topics 보정이 여전히 필요한지 확인하고 `npm run check:base`로 검증한다.
배포 설정은 [deploy.md](deploy.md), 검증 범위는 [verification.md](verification.md)를 따른다.

## 다이어그램과 이미지 확대

- **다이어그램은 전부 D2다** (규칙은 [d2-authoring.md](d2-authoring.md)).
  자체 integration `src/integrations/d2.mjs`가 빌드 시 SVG 파일을 만들고 `<img>`로 넣으므로 문법 오류를
  빌드가 잡는다. 기본 `<img>` 출력을 유지해야 다크 모드와 자동 확대가 함께 안정적으로 동작한다.
  D2 `link:`·`tooltip:`이 필요한 그림만 펜스 단위 `inline=true` + `<Zoom>`으로 쓴다(2026-10-13).
  이를 위해 `MarkdownContent.astro`가 그림 클릭을 확대 버튼으로 넘기고 `svg[data-d2-inline] a`의 click
  전파를 끊으며(D2의 중첩 svg 때문에 플러그인의 클릭 처리가 닿지 않는다), `custom.css`가 인라인
  svg를 본문 폭에 맞추며, `site-paths`가 `d2` 펜스 안 `link: /…`에 base를 붙인다.
  inline 출력의 크기·제목·`data-d2-inline` 표시는 integration이 SVG 문자열에 직접 넣고, rehype 플러그인
  `src/integrations/d2-inline.mjs`는 D2가 심는 `<style>`이 Astro MDX에서 접히지 않게만 지킨다
  (MDX가 `<style>` 본문을 `set:html`로 접고 정적 최적화가 그 속성을 글자 그대로 직렬화하는 문제).
- integration은 렌더된 SVG를 후처리한다(`softenEdgeLabels`): 엣지 라벨의 mask를 떼고 라벨 상자에
  반투명 배경을 넣어 선이 라벨 뒤로 보이게 한다. d2는 `src/d2/`를 cwd로 실행하며, 로고는
  `src/d2/icons/`에 두고 펜스에서 `icon: icons/<이름>.svg`로 쓴다(규칙은 d2-authoring.md).
- 2026-10-13까지는 [astro-d2](https://astro-d2.vercel.app/)를 썼다. 이 레포가 쓰는 기능은 펜스 속성 몇 개와
  `<img>`/inline 출력뿐인데, astro-d2 0.14는 쓰지 않는 D2.js WebAssembly(`@d2lang/d2`, 92MB)를 빌드마다
  정적으로 로드하고, `satteri@0.9` 요구로 Starlight 0.42와 호이스팅 충돌을 일으켰으며(루트 `satteri`가
  0.9가 되면 `<Steps>`·`<Tabs>`의 `htmlToHast` import가 깨진다), inline 모드에서 `d2version` 속성을
  못 알아봐 제목·크기 처리가 빠졌다. 그래서 같은 산출물 경로 규칙을 지키는 자체 integration으로
  바꿨고, 교체 직후 기존 SVG 전부가 바이트 단위로 같음을 확인했다.
- 초기에는 Mermaid(`astro-mermaid` + 자체 `MermaidZoom.astro` 확대 층)를 함께 썼지만,
  2026-08 덱 단위 일괄 마이그레이션(이슈 #2)으로 전부 D2로 변환하고 통합을 제거했다.
  클라이언트 렌더라 문법 오류가 빌드를 통과하는 점, 테마 전환 때 SVG를 다시 그리는 점이
  검증 비용의 주범이었다.
- D2 생성은 native D2 `v0.9.0`을 사용한다. `scripts/prepare-d2.mjs`가 macOS arm64/x64와
  Linux x86_64/arm64의 공식 standalone archive 및 SHA-256을 코드에 고정하고,
  `node_modules/.astro/d2/v0.9.0/` 아래 캐시를 준비한다. integration이 그 바이너리를 절대 경로로
  실행하므로 로컬·Cloudflare Pages 모두 시스템 전역 설치가 필요 없고 `PATH`도 건드리지 않는다.
- archive는 임시 디렉터리에서 다운로드·checksum 검증·압축 해제하고, 실행 권한과
  `d2 --version == v0.9.0`까지 확인한 디렉터리만 원자적으로 캐시에 반영한다. 캐시 hit에서도
  실행 권한과 버전을 다시 확인한다. 기본 레이아웃은 `elk`, 손그림(sketch) 모드가 기본이다(2026-10-13).
- 생성된 `public/d2/`는 빌드 산출물이므로 `.gitignore`에서 제외한다.
- `starlight-image-zoom`은 일반 Markdown/MDX 이미지와 D2 `<img>`를 자동으로 감싼다.
  `<SourceFigure>`는 원문 출처 링크와 이미지 확대 동작이 충돌하지 않도록 `<Zoom>`을 직접 쓴다.
- 이 저장소는 Pagefind 덱 라벨용 `MarkdownContent` override가 이미 있으므로 플러그인이 자체
  override를 설치하지 않는다. 기존 `MarkdownContent.astro`가 `<ImageZoom />` 런타임을 직접
  렌더해야 검색 메타와 이미지 확대가 함께 동작한다.
- Markdown 프로세서는 `@astrojs/markdown-remark`의 `unified()`를 명시한다. 처음에는
  `starlight-image-zoom` 0.15가 Astro 7 기본값인 Sätteri를 지원하지 않아서였고, 0.16(2026-10)에서
  지원이 추가됐지만 `src/integrations/site-paths.mjs`가 `config.markdown.processor.options.remarkPlugins`에
  직접 remark 플러그인을 끼워 넣는 구조라 Sätteri에서는 `astro:config:setup`이 실패한다
  (2026-10-13 확인). Sätteri로 가려면 그 integration을 `mdastPlugins` 방식으로 이식하고 MDX의 JSX
  노드 처리까지 검증해야 하므로, 그때까지 이 설정과 직접 의존성을 유지한다.

## 외관 — 세 겹

- **테마**: `starlight-theme-dracula` (2026-10-14, Rapide에서 교체). 다크는 Dracula, 라이트는 공식 밝은 변형
  Alucard(크림색 배경 `#fffbeb`)이고 코드 블록은 두 모드 모두 Dracula 구문 테마의 검은 바탕이다.
  D2 테마도 여기에 맞춰 라이트 7 Aubergine, 다크 200 Dark Mauve를 쓰고, integration 후처리(`matchPageBackground`)가
  D2 배경색을 페이지 배경(`#fffbeb`·`#282a36`, `astro.config.mjs`의 `background`)으로 바꿔 그림이 흰 상자로 뜨지
  않게 한다. 테마를 바꾸면 이 두 색도 같이 바꾼다. 의미 팔레트 여섯 색은 바꾸지 않았다.
  D2 `<img>`의 다크 전환은 OS가 아니라 Starlight 토글을 따른다 — 토글이 html에 `color-scheme`을 걸고
  브라우저가 그 값을 `<img>` 안 SVG의 `prefers-color-scheme`에 전달하기 때문이다.
- **폰트**: Pretendard Variable 셀프호스팅. `customCss`의 **dynamic subset** CSS가 핵심이다
  — 한글 폰트는 웨이트당 수 MB라, 쓰인 글자의 조각만 내려받는 이 방식이 아니면 못 쓴다
- **본문 폭**: `--sl-content-width: 55rem` (기본 45rem은 다이어그램·표 위주 문서에 좁다)

## 검색 결과의 덱 이름 표시

여러 덱에 같은 용어가 나와서 (스케줄링, 인증, 테마 …) 검색 결과만으로는
어느 덱 문서인지 구분이 안 됐다. 결과마다 제목 위에 **"덱: CKA"** 라벨을 붙였다.

세 파일이 한 세트다 —

1. **`src/components/layout/MarkdownContent.astro`** — Starlight 기본 `MarkdownContent`를
   감싸는 override. `data-pagefind-meta="덱:<라벨>"` 빈 span 하나를 본문 앞에 심는다.
   - Pagefind는 `<main data-pagefind-body>` **안의** meta만 수집하는데, Starlight이
     그 속성을 `<main>`에 붙이므로 본문 첫 공통 진입점인 이 컴포넌트에서 심는다
   - 덱 라벨은 `starlight-sidebar-topics`의 라우트 데이터
     (`Astro.locals.starlightSidebarTopics`)에서 `isCurrent`인 topic의 label을 읽는다
	 → **파생된 topic label과 자동으로 일치**하고, 새 덱을 만들어도 손댈 곳이 없다
   - 랜딩(`/`)처럼 topic 밖 페이지는 meta 없이 렌더된다 (라벨 없음)
2. **`astro.config.mjs`** — `components.MarkdownContent` 등록 한 줄
3. **`src/styles/custom.css`** — Pagefind 기본 UI는 커스텀 meta를 결과 카드 **맨 아래**
   태그 칩(`.pagefind-ui__result-tags`)으로 그린다. 카드 컨테이너가 flex column이라
   `order: -1`로 제목 위에 올리고, 칩 배경을 빼서 작은 회색 라벨로 바꿨다

기댄 내부 동작 (0.41.x + Pagefind UI 1.5.x에서 확인):

- Pagefind 기본 UI는 `title`/`image`/`image_alt`/`url` 외의 meta를
  자동으로 "키: 값" 텍스트로 렌더한다 → 별도 UI 코드가 필요 없다
- meta 값이 인덱스에 들어가므로 **빌드해야 반영**된다 (dev 서버에선 검색 자체가 비활성)

### 시도했다가 되돌린 것 — 덱별 그룹핑

결과를 덱별로 묶어 보여주는 버전(덱 이름 + 건수 헤더로 구분)도 만들었었다.
그룹핑은 Pagefind 기본 UI에 없어서 **Starlight `Search` 컴포넌트를 통째로 교체**하고
Pagefind JS API(`debouncedSearch` → `result.data()` → meta로 그룹핑)로 직접 렌더해야 했는데,
동작은 했지만 **Starlight 업그레이드 시 검색 모달의 개선을 못 따라가는 비용**이
과하다고 판단해 라벨 표시까지만 남겼다. 다시 필요하면 git 히스토리가 아니라
이 접근법 요약을 출발점으로 삼으면 된다 — 모달 셸(버튼·Ctrl+K·dialog)은 기본
`Search.astro`에서 복사하고, 결과 영역만 자체 렌더러로 바꾸는 구조였다.

## 랜딩 덱 카탈로그와 최종 수정일

`DeckCatalog.astro`와 `Sidebar.astro`는 공통 `src/data/deck-updated-at.ts`를 통해
Starlight가 페이지의 마지막 업데이트를 구할 때 쓰는
`virtual:starlight/git-info`의 `getNewestCommitDate()`를 재사용한다. 각 덱의 index와 본문 페이지 중
가장 최근 커밋일을 카드의 **마지막 수정**으로 표시한다. 파일 시스템 mtime은 배포 체크아웃 때
바뀌므로 사용하지 않는다.

랜딩의 보기 전환으로 카테고리 카드와 전체 덱 테이블을 오갈 수 있다. 기본 보기는
테이블이고 서버 렌더 시점에 최근 수정일 내림차순으로 정렬해 둔다. 선택한 보기는
`localStorage` 키 `deck-catalog-view`에 저장한다. 테이블은 덱 이름·카테고리·최근 수정일을 제목행
버튼으로 정렬하며, 한 번 더 누르면 오름차순·내림차순을 바꾼다. 수정일이 없는 덱은
정렬 방향과 관계없이 마지막에 둔다. 48rem 이하 화면에서는 카테고리 열을 접어
가로 스크롤 없이 덱·최근 수정일 열만 남긴다.

## 랜딩 이름 검색과 태그 필터

덱 이름 검색창은 입력할 때마다 목록을 좁힌다. 대소문자를 구분하지 않고, 공백으로 나눈
검색어가 모두 이름에 포함된 덱을 찾는다. 검색어와 선택한 태그는 함께 적용되며 카드·테이블
전환과 정렬 후에도 유지된다. 검색 결과에 맞춰 태그별 개수도 갱신한다. 검색어는 `q`, 태그는
`tags` URL 매개변수로 복원하고, ‘필터 지우기’는 둘 다 초기화한다.

카테고리는 굵은 묶음이고, 카테고리를 가로지르는 주제는 태그가 맡는다.
태그는 종류 구분 없이 `{ id, label }`로 관리하며, 랜딩의 필터와 덱 라벨에 모두 표시한다.
실습·시험·온프렘·클라우드 태그는 전역 어휘와 각 덱에서 삭제했다. 기존 URL의 삭제된 태그는
모르는 id와 동일하게 무시한다. 태그가 없는 덱도 전체 목록과 카테고리에 표시한다.
여러 태그를 고르면 모두 포함한 덱만 남는다는 안내와 결과 개수를 표시한다.
‘필터 지우기’는 필터 상단에 항상 두고, 선택이 있으면 강조색 버튼으로 활성화한다.

랜딩의 hero 소개는 없애고 이름 검색·태그 필터부터 표시한다. Starlight이 대신 만드는 제목 패널은
`custom.css`에서 시각적으로 숨겨 접근성·본문 바로가기용 h1을 유지한다.
필터는 별도 내부 스크롤 없이 본문과 함께 스크롤한다. 태그 영역 전체가 사이트 헤더 위로
사라지면 헤더 아래에 현재 검색어·태그와 ‘초기화’ 버튼을 담은 한 줄 요약을 띄운다.
검색어·태그 선택이 없으면 ‘전체 덱’을 표시하고 초기화는 비활성화한다. 긴 조건은 요약 안에서
가로로 스크롤하며, 다시 태그 영역으로 올라오면 요약은 숨긴다. 요약은 fixed로 두어
표시 여부가 문서 높이나 스크롤 위치를 바꾸지 않는다.
카탈로그는 최소 화면 높이를 확보하고 스크롤 앵커 보정을 끈다.
태그 개수는 두 자리 폭을 확보해 선택 시 줄바꿈을 유지한다.

결정한 것들:

- **교집합(AND)이다.** 합집합은 대부분의 덱을 남겨 필터가 아무 일도 안 하는
  것처럼 보인다. 대신 AND는 막다른 길이 생기므로, 선택이 바뀔 때마다 남은 덱 기준으로
  칩 개수를 다시 세고 0이 되는 칩은 `aria-disabled`로 흐리게 해 눌리지 않게 한다.
  `disabled` 속성은 쓰지 않는다 — 탭 순서에서 빠지면 어느 칩이 죽었는지 알 수 없다.
  선택된 칩은 흐려지지 않으므로 막다른 길에서도 되돌아 나올 수 있다.
- **`localStorage`에 저장하지 않는다.** 보기 전환은 "나는 표가 편하다"는 지속되는
  취향이지만 검색어·태그 선택은 그때의 질의다. 저장하면 다음에 왔을 때 덱 대부분이 말없이
  사라진다. 대신 `?q=agent&tags=agent`으로 URL에 남긴다.
- **`replaceState`다.** `pushState`면 칩을 누른 횟수만큼 뒤로가기가 필요하고,
  `popstate` 리스너를 같이 달지 않으면 Back이 URL만 바꾸고 UI는 그대로인 버그가 난다.
  태그 부분은 `searchParams.set` 대신 직접 조립한다 — 그쪽은 쉼표를 `%2C`로 인코딩해
  ASCII id를 쓴 이유(읽히는 링크)를 무너뜨린다. tag id는 `check-content`가
  `[a-z0-9-]`로 강제하므로 이스케이프가 필요 없다. 검색어는 `searchParams.set`으로 인코딩한다.
- **필터 바·툴바·태그 칩·테이블 보기·빈 상태에 `data-pagefind-ignore`가 붙어 있다.** 랜딩도
  `data-pagefind-body` 대상이라, 두지 않으면 온프렘·실습·쿠버네티스 같은 칩 라벨이
  `/`에 실려 진짜 덱 페이지와 검색 순위를 다툰다. 카드마다 반복되는 태그가 오히려
  필터 바보다 무게가 크다. 테이블 보기는 카드 보기와 같은 제목·설명을 한 번 더 실을
  뿐이라 통째로 뺀다 — `hidden`이어도 Pagefind는 빌드된 HTML을 그대로 읽는다.
  이걸로 랜딩의 색인 분량이 절반쯤이 된다.
- **태그를 검색에 연결하지는 않았다.** `aliases`는 "다른 이름"으로 렌더되는데 `온프렘`은
  LiteLLM의 다른 이름이 아니다. `data-pagefind-meta`는 결과 카드에 칩을 하나 더 그리는데
  `custom.css`의 `.pagefind-ui__result-tags { order: -1 }`이 칩 하나를 전제로 짜여 있다.
  의미상 맞는 `data-pagefind-filter`는 Starlight 번들 UI에 필터 컨트롤이 없어 죽은 코드가 된다.
- 필터는 DOM에서 요소를 빼지 않고 `hidden`으로 감춘다. 정렬이 `rowsContainer.rows`를
  재배치하므로 제거하면 이후 정렬에서 영영 빠진다. 다만 `[hidden]`은 UA 규칙이라
  `.deck { display: flex }` 같은 작성자 규칙에 지므로 `display: none`을 명시해야 한다.
- 필터 안내용 `aria-live`는 두 보기 패널 **바깥**에 있다. 정렬용 `data-sort-status`는
  테이블 래퍼 안이고 그 래퍼는 카드 보기에서 `hidden`인데, `hidden` 하위의 live region은
  접근성 트리에 없어 아무것도 읽지 않는다.

기댄 내부 동작 (0.41.x 기준으로 확인):

- dev에서는 파일별 `git log`, build에서는 Starlight가 빌드 시작 시 한 번 수집해 인라인한 Git
  이력을 사용한다
- Cloudflare Pages의 얇은 checkout은 모든 문서를 HEAD에서 추가된 것처럼 보이게 한다.
  `npm run build`의 `prebuild`가 `CF_PAGES=1`이고 저장소가 얇은 경우에만 `git fetch --unshallow`로
  전체 이력을 확보한 뒤 Starlight 빌드를 시작한다
- 아직 커밋되지 않아 이력이 없는 새 문서는 계산에서 제외하고, 덱 전체에 이력이 없으면 날짜를
  표시하지 않는다
- Starlight 업그레이드 시 `virtual:starlight/git-info`와 `getNewestCommitDate(filePath)`가 유지되는지
확인한다

## 별칭과 검토 상태

`introduced`가 있는 페이지는 `MarkdownContent.astro`가 본문 첫머리에 소개 연월과 발표 출처를
표시한다. `month`는 `YYYY-MM`, `event`는 발표 성격, `source`는 공식 근거 URL이며
`content.config.ts`에서 검증한다. 소개 시점과 내용 검토일을 구별하고, 월별 정리에도 같은 값을 쓴다.

`MarkdownContent.astro`는 덱 index에서는 `_deck.mjs`의 별칭을, 개별 페이지에서는 frontmatter의
`aliases`를 Pagefind가 읽을 수 있는 본문 앞 meta로 표시한다. 둘을 같은 배열에 중복해서 적지 않는다.

**`reviewedAt`·`status`는 2026-10-02부터 더 쓰지 않는다.** 새 페이지에 넣지 않고, 기존 페이지는
수정할 때 지운다([AGENTS.md](../AGENTS.md#콘텐츠-원칙)). 아래 표시·검사·보고서 코드는 남은 페이지를
위해 유지하며, 두 필드를 쓰는 페이지가 없어지면 스키마·`MarkdownContent.astro`의 표시·
`check-content.mjs`의 날짜 검사·`report:content`의 검토 집계·`reviewIntervalDays`를 함께 제거한다.

`reviewedAt`은 수정일이 아니라 내용을 실제로 재확인한 날짜다. 날짜가 없는데 schema 기본값으로
`stable`을 넣으면 미검토 문서가 안정된 문서처럼 보이므로 기본값을 없앴다. 표시 규칙은 다음과 같다.

- 날짜와 status 모두 없음 또는 `status: unreviewed`: 검토 관련 문구를 표시하지 않음. 보고서에서는 이력 없음으로 집계
- 날짜만 있음: `stable`로 해석하고 `내용 검토: 날짜`만 표시
- 날짜 + `review` 또는 `stale`: `검토 필요` 또는 `오래된 내용`

덱별 기본 검토 주기는 `_deck.mjs`의 `reviewIntervalDays`(생략 시 180일)이며,
`npm run report:content`가 미검토·주기 초과 현황을 보여 준다. 주기 초과는 보고서 대상이지 build 실패는
아니다. 오래된 사실을 발견했을 때 작업을 막기보다 우선순위를 드러내기 위한 선택이다.

## 로케일

한국어 전용 사이트라 `defaultLocale: 'root'` + `root: { label: '한국어', lang: 'ko' }`.
URL에 언어 프리픽스가 없고, Starlight UI 문구(검색 버튼, 목차 제목 등)가 한국어로 나온다.
단 **Pagefind UI 문구는 한국어 빌트인 번역이 없어 영어로 나온다**
("13 results for …") — Starlight 한국어 번역에 `pagefind.*` 키가 없기 때문. 감수하기로 했다.

## 바꾸지 않은 것

- **검색은 Pagefind 기본 UI 그대로** — 위의 meta 주입만 얹었다.
  `Search` 컴포넌트를 교체하지 않았으므로 업그레이드 영향이 없다
- 기본 프론트매터에 점진적 이관용 `legacyThesis`, 검색용 `aliases`, 제거 중인
  `reviewedAt` · `status`를 확장했다
  (쓰는 방식의 규칙은 [content-authoring.md](content-authoring.md))
- 패키지 관리자는 npm이다. 예전 pnpm 구성(`pnpm-workspace.yaml`의 빌드 스크립트 허용)은 2026-09에 제거했다
  — [deploy.md](deploy.md) 참고
