# AGENTS.md

Astro Starlight 기반 개인 스터디 노트 사이트. 슬라이드가 아니라 **축적·검색·참조**에 맞는 문서다.
덱 하나 = `src/content/docs/<이름>/` = topic 하나.

## 작업에 맞춰 읽을 것

- 구조·명령을 처음 확인하거나 새 덱을 만들 때: [README.md](README.md)
- 설계·계획 문서를 만들거나 실행·재개할 때: [docs/superpowers/README.md](docs/superpowers/README.md)
- 콘텐츠를 쓰거나 고칠 때: [docs/content-authoring.md](docs/content-authoring.md)
- 사이트 구조·화면 영역·수정 범위를 지칭할 때: [화면 명칭과 수정 요청](src/content/docs/starlight/site-vocabulary.mdx)
- D2를 추가하거나 고칠 때: [docs/d2-authoring.md](docs/d2-authoring.md)
- 검증 방법: [docs/verification.md](docs/verification.md)
- 배포를 준비하거나 배포 설정을 고칠 때: [docs/deploy.md](docs/deploy.md)
- Starlight 설정·override·컴포넌트를 고칠 때: [docs/starlight-changes.md](docs/starlight-changes.md)와 대상 컴포넌트 머리 주석
- 덱 폴더의 `_baseline.md`를 **그 덱을 고치기 전에 반드시 먼저 읽는다.**

현재 작업에 필요한 문서를 읽고, 같은 세션에서 이미 읽은 지침은 변경되거나 작업 범위가 달라질 때 다시 확인한다.
이미 컨텍스트에 전달된 AGENTS.md는 매 요청마다 다시 읽지 않는다. 수정 대상 경로에 아직 읽지 않은
하위 AGENTS.md가 있으면 수정 전에 확인한다.

## 작업 방식

소유자 1인이 혼자 쓰는 레포다. `main`에 직접 커밋하며, 커밋·푸시는 요청받았을 때만 한다.
수정 요청은 관련 파일 편집·검증·이번 변경으로 생긴 오류 수정까지 수행한다. 범위 안의 일상적인
구현 선택은 진행하고, 사용자 결정이 필요한 범위 변경이나 아직 허용받지 않은 외부 쓰기는 먼저 확인한다.
지침 때문에 중단한다면 파일 경로와 해당 문장, 현재 요청에 적용되는 이유를 설명한다.

