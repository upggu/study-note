# D2 다이어그램 작성 규칙

콘텐츠의 일반 구조와 MDX 규칙은 [콘텐츠 작성 규칙](content-authoring.md)을 먼저 따른다.
이 문서는 D2를 추가하거나 고칠 때만 읽는 세부 운영 규칙이다. 사실 확인은 2026-10-14에
[D2 공식 문서](https://d2lang.com/tour/intro/)와 이 레포가 고정한 D2 v0.9.0 바이너리로 했다.

**정적 관계·흐름·시퀀스 다이어그램은 D2로 그린다.** ```` ```d2 ```` 펜스는 빌드 때 SVG로 바뀌고 문법 오류는
빌드가 잡는다. 기본 출력은 `<img>`이고 이미지를 누르면 starlight-image-zoom의 확대 dialog가 열린다.
단계마다 전달 값·보관 상태를 독자가 직접 넘겨 보는 학습 UI는 별도 `LearningFlow` 컴포넌트가 맡는다
([LearningFlow 작성 규칙](learning-flow-authoring.md)). 예전 Mermaid는 2026-08에 전부 D2로 옮기고
통합도 제거했다 — ```` ```mermaid ````는 회색 코드 블록으로 렌더될 뿐이다.

## 그림은 질문 하나에 답하고, 강조할 것을 먼저 정한다

눈에 잘 들어오는 그림은 "다 그린 그림"이 아니라 **지금 절이 말하는 한 가지가 두드러지는 그림**이다.
펜스를 열기 전에 세 가지를 정한다.

1. **이 그림이 답하는 질문** — 펜스 `title`이 그 문장이 된다.
2. **핵심 노드·핵심 경로** — 보통 노드 1~3개, 엣지 1~2개. 이것만 굵고 선명하게 그린다.
3. **배경으로 물러날 것** — 나머지는 흐리거나 점선으로 둔다. 질문과 무관한 노드는 아예 뺀다.

강조는 아래 세 층을 쓰고, 한 그림에 세 층을 넘지 않는다. 모든 노드가 강조되면 아무것도 강조되지 않는다.

| 층 | 뜻 | 쓰는 수단 |
|---|---|---|
| 초점 | 이 절의 주인공 | `stroke-width: 4` + `bold: true`(아래 `focus` 클래스) |
| 의미 | 상태·역할 | [의미 팔레트](#의미-팔레트) 여섯 색 |
| 배경 | 맥락이지만 지금 주제는 아님 | `opacity: 0.45`(아래 `aside` 클래스), 점선 |

## 출력 방식 — `<img>`가 기본, 상호작용이 있으면 `inline=true`

| 기능 | `<img>`(기본) | `inline=true` + `<Zoom>` |
|---|---|---|
| 클릭 확대·다크 모드 | 자동 | 동작하지만 `<Zoom>`으로 직접 감싼다 |
| `style.animated`(흐르는 선·떠오르는 노드) | 동작 | 동작 |
| 보드 애니메이션(`animateInterval`) | 동작 | 동작 |
| `tooltip:` 호버 설명 | **죽는다** | 동작 |
| `link:` 노드·엣지 클릭 이동 | **죽는다** | 동작 |
| 페이지 무게 | SVG 파일 별도 로드 | HTML에 포함(sketch 기준 그림당 50KB 안팎) |

브라우저가 `<img>` 안의 상호작용을 막기 때문에 **툴팁이나 링크를 넣은 그림은 반드시 `inline=true`로 쓴다.**
반대로 둘 다 없는 그림은 `<img>`로 둔다. 한 페이지에 inline 그림은 **3개까지**를 기준으로 하고, 더 필요하면
그 펜스에 `sketch=false`를 줘 무게를 절반 이하로 줄인다(같은 그림이 sketch 51KB → 21KB).
작성 형태와 클릭 동작은 [툴팁과 링크](#툴팁과-링크--inlinetrue--zoom) 절에 있다.

## 펜스 속성

```md
```d2 title="빌드 시 SVG가 생성되는 문서 흐름" inline=true
```

허용 키는 `title`·`layout`·`pad`·`sketch`·`theme`·`darkTheme`·`target`·`animateInterval`·`appendix`·`inline`
열 개뿐이다. 그 밖의 키는 오타로 보고 빌드가 멈춘다(`src/integrations/d2.mjs`의 `knownKeys`).

- `title="…"`은 항상 구체적으로 쓴다. `<img>`의 alt·inline svg의 `<title>`이 되어 접근 가능한 대체 텍스트가 된다.
- 전역 기본은 `layout=elk pad=40 sketch=true theme=7 darkTheme=200`이다(`astro.config.mjs`). 펜스에는
  그 그림에만 다른 값을 적는다. 기존 펜스의 `layout=elk pad=40`은 기본값과 같아 중복이지만 무해하다.
  **sequence 펜스는 `pad=40`만 쓴다** — sequence는 layout 엔진을 타지 않는다.
- `sketch=false`는 정밀한 좌표가 필요한 그림, 무거운 inline·보드 애니메이션 그림에만 준다.
  sketch는 그림을 평균 몇십 px 넓히고 SVG를 3~4배 키운다. 한글은 시스템 폰트라 모양이 바뀌지 않고
  영문·숫자만 손글씨체가 된다.
- `target=`·`animateInterval=`은 [단계 보드](#단계-보드--steps--animateinterval) 절, `appendix=`는 [툴팁과 링크](#툴팁과-링크--inlinetrue--zoom) 절에서 쓴다.
- 외부 `.d2` 파일을 펜스로 끌어오는 `src=` 속성은 **없다**(astro-d2 시절 기능). 여러 펜스가 같은 원본을
  나눠 써야 하면 `src/d2/<이름>.d2`에 두고 펜스 첫 줄에 `...@<이름>`으로 import한다 — d2가 `src/d2/`를
  작업 디렉터리로 실행되므로 그 폴더 기준 상대 경로다.

## 강조 — 핵심 컴포넌트와 흐름을 두드러지게

아래 세 클래스를 의미 팔레트와 함께 선언해 두고 조합한다. 여러 클래스는 `class: [key; focus]`처럼
**세미콜론**으로 나열하며 왼쪽부터 차례로 적용된다(쉼표를 쓰면 `class "key, focus" not found`로 빌드가 죽는다).
같은 속성이 겹치면 노드에 직접 적은 `style`이 클래스를 이긴다.

```text
classes: {
  key:   { style: { fill: "#dbeafe"; stroke: "#2563eb"; font-color: "#1e3a8a" } }
  focus: { style: { stroke-width: 4; bold: true } }
  aside: { style: { opacity: 0.45 } }
}
user: 사용자
gw: API Gateway { class: [key; focus] }
auth: 인증 { class: aside }
svc: 주문 서비스 { class: [key; focus] }
user -> gw: 요청 { style: { stroke-width: 3; animated: true } }
gw -> auth: 토큰 검사 { class: aside }
gw -> svc: 라우팅 { style: { stroke-width: 3; animated: true } }
```

- **핵심 경로의 엣지**는 `stroke-width: 3`에 `animated: true`를 더한다. 선이 흐르는 방향이 곧 읽는 순서가
  된다. 애니메이션은 핵심 경로 한 줄기에만 준다 — 모든 선이 흐르면 방향 정보가 사라진다.
- **노드 하나를 띄우려면** `style.animated: true`를 노드에 준다. 노드가 1초 주기로 살짝 떠오르며 그림자가
  생긴다(D2의 `shapeappear`). 한 그림에 하나만, 그리고 "지금 일어나는 일"을 가리킬 때만 쓴다.
- **배경으로 물리기**는 노드·엣지 모두 `opacity: 0.45`다. 많은 노드를 한꺼번에 물릴 때는 glob으로 전부
  낮춘 뒤 핵심만 되살린다. glob은 뒤에 선언되는 노드에도 적용되므로 위치는 상관없다.

  ```text
  *.style.opacity: 0.45
  (* -> *)[*].style.opacity: 0.45
  gw.style.opacity: 1
  svc.style.opacity: 1
  (gw -> svc)[0].style: { opacity: 1; stroke-width: 3; animated: true }
  ```

- **글자 강조**는 `bold: true`가 기본이고 `font-size: 18`(기본 16)까지만 키운다. 글자를 키우면 라벨 폭이
  늘어 그림 폭 기준에 걸리기 쉽다. `italic`·`underline`은 쓰지 않는다 — 손그림 테두리와 섞이면 지저분하다.
- **구조 강조**는 의미를 고정해서 쓴다. `multiple: true`는 복제본·여러 인스턴스(Pod 복제, 읽기 복제본),
  `3d: true`는 물리 장비·노드, `double-border: true`는 경계·게이트웨이, `shadow: true`는 한 그림에 1~2개만
  띄우는 장면용이다. 꾸밈으로 섞지 않는다.
- **엣지 종류 구분**은 `stroke-dash: 3` 점선이다. 보조 흐름·비동기 응답·되돌아가는 피드백에 쓰고, 모든 선을
  점선으로 만들지 않는다.
- **범례**는 강조 층이 셋일 때만 `vars.d2-legend`로 붙인다. 항목에 같은 클래스를 주면 범례 칩에도 같은
  모양이 나온다. 오른쪽 아래에 붙어 그림이 100px 넘게 넓어지므로 붙인 뒤 다시 잰다.

  ```text
  vars: {
    d2-legend: "범례" {
      f: 이번 절의 핵심 { class: focus }
      s: 배경 { class: aside }
    }
  }
  ```

- **한 줄 설명**은 `shape: text`에 `near: top-center`로 둔다. 목록·굵은 글씨가 필요하면 `|md … |` 블록을
  쓴다 — v0.9.0부터 markdown이 SVG 네이티브로 그려져 `<img>`에서도 보인다. 긴 설명은 그림이 아니라
  본문에 적는다.

## 툴팁과 링크 — `inline=true` + `<Zoom>`

구성도의 노드를 누르면 그 컴포넌트 페이지로 가고, 용어 노드에 마우스를 올리면 한 줄 정의가 뜨는 그림이
이 레포가 쓰는 상호작용이다. 실물은 [D2 페이지의 링크·설명 절](../src/content/docs/starlight/d2.mdx)에 있다.

````mdx
import { Zoom } from 'starlight-image-zoom/components';

<Zoom label="구성도. 노드를 누르면 해당 컴포넌트 페이지로 이동한다">

```d2 inline=true title="구성도. 노드를 누르면 해당 컴포넌트 페이지로 이동한다"
gw: API Gateway {
  link: /onprem/ingress/
  tooltip: 외부 요청이 처음 닿는 곳. TLS를 끝내고 경로별로 라우팅한다
}
svc: 주문 서비스 { link: "/onprem/workloads/#deployment" }
gw -> svc: 라우팅 { tooltip: 경로 /orders 로 시작하는 요청만 }
```

</Zoom>
````

- **`<Zoom>`으로 직접 감싼다.** 플러그인의 자동 감싸기는 `<img>`에만 걸린다. `label`은 `title`과 같은
  문장으로 쓴다. JSX 안이므로 펜스 앞뒤에 빈 줄을 두고 들여쓰지 않는다.
- **노드·컨테이너·엣지 모두** `tooltip:`과 `link:`를 받는다. 툴팁이 있는 노드에는 작은 표시 아이콘이 붙고,
  `\n`으로 줄을 바꿀 수 있다. HTML `title` 속성이라 markdown은 안 먹는다.
- **링크는 base 없는 문서 주소로 쓴다.** `site-paths` integration이 `d2` 펜스 안 `link: /…` 값에 배포 base를
  붙인다(`scripts/site-paths.test.mjs`). 절 앵커가 있으면 **반드시 따옴표로 감싼다** —
  `#` 뒤가 D2 주석으로 먹힌다. 외부 URL은 그대로 쓴다.
- **링크 클릭은 이동만 하고 그 밖의 영역을 누르면 확대된다.** `MarkdownContent.astro`의 스크립트가 링크의
  click 전파를 끊고, 그림의 나머지 영역 클릭을 확대 버튼으로 넘긴다(D2 SVG는 svg가 한 겹 중첩돼 플러그인이
  안쪽 클릭을 인식하지 못한다). 확대 dialog 안에서 링크를 누르면 닫히면서 이동한다.
- **툴팁은 보조 설명이다.** 호버 전용이라 터치 화면과 검색에 안 잡히므로 핵심은 라벨과 본문에 적는다.
  링크 대상이 되는 페이지 이름도 본문에 한 번은 글자로 나와야 한다.
- **폭 규칙은 같다.** inline svg도 같은 크기로 나오고 `custom.css`가 `max-width: 100%`로 본문에 맞춘다.
  `scripts/d2-measure.mjs`는 펜스 속성과 무관하게 같은 값을 찍는다.
- 배경이 검게 나오면 `src/integrations/d2-inline.mjs`부터 본다 — Astro MDX가 D2의 `<style>`을 접어 버리는
  문제를 그 플러그인이 우회한다.
- **`<img>`를 유지한 채 링크·툴팁 내용만 남기려면** `appendix=true`를 준다. 툴팁 아이콘이 번호로 바뀌고 그림
  아래에 번호 목록이 텍스트로 그려진다. 대화형은 아니지만 참고 링크 한두 개면 충분하다. 그림이 그만큼 길어진다.

## 단계 보드 — `steps` + `animateInterval`

"요청이 들어와서 저장되기까지"처럼 **핵심 경로를 순서대로 밝히는 그림**은 `steps`로 그린다. 노드와 엣지는
루트에 한 번만 선언하고, 각 step에서는 **스타일만** 바꾼다(앞 step을 그대로 물려받는다). `animateInterval=`을
주면 보드들이 한 SVG 안에서 주기적으로 교차하며 `<img>`에서도 돈다.

````md
```d2 title="요청이 게이트웨이를 거쳐 서비스에 닿는 순서" animateInterval=1500
direction: down
classes: {
  focus: { style: { stroke-width: 4; bold: true } }
  calm: { style: { stroke-width: 2; bold: false } }
  on: { style: { stroke-width: 3; animated: true } }
  off: { style: { stroke-width: 2; animated: false } }
}
user: 사용자
gw: API Gateway
svc: 주문 서비스
user -> gw: 요청
gw -> svc: 라우팅
steps: {
  1: { user.class: focus; (user -> gw)[0].class: on }
  2: { user.class: calm; (user -> gw)[0].class: off; gw.class: focus; (gw -> svc)[0].class: on }
  3: { gw.class: calm; (gw -> svc)[0].class: off; svc.class: focus }
}
```
````

- **앞 step의 강조는 되돌리는 클래스(`calm`·`off`)로 명시적으로 푼다.** `class: ""`로 지우면 일부 속성이
  남는다. D2 기본 선 굵기가 2이므로 되돌리는 값도 2다.

- **보드가 있는 펜스에는 `animateInterval=` 또는 `target=`이 반드시 있어야 한다.** 둘 다 없으면 D2가 보드마다
  파일을 만들어 디렉터리로 출력하고 빌드가 깨진다. `target=steps.2`는 그 보드 한 장만 정적으로 그리고,
  `target=root`는 루트만 그린다.
- **루트 보드도 첫 프레임이다.** 애니메이션은 루트 → 1 → 2 → … 순으로 돈다. 루트를 "아무것도 강조되지
  않은 상태"로 두거나, 첫 강조를 루트에 두고 `steps`는 2단계부터 적는다.
- **엣지는 별도 줄로 선언한다.** `a -> b -> c` 체인으로 적으면 step 안에서 `(a -> b)[0]`로 가리킬 수 없다.
- **step에서 노드를 새로 만들지 않는다.** 보드마다 따로 배치하므로 노드가 늘면 프레임 사이에서 그림이 뛴다.
  스타일만 바꾸면 크기가 같아 자연스럽게 넘어간다. 간격은 1200~1800ms가 읽기 편했다.
- **보드 수는 4개(루트 포함)까지.** SVG 하나에 보드 수만큼 그림이 들어가고 sketch면 더 커진다(노드 3개·보드
  4개가 sketch 66KB, `sketch=false` 18KB). 길어지면 `sketch=false`를 주거나 두 펜스로 나눈다.
- **`scenarios`는 "정상 / 장애" 같은 대안 보기**에 쓴다. 베이스를 물려받아 일부만 바꾸므로 같은 그림을 두 번
  그리지 않는다. 펜스 둘에 `target=root`·`target=scenarios.fail`을 주고 본문에서 나란히 보여 주거나,
  `animateInterval`로 교차시킨다. `layers`는 새 보드라 이 레포에서는 쓸 일이 거의 없다.
- **보드 사이 클릭 이동(`link: layers.x`)은 지원하지 않는다.** D2가 파일 간 링크(`root.layers.x`)로 출력하는데
  빌드 파이프라인이 한 파일만 싣는다. 사용자가 직접 단계를 넘기며 값을 읽어야 하면 `LearningFlow`다.
- **측정과 확인.** `d2-measure.mjs`는 바깥 viewBox(보드 중 최대)를 찍는다. `--png`는 한 프레임만 보여 주므로
  프레임별 확인은 `target=steps.N`을 임시로 줘서 보고, 실제 교차 동작은 빌드 후 브라우저에서 한 번 본다
  ([검증 지침](verification.md)의 D2 항목). 엣지 라벨 뒤 반투명 배경은 첫 보드 좌표 기준이라 보드마다 라벨
  위치가 다르면 어긋날 수 있다 — 스타일만 바꾸는 규칙을 지키면 생기지 않는다.

## 레이아웃과 폭

- **기준 본문 폭은 632px**(1280px 뷰포트)이다. 1440px에서 792px, 1680px 이상에서는 880px이지만 좁은 쪽인
  노트북 화면을 기준으로 삼는다. SVG width가 CSS px 그대로 쓰여 632를 넘으면 그 비율만큼 축소되어 글자가
  작아진다. **900px을 넘으면 배치를 다시 잡는다.** 폭은 눈대중하지 말고 잰다 —
  `node scripts/d2-measure.mjs <파일.mdx>`가 빌드 없이 파일당 1~2초로 빌드 산출물과 같은 값을 찍는다.
- **방향은 재서 고르되 출발점은 `down`이다.** 원본이 가로였어도 대부분 `down`이 이긴다. `right`가 이기는 건
  **팬아웃**(한 노드에서 갈래 4개 이상)과 **독립된 쌍의 나열**(서로 연결 없는 A→B 짝 여러 개)뿐이고,
  팬아웃이라도 자식 라벨이 20자 넘는 두 줄이면 `down`이다. **엣지 없는 형제 컨테이너는 방향이 뒤집혀
  적용된다** — `right`에서 세로로 쌓이고 `down`에서 가로로 늘어선다.
- **라벨 재접기(`\n` 위치만 옮기기)는 방향을 정한 뒤에 한다.** diamond는 같은 글자 수의 사각형보다 훨씬
  넓으므로 팬아웃이 넓으면 diamond 라벨부터 접는다. 900 아래로 못 내리면 접지 않되, 축소율이 0.1 이상
  좋아지면 예외다. 문구는 바꾸지 않고 `\n` 위치만 옮기며 `·`로 이은 라벨은 `·`를 줄 끝에 남긴다.
- **재배치·재접기 후에는 렌더를 눈으로 본다.** 폭 수치는 겹침을 잡아 주지 않는다.
  `node scripts/d2-measure.mjs --png <파일.mdx>`가 블록별 PNG를 `.d2-measure/`에 만든다.
- **`direction`은 elk·dagre에서 다이어그램 전체에 하나만 걸린다.** 컨테이너 안 `direction`은 조용히
  무시된다([D2 — Layouts](https://d2lang.com/tour/layouts/)). 컨테이너 안 방향이 필요하면 `layout=tala`나
  아래 `grid-rows`를 쓰고, 둘 다 안 맞으면 루트를 `down`으로 두고 세로로 길게 간다.
- **`layout=tala`는 펜스 단위로 쓴다.** v0.9.0부터 바이너리에 번들돼 별도 설치가 없다. TALA만 컨테이너별
  `direction`, 컨테이너 `width`·`height`, 다른 객체를 가리키는 `near`를 존중한다. 원본 노트 레포의 수백 개 펜스를
  TALA로 재 보니 넓어진 그림이 좁아진 그림의 세 배였으니 일괄 전환하지 말고, 가로 1,200px을 넘는
  체인·순환 흐름이나 레인 안 방향이 필요한 그림에서 elk와 둘 다 재서 고른다. 결과는 결정적이다.
- `layout=dagre`는 거의 시도할 가치가 없다(이슈 #2 통산 1승 23패).
- `near: top-center` 같은 위치 상수는 모든 엔진에서 동작한다. 다른 객체 이름을 `near`로 주는 건 TALA 전용이다.

### grid-rows · grid-columns — elk에서 컨테이너 안 방향을 잡는 우회로

`grid-rows`/`grid-columns`를 주면 자식이 그 모양으로 배열된다. 루트 `grid-rows: N`은 컨테이너 N개를 세로로
쌓고, 루트 `grid-columns: 2`는 엣지 없는 컨테이너 둘을 나란히 세운다. 조건이 좁으니 **반드시 렌더를 본다.**

- 그 컨테이너의 자식이 **바깥과 엣지로 이어지지 않을 때만** 쓴다. grid는 엣지를 배치에 반영하지 않아 경계를
  넘는 엣지가 컨테이너를 관통하는 직선으로 그려지고, 여러 엣지가 한 줄로 겹쳐 가짜 체인처럼 보인 사례가 있다.
- 예외는 경계를 넘는 엣지가 **하나**뿐일 때다. 배치를 통제하는 유일한 수단은 선언 순서이고, 두 끝점을 인접
  칸에 놓으면 짧은 직선이 된다.
- 셀 폭은 가장 넓은 자식에 맞춰 균일하다. 라벨 길이가 고른 레인에만 듣는다.
- 루트가 grid면 `direction`은 무시된다. 컨테이너 안 자식을 세로로 세우려면 그 컨테이너에도 `grid-rows`를 준다.

## 문법 함정

- **노드·컨테이너 키로 D2 예약어를 쓰지 않는다.** `link`·`top`은 선언은 통과하고 **엣지에서 참조하는 순간**
  `reserved keywords are prohibited in edges`로 죽는다. `left`·`right`·`bottom`·`center`·`near`·`style`·`shape`·
  `label`·`icon`·`width`·`height`·`grid`·`classes`·`layers`·`steps`·`scenarios`·`vars`·`tooltip`도 피한다.
  키는 화면에 안 나오니 `ktop`·`conn`처럼 바꾸면 된다.
- **의미 팔레트 여섯 이름(`ok`·`bad`·`warn`·`key`·`mute`·`zone`)과 `focus`·`aside`도 노드 키로 쓰지 않는다.**
  `classes` 선언과 겹쳐 `class: ok`의 해석이 애매해진다. `fine`·`safe`·`risk`처럼 바꾼다.
- 라벨 안 `$`는 `\$`로 이스케이프한다 — `$`는 D2 치환 문법이다. `|`·`<`·`>`는 라벨을 따옴표로 감싸면 통과한다.
- `link:` 값에 `#`이 있으면 따옴표로 감싼다. 안 감싸면 뒤가 주석이 된다.
- 여러 클래스는 `class: [a; b]`다. 쉼표는 빌드 오류다.
- 같은 키를 두 번 선언하면 뒤가 앞을 덮는다. 한 액터에 note가 여럿이면 `u.n1`·`u.n2`처럼 키를 달리한다.
- D2 `<img>`에는 카드 프레임·래퍼를 씌우지 않는다. 배경색은 integration이 페이지 배경(라이트 크림색·다크
  Dracula)에 맞춰 주므로(`matchPageBackground`) 그림이 흰 상자로 뜨지 않는다.

## 로고·아이콘

제품·서비스 노드에는 글자 대신 로고를 붙일 수 있다. 로고는 `src/d2/icons/`에 둔 파일만 쓴다
(목록과 출처는 그 폴더의 README). Kubernetes 리소스·컴포넌트는 공식 아이콘 세트가 `icons/k8s/`에 있어
`icon: icons/k8s/pod.svg`처럼 kubectl 약어로 쓴다. kagent·kMCP 로고도 있다. 빌드와 `d2-measure.mjs`가 d2를
`src/d2/`를 기준 디렉터리로 실행하므로 펜스에서는 상대 경로 `icons/<이름>.svg`로 적는다. 원격 URL은 쓰지
않는다 — 하나만 실패해도 변환이 멈추고 프록시 환경에서는 설정이 더 필요하다.

```text
pg: Postgres HA { shape: cylinder; class: warn; icon: icons/postgresql.svg }
k8s: 온프렘 Kubernetes { icon: icons/kubernetes.svg; … }     # 컨테이너는 왼쪽 위에 작게 붙는다
pod: "LiteLLM Pod" { icon: icons/k8s/pod.svg }                 # Kubernetes 리소스는 k8s/ 아래 약어
gh: "" { shape: image; icon: icons/github.svg; width: 48; height: 48 }   # 로고만 있는 노드
```

- **로고를 붙이면 노드가 커진다.** 라벨 아래 로고가 들어가 높이가 늘고 폭도 조금 는다. 붙인 뒤 다시 잰다.
- 제품을 가리키는 노드에만 붙인다. 역할·개념 노드(브라우저·사람·사내 애플리케이션)에는 붙이지 않는다.
  로고가 너무 많으면 정보가 아니라 장식이다. 로고 노드에도 `tooltip:`·`link:`는 그대로 붙는다.
- 로고가 없는 제품은 README의 두 출처에서 받아 폴더에 추가하고 표에 한 줄 더한다. 50KB를 넘는 파일은 두지 않는다.
- `shape: image`는 라벨 없이 로고만 그린다. 라벨을 주면 로고 아래에 글자가 붙는다.

## 엣지 라벨 뒤의 선

D2는 연결선 라벨 자리를 SVG mask로 잘라내서 라벨이 선을 끊어 보인다(끌 수 없다). integration이 렌더 직후
mask를 떼고 라벨 상자 자리에 **60% 반투명 배경**을 넣어 선이 라벨 뒤로 이어져 보이게 한다
(`src/integrations/d2.mjs`의 `softenEdgeLabels`). 배경색은 D2의 배경 클래스를 따라 다크 테마에서도 맞는다.
작성자가 따로 할 일은 없다. mask 제거만 하거나 글자 테두리(halo)를 주는 방식은 선이 글자 사이로 지나가
더 안 읽혀서 택하지 않았다.

## 시퀀스 다이어그램

- `shape: sequence_diagram`을 **루트에 바로 둔다.** 컨테이너로 감싸면 컨테이너 이름이 그림 위에 제목처럼 찍힌다.
- 폭은 액터 수와 메시지 라벨 길이로 정해져 재접기가 거의 안 먹으므로 **900px 기준의 예외**로 두고 확대
  dialog로 읽게 한다.
- note는 액터의 자식 키로 둔다(`u.note: …`). 여럿이면 `u.n1`·`u.n2`.
- **강조는 span과 group으로 한다.** 액터의 자식을 메시지 끝점으로 쓰면(`svc.handle`) 그 구간이 굵은
  활성 막대(span)로 그려져 "누가 일하는 동안인지"가 보인다. 메시지 몇 개를 묶어 라벨을 붙이려면 연결 없는
  컨테이너(group)로 감싼다. 응답·비동기는 `style.stroke-dash: 3`, 핵심 메시지만 `style.bold: true`.
- 번호가 필요하면 메시지 라벨 앞에 원문자 ①②③을 직접 붙인다(`autonumber` 대응 기능은 없다).

## Mermaid를 D2로 다시 그릴 때 (대응표)

레포 안 Mermaid는 전부 변환이 끝났지만 외부 자료·과거 커밋의 Mermaid를 다시 그릴 일은 남는다. 기계적 치환이
아니라 **같은 내용을 D2로 다시 그리는 것**이 원칙이다 — 라벨 문구와 노드·엣지의 의미를 보존하고 정보를
빼거나 더하지 않는다. 다시 그릴 때 [강조](#강조--핵심-컴포넌트와-흐름을-두드러지게) 규칙도 적용한다.

| Mermaid | D2 |
|---|---|
| `flowchart LR` / `TD` / `BT` | `direction: right` / `direction: down` / `direction: up` |
| `A["라벨 텍스트"]` | `a: 라벨 텍스트` (키는 ASCII 소문자, 라벨은 한국어 유지) |
| `A --> B` | `a -> b` |
| `A -->\|"라벨"\| B` | `a -> b: 라벨` |
| `A -.-> B` (점선) | `a -> b: { style.stroke-dash: 3 }` |
| `A --- B` (무향) / `A -.- B` | `a -- b` / `a -- b: { style.stroke-dash: 3 }` |
| `A <--> B` (양방향) | `a <-> b` |
| `A{"라벨"}` (마름모 판단) | `a: 라벨 { shape: diamond }` — 폭을 가장 많이 먹는 요소다 |
| `A[("라벨")]` (원통 저장소) | `a: 라벨 { shape: cylinder }` |
| `subgraph G["그룹"] … end` | 컨테이너 `g: 그룹 { … }` — 내부 `direction`은 무시된다 |
| 라벨 안 `<br/>` | `\n` |
| 라벨 안 `&amp;` | `&` 그대로 |
| 라벨 안 `&lt;`·`&gt;` | 실제 문자 `<`·`>`로 되돌린다 — 라벨을 따옴표로 감싸면 통과한다 |
| 라벨 안 `$` | `\$` |
| `click A "url"` | `a.link: /…/` + `inline=true` |
| `sequenceDiagram` | `shape: sequence_diagram`을 **루트에 바로 둔다** |
| `A-->>B` (sequence 응답) | `a -> b: … { style.stroke-dash: 3 }` — 비동기 `A--)B`도 같은 점선 |
| `activate A` … `deactivate A` | 액터 자식을 끝점으로 쓰는 span(`a.work`) |
| `A--xB` (실패 화살표) | 점선 엣지 + 라벨("크래시" 같은 것)로 뜻을 남긴다 — 십자 마커는 없다 |
| `alt` / `else` 분기 | 이름 있는 형제 컨테이너 둘 — 라벨 붙은 group 상자로 렌더된다 |
| `Note over A` | `a.note: …` — 여럿이면 `a.n1`·`a.n2` |
| `Note over A,B` (두 액터 걸침) | 의미상 맞는 한쪽 액터에 붙인다 — 걸침 범위는 옮길 수 없다 |
| `autonumber` | 메시지 라벨 앞에 원문자 ①②③ |
| `stateDiagram-v2` | 일반 노드·엣지로 다시 그림 — 시작·끝 원은 아래 |
| `classDef` 여섯 색 | [의미 팔레트](#의미-팔레트)의 같은 값을 `classes`로 선언 |

**stateDiagram의 시작·끝 원**은 이 형태로 굳었다(cka 세 곳에서 재사용). `shape: circle`만 주면 기본 크기
(약 100px)에 흰 배경이라 상태 상자처럼 보인다.

```text
start: "" { shape: circle; style: { fill: "#334155"; stroke: "#334155" }; width: 24; height: 24 }
```

`--> [*]`가 여럿이어도 **끝 원은 하나로 합친다.** `note right of X … end note`는 `mute` 색 노드 + `--` 점선으로
붙인다. **mermaid의 subgraph 소속은 첫 등장 위치**로 정해지는데 작성 순서 사고인 경우도 있으므로, 기계적으로
따르지 말고 그 페이지가 말하려는 그림을 따라 컨테이너 소속을 정한다.

## 의미 팔레트

사이트 전체의 의미 색은 다음 여섯 개로 통일한다. Mermaid `classDef` 시절부터 쓰던 값을 그대로 유지한다 —
**`DeckMap`·`DeckCatalog`·랜딩 카테고리 식별색이 같은 여섯 값을 참조하므로** 이 표를 바꾸면 그 셋도 같이 본다.

| 이름 | fill | stroke | font-color |
|---|---|---|---|
| `ok` | `#dcfce7` | `#16a34a` | `#14532d` |
| `bad` | `#fee2e2` | `#dc2626` | `#7f1d1d` |
| `warn` | `#fef3c7` | `#d97706` | `#78350f` |
| `key` | `#dbeafe` | `#2563eb` | `#1e3a8a` |
| `mute` | `#f1f5f9` | `#94a3b8` | `#334155` |
| `zone` | `#ede9fe` | `#7c3aed` | `#4c1d95` |

D2에서는 `classes` 블록으로 선언하고 노드에 `class: ok`처럼 붙인다. 색 외의 강조(`focus`·`aside`)는 색과
독립된 축이므로 `class: [key; focus]`로 겹쳐 쓴다.

```text
classes: {
  ok: { style: { fill: "#dcfce7"; stroke: "#16a34a"; font-color: "#14532d" } }
}
```

여섯 개뿐이라 더 잘게 나누는 데는 못 쓴다 — 랜딩의 **태그 칩은 그래서 의도적으로 무채색**이고, 축 구분도
색이 아니라 모양으로 한다. 여기에 색을 더하면 한 화면에 색 체계가 셋이 된다.

## 검증

문법 오류는 빌드가, 새 배치·라벨 겹침은 변경한 그림의 SVG/PNG(`d2-measure.mjs --png`)로 확인한다. 툴팁·링크·
보드 애니메이션처럼 **동작을 새로 넣거나 바꾼 그림**만 빌드 후 대표 페이지 하나에서 브라우저로 본다. 언제
브라우저를 쓰는지는 [검증 지침](verification.md)이 정본이다. `<Tabs>` 안 다이어그램은 해당 탭만 열어 본다.
