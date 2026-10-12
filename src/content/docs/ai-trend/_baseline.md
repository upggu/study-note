# AI 트렌드 덱의 기준

`ai-trend` 덱을 고치기 전에 읽는다. 다른 덱에는 해당하지 않는다.

## 이 덱의 한 문장

새로 나온 AI 모델·도구·플랫폼을 **어떤 문제의식에서 무엇을 바꾸려 하는가**로 정리한다.
기능 목록이나 사용법이 아니라, 나중에 다시 읽었을 때 "그게 왜 나왔고 핵심 개념이 무엇이었지"를
바로 떠올릴 수 있는 노트다.

## 독자·학습 결과·범위

독자는 AI 챗봇을 써 봤고, 모델이 입력을 받아 답한다는 정도를 안다. LLM API·에이전트 프레임워크·
Kubernetes의 구현 지식은 전제하지 않는다. 필요한 용어는 구체적인 상황과 함께 처음 쓰는 자리에서 푼다.
페이지 하나를 읽고 나면 그 주제가 **어떤 문제를 겨냥했는지, 핵심 개념이 무엇인지, 어디에 쓰고
어디에 쓰면 안 되는지**를 남에게 설명할 수 있어야 한다.

- **다룬다:** 탄생 배경과 문제의식, 해법의 원리, 주요 개념·용어, 기존 방식과의 차이, 한계와 흔한 오해.
- **다루지 않는다:** 설치·SDK 사용법 전체, 성능 측정 실험, 도입 결정. 필요하면 별도 덱이나 lab에서 다룬다.
- 이 템플릿에는 문제의식·원리·개념을 다루는 페이지만 포함한다. 특정 플랫폼 설계와 맞물린
  비교(예: Google AX와 kagent·AgentCore·Temporal의 책임 비교)는 포함하지 않는다.

## 서술 규칙

- 각 주제 페이지는 frontmatter의 `introduced`에 `month: "YYYY-MM"`, 발표 성격인 `event`,
  공식 근거 URL인 `source`를 둔다. 페이지 상단에 소개 연월과 출처를 자동 표시하며, 향후 월별 정리도
  이 값을 사용한다. 여러 주제를 연결하는 `index.mdx`에는 하나의 소개 연월을 붙이지 않는다.
- 소개 연월은 해당 개념·제품의 공식 최초 소개를 기준으로 한다. 논문 공개·프리뷰·정식 출시를
  `event`에서 구별하고, 후속 버전 출시나 기사 작성일·저장소 생성일로 대체하지 않는다.
  공식 근거로 월을 확정할 수 없다면 추정값을 넣지 않고 본문 첫머리에 미확인임을 밝힌다.
  소개 시점만 확인했다고 페이지 전체의 `reviewedAt`을 갱신하지 않는다.
- 페이지 하나 = 주제 하나. `<Thesis>`의 “결론부터”에 핵심 결론을 1~5개 불릿으로 쓴다.
  이후 큰 그림을 먼저 보여 주고 **문제의식 → 해법의 원리 → 예제로 보는 주요 개념 → 역할 분담 → 한계**로 설명한다.
  제품 이름·기능 나열로 시작하지 않는다. 예제의 결과가 무엇을 뜻하는지와 뜻하지 않는지도 설명한다.
- 개요는 Jev의 판단 모델·Muse의 개인 에이전트 제품·AX의 실행 플랫폼을 구별한다. 이 역할 비교를
  실제 제품 간 연동 관계로 소개하지 않는다.
- 벤더의 성능·비용 주장은 벤더 주장으로 표기하고, 이 저장소에서 측정한 값으로 쓰지 않는다.
  벤더 스스로 단 유보(자체 벤치마크, 상한 값)는 함께 옮긴다.
- 제품이 만든 용어(System One, Noul 등)는 영어 표기를 유지하고 처음 나올 때 뜻을 푼다.
  어원이 공개되지 않은 이름은 추측하지 않는다.
- 관계·흐름은 D2로 그린다. 공식 다이어그램이 있으면 `<SourceFigure>`로 사본을 두고, 없으면 직접 그린다.
- 페이지마다 "기준 시점과 확인 범위" 절을 두고 확인한 날짜·버전·문서를 적는다. 빠르게 바뀌는 주제이므로
  이 절에는 실제로 원문을 다시 확인한 날짜만 적는다.

