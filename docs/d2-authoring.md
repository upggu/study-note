# D2 다이어그램 작성 규칙

주 독자는 학습 페이지를 작성·수정하는 AI다. 목표는 독자가 관계·순서·상태 차이를 쉽게 이해하고
다시 참조할 수 있는 화면이다. 문법을 많이 쓰거나 움직임을 많이 넣는 것은 목표가 아니다.
움직임의 기준은 하나다. **그림이 답하는 질문 하나에 필요한 움직임만, 보통 핵심 엣지 한 줄기.**
콘텐츠의 구조와 의미 리뷰는 [콘텐츠 작성 규칙](content-authoring.md)을 따른다.

2026-10-15 기준 native **D2 v0.9.0**과 공식 문서를 대조했다. 아래에서 공식 기능과 이 저장소의
선택을 구분한다. 동작 예제는 [Starlight D2 페이지](../src/content/docs/starlight/d2.mdx)다.

새 그림은 선택 순서 → 강조 → 해당 절의 예제 → 검증 순으로 적용한다. 레이아웃·문법 절은 제약을 찾을 때 본다.

## AI의 선택 순서

1. 독자가 답할 질문을 한 문장으로 정한다. 구조인가, 전달 방향인가, 전후 상태인가, 조건별 결과인가?
2. 아래 표에서 가장 직접적인 표현을 고른다.
3. 관찰할 곳을 본문에 적는다. "버튼을 누르세요"가 아니라 "응답 뒤에도 서버에 원본이 남는지 보세요"처럼 쓴다.
4. 그림·설명·상태 표가 같은 사실을 말하는지 리뷰한다. 핵심 내용은 호버나 재생에만 숨기지 않는다.
5. [검증](#검증) 절대로 크기를 재고 빌드를 통과시킨다. 그림을 눈으로 보는 일은 사람에게 남긴다.

| 독자의 질문 | 우선 선택 | 적용 기준 |
|---|---|---|
| 무엇이 어디에 연결되는가 | 일반 D2 펜스 → SVG 이미지 | 관계·경계·전체 구조 |
| 이 구성 요소는 무엇이며 어디서 더 읽는가 | D2 펜스의 `tooltip`·`link` | 노드 설명·관련 문서 이동 |
| 데이터가 어느 방향으로 흐르는가 | D2 펜스의 핵심 선 `style.animated` | 재생·정지할 수 있는 방향 강조 |
| 어느 단계에서 무엇이 달라지는가 | **D2 `steps` + `target` + `Tabs`**, 상태 표 | 소수 단계의 요청·응답·보관 상태 비교 |
| 정상/장애 등 조건별 구조가 어떻게 다른가 | D2 `scenarios` + `target` + `Tabs` | 이전 단계가 아니라 공통 원본에서 갈라지는 대안 |
| 많은 단계의 메시지와 모든 객체 상태를 차례로 읽는가 | Steps·상태 표, 또는 별도 데모 | 긴 흐름을 나누고 전체 순서와 단계별 상태를 함께 제공 |
| 입력값을 바꾸면 결과가 어떻게 계산되는가 | `src/components/demos/`의 전용 Astro/JS 데모 | D2는 시뮬레이터가 아니다. 계산 규칙과 정적 대체 설명을 함께 둔다 |

남은 `LearningFlow` 데모를 D2로 바꿀 때는 역할·메시지·각 시점의 객체 상태·용어·단계 링크를 보존한다.
몇 단계만 그림으로 옮기고 나머지 설명을 없애는 것은 대체가 아니다.

## 공식 근거와 저장소의 경계

| 공식 문서 | 확인한 기능 | 이 저장소에서의 사용 |
|---|---|---|
| [Interactive](https://d2lang.com/tour/interactive/) | `tooltip`은 보조 설명, `link`는 이동. native title은 Markdown을 렌더하지 않는다 | 인라인 SVG로 출력하고 `D2Figure`가 터치·키보드 설명과 확대를 보완 |
| [Styles](https://d2lang.com/tour/style/#animated) | `style.animated` | 핵심 선의 방향 강조. 재생·정지는 자동으로 붙는 `D2Figure`의 기능 |
| [Composition](https://d2lang.com/tour/composition/)·[Steps](https://d2lang.com/tour/steps/)·[Scenarios](https://d2lang.com/tour/scenarios/) | steps는 직전 단계, scenarios는 공통 원본 상속. layers는 독립 보드 | `target`으로 한 장씩 출력하고 수동 탭으로 선택 |
| [애니메이션 소개](https://d2lang.com/blog/animation/) | CLI `--animate-interval`로 여러 보드를 한 SVG에 자동 교차 | 펜스 `animateInterval`로 전달할 수 있지만 쓰지 않는다. 수동 탐색 UI가 생기지 않는다 |
| [Layouts](https://d2lang.com/tour/layouts/) | 엔진별 지원·방향 제약 | 기본 ELK. 필요한 그림에서만 다른 엔진 비교 |
| [Exports](https://d2lang.com/tour/exports/#svg) | SVG의 CSS·객체 ID·출력 특성 | 빌드 렌더 후 인라인 설명·링크 아이콘을 보완. 버전 변경 시 회귀 확인 |

D2의 공식 기본 엔진은 dagre지만 **이 저장소 기본은 ELK**다. Mermaid 통합은 제거되어
`mermaid` 펜스는 그림이 아닌 코드 블록으로 남는다.

## 출력 방식 — 작성자는 `d2` 펜스만 쓴다

integration이 모든 D2를 `D2Figure`로 감싸고, 공용 런타임이 확대·설명·재생 조작을 붙인다.
MDX에서 `D2Figure`를 import하거나 `<Zoom>`·카드 같은 래퍼를 씌우지 않는다.
일반 이미지·`SourceFigure`의 확대는 starlight-image-zoom이 맡는다.

| 그림에 들어 있는 것 | 자동 출력 | 독자가 사용하는 기능 |
|---|---|---|
| 정적 관계·시퀀스 | 지연 로드하는 외부 SVG 이미지 | 그림 확대 dialog |
| `link`·`tooltip` | 인라인 SVG | 같은 확대 UI + 노드/아이콘 이동·설명 |
| 선·노드의 `style.animated` | 인라인 SVG + 모션 조작 | 같은 확대 UI + 재생·정지, 동작 줄이기 준수 |
| `appendix=true` | 부록을 포함한 정적 그림 | 확대해서 번호·부록 읽기. 링크 조작은 아님 |

판정은 **렌더된 SVG**로 하므로 import한 `.d2`의 기능도 인식한다. 링크·설명·움직임이 있으면 자동으로
인라인이 되고, `inline=true`는 정적 그림을 인라인으로 강제할 때만 쓴다. 기본 모션은 정지이고 재생 버튼으로 켠다.
확대 UI의 조작법은 [Starlight D2 페이지](../src/content/docs/starlight/d2.mdx)에 있다.

## 펜스 속성

````md
```d2 title="빌드 시 SVG가 생성되는 문서 흐름"
```
````

허용 키는 `title`·`layout`·`pad`·`sketch`·`theme`·`darkTheme`·`target`·`animateInterval`·`appendix`·`inline`·`fontSize`
열한 개뿐이다. 그 밖의 키는 오타로 보고 빌드가 멈춘다. 목록은 `src/integrations/d2.mjs`의 `knownKeys`다.

- `title="…"`은 항상 구체적으로 쓴다. `<img>`의 alt·inline svg의 `<title>`이 되어 대체 텍스트가 된다.
- 전역 기본은 `layout=elk pad=24 sketch=true theme=7 darkTheme=200 fontSize=13`이다. 펜스에는 그 그림에만 다른 값을 적고
  기본값을 다시 적지 않는다. **sequence 펜스에는 `layout`을 적지 않는다.** sequence는 layout 엔진을 타지 않는다.
- `fontSize=`는 노드 라벨 px이고 엣지 라벨은 1px 작다. integration이 펜스 원본 앞에 glob으로 붙이므로 작성자가 적은
  `font-size`가 이긴다. `fontSize=0`은 D2 기본(16)을 그대로 둔다. elk 그림은 층 사이 40·컨테이너 안쪽 30·엣지-노드 25px
  간격도 같이 받는다(`src/integrations/d2.mjs`의 `elkSpacing`). 둘 다 2026-11-10에 그림이 본문보다 커 보여 낮춘 값이다.
- `sketch=false`는 단계 비교·인라인 그림에서 먼저 고려한다. sketch는 SVG 크기와 라벨 폭을 늘린다.
  정적 개념도에서 손그림이 이해를 돕는다면 기본값을 유지한다.
- `target=`은 [단계 보드](#단계-보드--steps와-수동-탐색), `appendix=`는 [툴팁과 링크](#툴팁과-링크)에서 쓴다.
  `animateInterval=`은 허용 키지만 현재 쓰지 않는다. 쓰려면 정지·수동 선택·정적 대체를 갖춘 UI가 먼저다.
- 외부 `.d2`를 끌어오는 `src=` 속성은 **없다.** 여러 펜스가 같은 원본을 나눠 쓰면 `src/d2/<이름>.d2`에 두고
  펜스 첫 줄에 `...@<이름>`으로 import한다. d2가 `src/d2/`를 작업 디렉터리로 실행되므로 그 폴더 기준 상대 경로다.

## 강조 — 핵심 컴포넌트와 흐름을 두드러지게

눈에 잘 들어오는 그림은 "다 그린 그림"이 아니라 **지금 절이 말하는 한 가지가 두드러지는 그림**이다.
펜스를 열기 전에 세 가지를 정한다.

1. **이 그림이 답하는 질문.** 펜스 `title`이 그 문장이 된다.
2. **핵심 노드·핵심 경로.** 보통 노드 1~3개, 엣지 1~2개. 이것만 굵고 선명하게 그린다.
3. **배경으로 물러날 것.** 나머지는 흐리거나 점선으로 둔다. 질문과 무관한 노드는 아예 뺀다.

강조는 세 층을 쓰고 한 그림에 세 층을 넘지 않는다. 모든 노드가 강조되면 아무것도 강조되지 않는다.

| 층 | 뜻 | 쓰는 수단 |
|---|---|---|
| 초점 | 이 절의 주인공 | `stroke-width: 4` + `bold: true`(`focus` 클래스) |
| 의미 | 상태·역할 | [의미 팔레트](#의미-팔레트) 여섯 색 |
| 배경 | 맥락이지만 지금 주제는 아님 | `opacity: 0.45`(`aside` 클래스), 점선 |

세 클래스를 의미 팔레트와 함께 선언해 두고 조합한다. 여러 클래스는 `class: [key; focus]`처럼 **세미콜론**으로
나열하며 왼쪽부터 적용된다. 노드에 직접 적은 `style`이 클래스를 이긴다.

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

- **전달 방향이 질문이면** 핵심 엣지에 `stroke-width: 3`과 `animated: true`를 준다. 현재 경로 한 줄기만 움직이고
  라벨·화살촉에도 방향을 남긴다. 움직임이 실제 전송 속도·실시간 트래픽을 뜻하지 않음을 필요한 자리에서 밝힌다.
- **노드 하나를 띄우려면** 노드에 `style.animated: true`를 준다. 등장 순서가 학습에 필요할 때만 쓰고,
  일반적인 상태 강조는 테두리·색으로 충분하다.
- **배경으로 물리기**는 노드·엣지 모두 `opacity: 0.45`다. 많은 노드를 한꺼번에 물릴 때는 glob으로 전부
  낮춘 뒤 핵심만 되살린다. glob은 뒤에 선언되는 노드에도 적용된다.

  ```text
  *.style.opacity: 0.45
  (* -> *)[*].style.opacity: 0.45
  gw.style.opacity: 1
  svc.style.opacity: 1
  (gw -> svc)[0].style: { opacity: 1; stroke-width: 3; animated: true }
  ```

- **글자 강조**는 `bold: true`가 기본이고 `font-size: 16`(기본 13)까지만 키운다. `italic`·`underline`은 쓰지 않는다.
- **구조 강조**는 의미를 고정해서 쓴다. `multiple: true`는 복제본, `3d: true`는 물리 장비, `double-border: true`는
  경계·게이트웨이, `shadow: true`는 한 그림에 1~2개만 띄우는 장면용이다. 꾸밈으로 섞지 않는다.
- **엣지 종류 구분**은 `stroke-dash: 3` 점선이다. 보조 흐름·비동기 응답·되돌아가는 피드백에 쓴다.
- **범례**는 강조 층이 셋일 때만 `vars.d2-legend`로 붙인다. 오른쪽 아래에 붙어 그림이 100px 넘게 넓어지므로
  붙인 뒤 다시 잰다.

  ```text
  vars: {
    d2-legend: "범례" {
      f: 이번 절의 핵심 { class: focus }
      s: 배경 { class: aside }
    }
  }
  ```

- **한 줄 설명**은 `shape: text`에 `near: top-center`로 둔다. 목록·굵은 글씨가 필요하면 `|md … |` 블록을 쓴다.
  긴 설명은 그림이 아니라 본문에 적는다.

## 툴팁과 링크

아래는 실제 문서 주소를 쓰는 최소 예제다. 링크·설명이 있으면 자동으로 인라인이 된다.

````mdx

```d2 sketch=false title="관계는 D2, 실제 화면은 이미지 안내에서 읽는다"
direction: down
diagram: D2 {
  tooltip: 요소의 관계와 방향을 보여 준다
}
picture: 이미지 안내 {
  link: "/starlight/components/#실제-모습을-알아야-하면-이미지를-쓴다"
  tooltip: 제품 화면의 실제 위치와 모양을 보여 줄 때 쓴다
}
diagram -> picture: 실제 모양이 궁금하면
```

````

- 노드와 체인 아이콘은 링크 이동, ⓘ와 설명이 있는 노드는 설명 표시, 확대는 전용 버튼으로 나뉜다.
  설명은 그림 아래 평문으로 표시되므로 툴팁에 Markdown을 넣지 않는다.
- 필수 설명과 링크 대상 이름은 본문에도 적는다. 호버만으로 핵심을 전달하지 않는다.
- `link`는 base 없는 문서 주소다. `site-paths`가 배포 base를 붙인다.
- 보드 간 링크(`link: layers.x`)는 쓰지 않는다. 수동 보드 전환은 아래 `target`과 탭으로 한다.
- `appendix=true`는 링크·툴팁을 번호와 부록으로 그리는 **정적 출력**이다. 클릭 가능한 링크가 생기지 않는다.
- 인라인 SVG의 링크 glyph 복원과 다크 테마 연결은 `d2-inline.mjs`가 맡는다. 테마가 맞지 않거나 배경이 검으면 거기를 본다.

## 단계 보드 — `steps`와 수동 탐색

D2 보드는 그림의 변형을 정의한다. **탭·이전/다음·재생 버튼은 D2 기본 기능이 아니다.**
소수 단계를 비교할 때는 `Tabs`를 쓴다. 두 단계 예제와 상태 표는
[Starlight D2 페이지](../src/content/docs/starlight/d2.mdx), 공통 원본은
[request-response.d2](../src/d2/request-response.d2)다.

````mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs>
<TabItem label="요청 도착">

```d2 sketch=false target=root title="GET 요청은 서버에 도착했지만 브라우저에는 문서가 없다"
...@request-response
```

브라우저는 응답을 기다리고 서버는 원본 문서를 보유한다.

</TabItem>
<TabItem label="응답 도착">

```d2 sketch=false target=steps.response title="HTML 응답이 브라우저에 도착하고 서버의 원본은 유지된다"
...@request-response
```

브라우저도 문서를 받았고 서버의 원본은 그대로 남는다.

</TabItem>
</Tabs>
````

`syncKey` 없는 `Tabs`의 모든 패널에 D2가 정확히 하나씩 있으면 확대 화면에도 단계 선택이 붙는다.
확대 화면은 각 탭의 이름과 패널 바로 아래 문단을 상태 설명으로 보여 주므로, 관찰 문장은 그림과
같은 패널의 문단에 둔다. 중첩 탭이나 패널에 그림이 여러 개면 개별 그림만 확대한다.

- **같은 위치에서 변화를 읽게 한다.** 노드·엣지·라벨은 공통 원본에 선언하고 단계는 스타일 중심으로 바꾼다.
  스타일만 바꿨다고 동일 좌표가 보장되지는 않으므로 실제로 잰다.
- `steps`는 이전 단계를 상속한다. 앞 단계의 강조·`animated`를 다음 단계에서 명시적으로 되돌린다.
  서로 독립적인 정상/장애 비교는 `scenarios`를 쓴다. 루트도 한 장이며 `target=root`로 선택한다.
- 보드가 있는 펜스에는 **`target`이 필수**다. 없으면 CLI가 파일 하나 대신 디렉터리를 만들어 파이프라인과 맞지 않는다.
- 엣지는 별도 줄로 선언하고 `(browser -> server)[0]`처럼 참조한다. 긴 체인 선언을 단계마다 수정하지 않는다.
- **탭 밖 상태 표에는 모든 시점과 모든 주체의 상태**를 남겨 검색·비JS·한눈 비교 경로를 제공한다.
  많은 상태를 한 표에 밀어 넣어야 하면 별도 데모를 검토한다.

### 애니메이션을 도입할 때

| 목적 | 선택 | 확인할 것 |
|---|---|---|
| 전달 방향을 눈으로 따라가기 | 핵심 엣지 `style.animated: true` | 재생·정지, 동작 줄이기, 정지해도 읽히는 라벨 |
| 단계별 인과·정확한 값 비교 | 수동 단계 탭 + 선택적으로 엣지 애니메이션 | 독자가 읽는 동안 단계가 바뀌지 않음 |
| 입력에 따른 상태 변화 | 별도 데모의 전환 애니메이션 | 계산 결과가 먼저 정확하고, 움직임은 차이를 설명해야 함 |

## 레이아웃과 크기

- **크기 상한은 없다.** 본문의 그림은 미리보기라서 폭 100%·높이 80vh 안에 들어가게 비율대로 줄여 보여 주고,
  독자는 확대로 원본 크기를 읽는다. 크기를 맞추려고 그림을 쪼개거나 라벨을 억지로 접지 않는다.
- **많이 줄어드는 그림일수록 본문이 혼자 서야 한다.** 미리보기에서는 구조만 보이므로 핵심 사실은 본문과 상태 표에
  적는다. 호버·재생에 핵심을 숨기지 않는 규칙이 확대에도 그대로 적용된다.
- **크기는 `node scripts/d2-measure.mjs <파일.mdx>`로 잰다.** 1280×800 화면 기준 미리보기 배율과 표시 글자 px를 찍어 준다.
  배율이 50% 아래면 본문 설명이 충분한지, 한 그림이 두 질문을 답하고 있지 않은지만 본다.
- **방향은 재서 고르되 출발점은 `down`이다.** 짧은 왕복·팬아웃·독립된 쌍은 `right`도 비교한다.
  **엣지 없는 형제 컨테이너는 방향이 뒤집혀 적용된다.** `right`에서 세로로 쌓이고 `down`에서 가로로 늘어선다.
- **라벨 줄바꿈은 방향을 정한 뒤에 조정한다.** diamond는 같은 글자의 사각형보다 넓다. 긴 부연은 본문으로 옮기고
  억지로 접어 작은 글자를 만들지 않는다.
- **PNG 확인은 소유자가 겹침·잘림을 지적한 그림을 고칠 때만 한다.** 수치는 겹침을 잡아 주지 않지만 그 확인은 사람이
  사이트에서 한다. `node scripts/d2-measure.mjs --png <파일.mdx>`가 블록별 PNG를 `.d2-measure/`에 만든다.
- **`direction`은 elk·dagre에서 다이어그램 전체에 하나만 걸린다.** 컨테이너 안 `direction`은 조용히 무시된다.
  컨테이너 안 방향이 필요하면 `layout=tala`나 아래 `grid-rows`를 쓰고, 둘 다 안 맞으면 루트를 `down`으로 두고 세로로 간다.
- **`layout=tala`는 펜스 단위로 쓴다.** v0.9.0부터 바이너리에 번들돼 별도 설치가 없다. 컨테이너별 `direction`과
  다른 객체를 가리키는 `near`는 TALA 전용이다. 엔진을 바꾸면 모든 그림이 좋아진다고 가정하지 않고 그 그림에서 재서 고른다.
- `near: top-center` 같은 위치 상수는 모든 엔진에서 동작한다.

### grid-rows · grid-columns — elk에서 컨테이너 안 방향을 잡는 우회로

`grid-rows`/`grid-columns`를 주면 자식이 그 모양으로 배열된다. 루트 `grid-rows: N`은 컨테이너 N개를 세로로
쌓고, 루트 `grid-columns: 2`는 엣지 없는 컨테이너 둘을 나란히 세운다. 조건이 좁으니 측정값이 튀면 의심한다.

- 그 컨테이너의 자식이 **바깥과 엣지로 이어지지 않을 때만** 쓴다. grid는 엣지를 배치에 반영하지 않아 경계를
  넘는 엣지가 컨테이너를 관통하는 직선으로 그려진다.
- 예외는 경계를 넘는 엣지가 **하나**뿐일 때다. 배치를 통제하는 유일한 수단은 선언 순서이고, 두 끝점을 인접
  칸에 놓으면 짧은 직선이 된다.
- 셀 폭은 가장 넓은 자식에 맞춰 균일하다. 라벨 길이가 고른 레인에만 듣는다.
- 루트가 grid면 `direction`은 무시된다. 컨테이너 안 자식을 세로로 세우려면 그 컨테이너에도 `grid-rows`를 준다.

## 문법 함정

- **노드·컨테이너 키로 D2 예약어를 쓰지 않는다.** `link`·`top`은 선언은 통과하고 **엣지에서 참조하는 순간**
  `reserved keywords are prohibited in edges`로 죽는다. `left`·`right`·`bottom`·`center`·`near`·`style`·`shape`·
  `label`·`icon`·`width`·`height`·`grid`·`classes`·`layers`·`steps`·`scenarios`·`vars`·`tooltip`도 피한다.
  키는 화면에 안 나오니 `ktop`·`conn`처럼 바꾸면 된다.
- 의미 팔레트 이름(`ok`·`bad`·`warn`·`key`·`mute`·`zone`)과 `focus`·`aside`는 클래스 이름으로만 쓴다.
  노드 키는 `gateway`처럼 역할로 짓는다.
- 여러 클래스는 `class: [a; b]`다. 쉼표를 쓰면 `class "a, b" not found`로 빌드가 죽는다.
- 라벨 안 `$`는 `\$`로 이스케이프한다. `|`·`<`·`>`는 라벨을 따옴표로 감싸면 통과한다.
- `link:` 값에 `#`이 있으면 따옴표로 감싼다. 안 감싸면 뒤가 주석이 된다.
- 같은 키를 두 번 선언하면 뒤가 앞을 덮는다. 한 액터에 note가 여럿이면 `u.n1`·`u.n2`처럼 키를 달리한다.
- 상태도의 시작·끝 원은 아래 형태로 굳었다. `shape: circle`만 주면 기본 크기에 흰 배경이라 상태 상자처럼 보인다.
  끝 원은 여러 전이가 모여도 하나로 합친다.

  ```text
  start: "" { shape: circle; style: { fill: "#334155"; stroke: "#334155" }; width: 24; height: 24 }
  ```

## 로고·아이콘

제품·서비스 노드에는 글자 대신 로고를 붙일 수 있다. 로고는 `src/d2/icons/`에 둔 파일만 쓰고 원격 URL은
쓰지 않는다. 목록과 출처는 그 폴더의 README다. Kubernetes 리소스는 `icons/k8s/`의 공식 아이콘을
`icon: icons/k8s/pod.svg`처럼 kubectl 약어로 쓴다. 펜스에서는 `src/d2/` 기준 상대 경로 `icons/<이름>.svg`로 적는다.

```text
pg: Postgres HA { shape: cylinder; class: warn; icon: icons/postgresql.svg }
k8s: 온프렘 Kubernetes { icon: icons/kubernetes.svg; … }     # 컨테이너는 왼쪽 위에 작게 붙는다
pod: "LiteLLM Pod" { icon: icons/k8s/pod.svg }                 # Kubernetes 리소스는 k8s/ 아래 약어
gh: "" { shape: image; icon: icons/github.svg; width: 48; height: 48 }   # 로고만 있는 노드
```

- **로고를 붙이면 노드가 커진다.** 붙인 뒤 다시 잰다.
- 제품을 가리키는 노드에만 붙인다. 역할·개념 노드(브라우저·사람·애플리케이션)에는 붙이지 않는다.
  로고 노드에도 `tooltip:`·`link:`는 그대로 붙는다.
- 로고가 없는 제품은 README의 출처에서 받아 폴더에 추가하고 표에 한 줄 더한다. 50KB를 넘는 파일은 두지 않는다.
- `shape: image`는 라벨 없이 로고만 그린다. 라벨을 주면 로고 아래에 글자가 붙는다.

## 엣지 라벨 뒤의 선

D2 기본대로 둔다. 연결선 라벨 자리는 SVG mask로 잘려 라벨이 선을 가린다. 2026-10-13부터 mask를 떼고 라벨에
반투명 배경을 깔아 선이 비치게 했으나, 글자 위로 선이 지나가 취소선처럼 보여 2026-11-10에 되돌렸다.
라벨 뒤 선을 다시 비치게 하는 후처리는 넣지 않는다.

## 시퀀스 다이어그램

- `shape: sequence_diagram`을 **루트에 바로 둔다.** 컨테이너로 감싸면 컨테이너 이름이 그림 위에 제목처럼 찍힌다.
- 폭은 액터 수와 메시지 라벨 길이로 정해져 재접기가 거의 안 먹는다. 넓어도 미리보기로 두고 확대로 읽게 한다.
  글자 기본값은 받지만 ELK 간격은 받지 않는다.
- note는 액터의 자식 키로 둔다(`u.note: …`).
- **강조는 span과 group으로 한다.** 액터의 자식을 메시지 끝점으로 쓰면(`svc.handle`) 그 구간이 활성 막대(span)로
  그려진다. 메시지 몇 개를 묶어 라벨을 붙이려면 연결 없는 컨테이너(group)로 감싼다.
  응답·비동기는 `style.stroke-dash: 3`, 핵심 메시지만 `style.bold: true`.
- 번호가 필요하면 메시지 라벨 앞에 원문자 ①②③을 직접 붙인다. `autonumber` 대응 기능은 없다.

## 의미 팔레트

사이트 전체의 의미 색은 다음 여섯 개로 통일한다. **`DeckMap`·`DeckCatalog`·랜딩 카테고리 식별색이 같은
여섯 값을 참조하므로** 이 표를 바꾸면 그 셋도 같이 본다.

| 이름 | fill | stroke | font-color |
|---|---|---|---|
| `ok` | `#dcfce7` | `#16a34a` | `#14532d` |
| `bad` | `#fee2e2` | `#dc2626` | `#7f1d1d` |
| `warn` | `#fef3c7` | `#d97706` | `#78350f` |
| `key` | `#dbeafe` | `#2563eb` | `#1e3a8a` |
| `mute` | `#f1f5f9` | `#94a3b8` | `#334155` |
| `zone` | `#ede9fe` | `#7c3aed` | `#4c1d95` |

```text
classes: {
  ok: { style: { fill: "#dcfce7"; stroke: "#16a34a"; font-color: "#14532d" } }
}
```

여섯 개뿐이라 더 잘게 나누는 데는 못 쓴다. 랜딩의 태그 칩은 그래서 의도적으로 무채색이고, 축 구분도
색이 아니라 모양으로 한다.

## 검증

문법 오류는 빌드가 잡고 크기는 `node scripts/d2-measure.mjs <파일.mdx>`로 잰다. AI는 여기까지만 기계적으로 확인하고
그림을 눈으로 보지 않는다. 라벨 겹침·잘림은 소유자가 사이트에서 보고 지적하며, 그때 `--png`로 그 그림만 고친다.
툴팁·링크·단계 선택·재생처럼 **동작을 새로 넣거나 바꾼 그림**만 빌드 후 대표 페이지
하나에서 브라우저로 본다. 그때 노드 본체와 아이콘을 각각 누르고, 바뀐 동작(설명·확대·키보드·터치·재생·정지·
동작 줄이기·테마)만 확인한다. `<Tabs>` 안 다이어그램은 해당 탭만 열어 본다.
브라우저를 쓰는 기준과 변경별 표는 [검증 지침](verification.md)을 따른다.