작업 설명과 결과 보고에는 [공통 명칭](docs/content-authoring.md#사이트-구조와-화면-명칭)을 쓴다.
사용자의 표현이 달라도 문맥·URL·화면의 글자로 대상을 먼저 찾는다. `페이지 모음`이나 `목차`라는
말만으로 범위를 넓히지 않고, 실제 수정 범위를 결정할 수 없을 때만 확인한다.

사이트 콘텐츠·코드·설정을 바꾼 작업은 마지막에 `npm run check`를 한 번 실행한다. 빌드에 포함되지 않는
지침·계획 문서만 바꿨다면 diff와 참조 경로만 확인한다. 변경별 최소 범위는
[docs/verification.md](docs/verification.md)를 따른다.
브라우저 검증은 자동 검사로 확인할 수 없는 화면 동작·레이아웃에 구체적인 확인 필요가 있을 때만,
바뀐 동작과 대표 페이지 1~2개에 한정해서 한다. 페이지 추가·분할·이름·순서 변경만으로 브라우저를 띄우지 않는다.
검사가 통과하면 끝낸다. 새 변경·실패·미해결 문제가 있을 때만 해당 검사를 반복한다.

## 작업 계획

설계·계획 문서는 superpowers가 정한 자리를 쓴다. 설계는 `docs/superpowers/specs/YYYY-MM-DD-<주제>-design.md`,
계획은 `docs/superpowers/plans/YYYY-MM-DD-<이름>.md`, 진행 기록은 `.superpowers/sdd/`(Git 제외)다.
형식은 superpowers skill이 정하고, 폴더별 역할은 [docs/superpowers/README.md](docs/superpowers/README.md)에 있다.

- 파일을 만들지는 superpowers의 작업 규모 판단을 따른다. 작은 변경은 편집·검증하고 대화로 보고하며,
  프로젝트 규모 작업은 설계를 파일로 남기고 합의된 설계로 계획을 만든다. 파일 생성에 별도 승인은 필요 없다.
- 실행 범위는 사용자 요청이 기준이다. 계획만 요청하면 구현하지 않고, 특정 작업만 요청하면 그 작업의
  수정·검증·기록까지 마친다. 전체를 맡겼다면 다음 작업을 이어 간다. 계획 파일이 있어도 이미 허용된 구현의
  승인을 다시 묻지 않는다.
- 기존 계획을 재개하면 ledger·git log·현재 diff를 대조해 끝난 작업을 반복하지 않는다.
- 앞으로도 필요한 결정은 ledger를 지우기 전에 덱 `_baseline.md`·본문·`docs/` 지침으로 옮긴다.

## 덱

### 콘텐츠 원칙

작성 전 독자·중심 질문·학습 결과를 정하고 공식 근거·예제를 확인한다. 작성 뒤 의미를 리뷰하고 기술 검증을 한다.
절차·리뷰 표·문서 종류별 기준은 [작성과 의미 리뷰](docs/content-authoring.md#작성과-의미-리뷰)가 정본이다.
검사 통과나 필수 컴포넌트의 존재만으로 내용 검토를 대신하지 않는다.

- **소유자가 쉽게 이해하는 것**을 AI가 찾기 쉬운 것보다 우선한다.
- **사내 정보를 적지 않는다.** 공개 사이트이므로 회사·팀에만 해당하는 사실은 어느 조직에나 통하는 가정과
  예시 값으로 바꾼다. 요청에 사내 맥락이 섞여 있어도 같다.
  판정 기준은 [사내 정보를 적지 않는다](docs/content-authoring.md#사내-정보를-적지-않는다)를 따른다.
- 페이지 제목·파일명·URL에 순서 번호를 넣지 않는다. 읽는 순서는 `_deck.mjs`의 `sidebar`가 관리하고,
  본문 참조와 구성도도 번호 대신 이름과 링크를 쓴다.
- 첫머리 `<Thesis>`("결론부터")에 핵심 결론을 1~5개 불릿, 불릿당 한 문장으로 둔다. 끝에 `요약`으로 반복하지 않는다.
  [설명 순서와 제목](docs/content-authoring.md#설명-순서와-제목)을 따른다.
- 페이지마다 "왜"에 답한다. 어떤 상황에서 막히는가, 없으면 무슨 일이 생기는가, 대안 대신 왜 이것인가,
  그래서 독자는 무엇을 하는가. [왜를 남긴다](docs/content-authoring.md#왜를-남긴다)를 따른다.
- 짧고 분명하게 쓴다. 문단 3문장, 불릿 2문장 이내이고 본문 전체를 불릿으로 바꾸지 않는다.
  [문장과 문단](docs/content-authoring.md#문장과-문단)을 따른다.
- 한 제목 아래 한 가지 내용만 다룬다. 길어지면 같은 사이드바 그룹의 여러 페이지로 나눈다.
- 관계·흐름은 D2·표·공식 구조도로 보여 주고, 단계별 설명은 D2 단계 탭·Steps·상태 표를 쓴다.
  [시각 자료](docs/content-authoring.md#시각-자료와-외부-이미지)와 [D2 작성 규칙](docs/d2-authoring.md)을 따른다.
- 분리한 D2 원본은 사용하는 덱의 `_d2/`에 두고, MDX에서 `...@_d2/<이름>`으로 참조한다.
  덱 폴더만 복사해도 원본이 함께 옮겨지도록 전역 `src/d2/`나 다른 덱에 원본을 두지 않는다.
- 기존 페이지에는 수정 종류에 맞는 규칙만 적용하고 일괄 이관하지 않는다. `reviewedAt`·`status`는 더 쓰지 않는다.
  [기존 페이지에 적용하는 시점](docs/content-authoring.md#기존-페이지에-적용하는-시점)을 따른다.

덱 정보는 사용하는 곳과 가까운 세 원본으로 나뉜다.

- 전역 `category`·`tag` 어휘: `src/data/catalog.mjs`
- 덱 메타데이터·사이드바 그룹과 페이지 순서·index 구성도: `src/content/docs/<덱>/_deck.mjs`
- 페이지 제목·설명·검색 별칭: 각 MDX의 frontmatter

`src/data/load-decks.mjs`가 이 원본들을 읽어 덱 목록·topic 사이드바·랜딩 카드를 파생한다.
`src/data/decks.mjs`는 re-export일 뿐 직접 편집하지 않는다. 새 덱은 `_deck.mjs`로 자동 발견된다.

`_baseline.md`에는 독자·선행 지식·학습 결과, 포함/제외 범위, 기준 버전, 덱 전용 서술 규칙을 둔다.
`_`로 시작하는 파일은 콘텐츠 컬렉션에서 제외되어 빌드·검색·사이드바에 나오지 않는다. 모든 덱에 baseline이
있어야 하며 `npm run check`가 이를 강제한다.

새 페이지·덱의 필수 필드, category·tag 선택, `<TermIntro>` 규칙은
[콘텐츠 작성 규칙](docs/content-authoring.md)의 프론트매터·덱 메타데이터 절을 따른다.

## 절대 깨뜨리면 안 되는 것

- `astro.config.mjs`의 integration은 `sitePaths()` → `d2()` → `starlight()` 순서를 유지한다.
  `d2()`(자체 integration, `src/integrations/d2.mjs`)가 `starlight()`보다 먼저 와야 D2 펜스를 가로채고,
  `sitePaths()`가 그보다 먼저 와야 펜스 안 `link:` 값에 base를 붙인 뒤 SVG로 바뀐다.
- 모든 본문 MDX는 같은 폴더 `_deck.mjs`의 `sidebar[].pages`에 확장자 없는 상대 경로로 정확히 한 번 등록한다.
  덱 `index.mdx`는 목록에 넣지 않는다. 파일명을 바꾸면 `sidebar`·`map`·본문 링크를 함께 확인한다.
- 랜딩(`/`)은 어느 topic에도 속하지 않는다. topic 밖 페이지는 plugin `exclude`에 추가한다.
- 사이드바 UI는 `src/components/layout/`의 `Sidebar`·`SiteTitle`·`SidebarToggle` override 세트다.
  실제 접힘 레이아웃은 `src/styles/custom.css`의 전역 규칙이다.