## 페이지별 기준 시점

2026-09-29에 각 페이지의 `introduced.source`에서 소개 시점을 확인했다. Jev는 2026-09-15,
개인 에이전트 Muse는 2026-09-08, Google AX는 2026-05-20 공식 발표를 기준으로 월을 기록한다.
AX의 소개 시점과 아래 표의 현재 구현 확인 시점은 다르다.

| 페이지 | 확인일 | 기준 | 주요 출처 |
|---|---|---|---|
| `jev.mdx` | 2026-09-29 | Jev 1.13.0(`jev-latest`), early access 공개 2026-09-15 | [docs.typesafe.ai](https://docs.typesafe.ai/), [TypeSafe 소개 글](https://typesafe.ai/blog/introducing-system-one-models-and-jev), [Primitives](https://docs.typesafe.ai/primitives), [Confidence](https://docs.typesafe.ai/confidence) |
| `google-ax.mdx` | 2026-09-29 | `main` 브랜치, `ax.io/v1alpha1`, Task·Workspace·Model과 서버 직접 실행 구조, 안정 버전 이전 | [google/ax](https://github.com/google/ax), [DESIGN.md](https://github.com/google/ax/blob/main/DESIGN.md), [docs/](https://github.com/google/ax/tree/main/docs), [agentexecutor.io](https://agentexecutor.io/) |
| `meta-muse.mdx` | 2026-09-24 | Muse 출시·설계·보안 문서(2026년 9월), Muse Spark 1.3, 9월 23일 AI 안경 확장 발표 | [출시 발표](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), [제품 설계](https://introducing.muse.ai/), [보안 설계](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse), [Spark 1.3](https://research.meta.ai/blog/introducing-muse-spark-1-3), [안경 확장](https://about.fb.com/news/2026/09/introducing-ray-ban-meta-audio-glasses-new-styles-plus-muse/) |

2026-09-29에 Muse의 제품 설계·보안 원문에서 지속 작업·기억·Sentinel 경계를,
Muse 출시·Spark 1.3 발표에서 제품과 기반 모델의 관계를 다시 대조했다.
OpenClaw·Hermes·OpenRouter 공식 문서에 근거한 맥미니 구성 비교는 역할을 설명하는 비유다.
출시 지역·안경 확장까지 전체를 재검토한 것은 아니므로 페이지의 `reviewedAt`은 2026-09-24를 유지한다.
AX의 기존 Gateway·별도 ax-controller 설명은 현재 공식 문서와 달라 이 덱에서 갱신했다.

API 호출·배포·성능 측정은 수행하지 않았다. Jev JSON·확률·임계값은 공식 형식을 따른 설명용 가정이며,
AX YAML은 공식 예제를 줄인 설명용 발췌다.
Muse 앱 실행·한국 계정 접근·보안 효과는 검증하지 않았으며, 여행 준비 예제는 개념을 연결하기 위한 설명용 가정이다.

## 공식 화면 자료

2026-09-29에 확인한 공식 자료를 `public/images/ai-trend/`에 보관한다. 본문의 `SourceFigure`에
원문 링크·읽을 지점·원본 크기를 둔다. 화면 추가만으로 페이지 전체의 `reviewedAt`을 갱신하지 않는다.

| 파일 | 출처·확인 범위 |
|---|---|
| `muse-goals.png` · `muse-artifacts.png` · `muse-checkout.png` | [Meta 제품 설계 글](https://introducing.muse.ai/)이 제공한 원본 PNG 사본. 제품 소개 화면이며 이 저장소에서 앱을 실행한 결과가 아니다 |
| `jev-confidence-demo.png` | [공식 Confidence 문서](https://docs.typesafe.ai/confidence)의 확률 설명 데모 영역을 브라우저로 캡처. API 호출·로그인한 Playground 화면이 아니다 |
| `ax-cli-resume-demo.png` | [AX 공식 사이트](https://agentexecutor.io/)의 CLI 예시를 동작 줄이기 설정에서 중단·재개 부분으로 스크롤해 캡처. 직접 배포·실행한 로그가 아니다 |
