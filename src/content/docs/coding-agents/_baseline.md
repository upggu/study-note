# AI에게 기획부터 개발까지 맡기기 — 덱 기준

## 독자·학습 결과·범위

독자는 Git·Markdown·기본 명령 실행을 알고 Codex 또는 Claude Code로 자신의 프로젝트를 개발한다.
PM Skills와 superpowers의 내부 절차를 먼저 공부하지 않아도 설치·적용·기획·개발·갱신과 이어받기를
AI에게 요청하고, 결과에서 제품 결정·승인할 설계·검증 증거·남은 일을 확인할 수 있게 한다.

기본 경로는 _deck.mjs의 기본 가이드 그룹이다. 페이지마다 상황별 요청문·받을 결과·확인할 핵심을 둔다.
적용한 프로젝트의 폴더 구조·지침 로딩 원리·문서 역할과 수명·ledger·도구별 실행은 부록이다.
설치와 실제 로딩 확인, 제품 결정, 스킬의 설계·계획 승인, 인계 전제는 기본 경로에 남긴다.

제품 아이디어·해결 방향 탐색과 가정·실험 설계는 PM Skills의 pm-product-discovery,
PRD 작성과 리뷰는 pm-execution의 create-prd, 개발 설계·계획·구현·검증은 superpowers가 맡는다.
기본 설치는 세 패키지이지만 확정 요구의 개발·버그 수정에 제품 탐색을 반복하지 않는다.
두 도구를 모두 쓰도록 요구하지 않는다. API 개발·모델 성능 비교·스킬별 상세 절차는 범위 밖이다.

## 최소 연결 원칙

적용할 경로·역할·문서 갱신 규칙의 정본은
[project-setup.mdx의 AI가 적용할 연결 규칙](project-setup.mdx#ai가-적용할-연결-규칙)이다.
추가 규칙은 기반 스킬만으로 해결되지 않는 연결·보관·갱신 문제와 그 이유가 있을 때만 둔다.
기존 프로젝트 문서·Git 정책·진행 중 작업을 보존하고, 사용자에게 문서 배치의 대안을 고르게 하지 않는다.
문서 연결만 요청하면 탐색·첫 PRD 작성·환경 설치로 넓히지 않는다. PRD가 없으면 기획 요청으로 연결한다.
기존 문서의 수정도 요청에서 허용한 대상과 범위 안에서만 한다.

PRD는 create-prd의 파일명·내용 구성을 유지하고 저장 폴더만 지정한다.
스킬이 정한 절차·형식·역할을 요청문이나 별도 템플릿에서 재정의하지 않는다.
작은 변경의 파일 생략, 기능 수에 따른 문서 분리, 요구 ID 도입, ledger Git 추적,
다른 도구의 추가 리뷰를 덱의 필수 규칙으로 만들지 않는다.
공유 지침의 정본은 AGENTS.md로 연결하되 기존 도구별 연결 파일을 일괄 삭제하지 않는다.
사전 지정된 실행 선호는 subagent-driven-development이며 하위 에이전트 도구가 없으면 executing-plans다.
이미 정한 선호로 인계하고 공통 연결 규칙으로 강제 복제하지 않는다. 실제 적용 조건과 리뷰는 설치 스킬을 따른다.
하위 에이전트 도구가 없어 native 실행으로 최종 self-review를 수행하면 그 사실과 한계를 보고한다.
실제 도구가 없는데 위임이나 독립 리뷰를 완료했다고 쓰지 않는다.
실행 선호 지정은 superpowers의 설계 승인·계획 리뷰와 확인을 생략하는 근거가 아니다.

탐색만 요청하면 후보·근거·가정·실험 판정 기준에서 멈춘다. PRD까지 요청하면 제품 맥락과 남은 가정을
create-prd로 넘긴다. 문제·대상 사용자·성공 기준이 부족하면 스킬에 따라 먼저 질문하고,
사용자가 그대로 진행하라고 지시했을 때만 그 공백을 가정으로 표시한다. 실험 계획을 검증 결과로 쓰지 않는다.
PRD 리뷰만 요청하면 판단에 필요한 누락과 줄일 내용을 제안하고 파일은 바꾸지 않는다.
리뷰와 문서 수정을 함께 요청하면 허용한 교정만 기존 위치에 반영하고 제품 목적·범위·정책 변경은 제안으로 남긴다.
새 프로젝트 세팅에서 만든 PRD는 다음 기획 단계에서 다시 만들지 않고 같은 파일을 리뷰한다.

기획에서 합의한 요구는 개발의 입력이다. 개발 중 제품 목적·범위·정책을 바꿔야 하면 사용자 결정을 받는다.
관련 제품·기술 문서는 구현과 최종 수정에 맞춰 갱신하고, 구현 완료를 출시 완료로 표현하지 않는다.
작업이 끝난 spec·plan은 당시 기록으로 보존하고 현재 기준은 지속 문서에 둔다.

## 근거와 확인 범위

2026-10-25에 아래 실제 파일과 공식 문서를 대조했다. 본문은 확인한 버전에 근거한다.
독자는 설치된 SKILL.md를 사용하며, 버전 차이가 생기면 덱의 요약으로 스킬을 덮어쓰지 않는다.

- PM Skills pm-execution 2.2.0, 공개 근거 `07b34f64ee828df08953f505b7f747aef85ae7c6`:
  [create-prd](https://github.com/phuryn/pm-skills/blob/07b34f64ee828df08953f505b7f747aef85ae7c6/pm-execution/skills/create-prd/SKILL.md),
  [설치 안내](https://github.com/phuryn/pm-skills/blob/07b34f64ee828df08953f505b7f747aef85ae7c6/README.md#installation).
  양쪽 도구의 설치된 create-prd를 읽고 PRD 작성·기존 PRD 리뷰·기본 파일명과 질문 조건을 확인했다.
  공개 커밋의 create-prd와 설치본이 동일하다는 이전 대조 결과를 재사용한다. 패키지 전체 동일성을 뜻하지 않는다.
- PM Skills pm-product-discovery 2.2.0: 같은 공개 커밋의
  [discover](https://github.com/phuryn/pm-skills/blob/07b34f64ee828df08953f505b7f747aef85ae7c6/pm-product-discovery/commands/discover.md)와
  brainstorm-ideas-new·identify-assumptions-new·brainstorm-experiments-new를 로컬 marketplace 체크아웃에서 읽었다.
  이 확인은 패키지의 설치·활성화·실행 확인이 아니다. 탐색 산출물은 실제 저장 경로로 PRD에 연결하며 별도 고정 파일명·양식을 만들지 않는다.
- Codex superpowers 7.0.1, 공개 근거 `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b`:
  [skills](https://github.com/obra/superpowers/tree/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills).
  using-superpowers·brainstorming·writing-plans·subagent-driven-development·executing-plans·
  verification-before-completion·finishing-a-development-branch의 SKILL.md와
  sdd-workspace·final-review 참조를 확인했다.
  실행 방식 사전 지정은 계획 리뷰를 생략하지 않는다. 지속 문서 갱신은 덱의 연결 규칙이다.
  Claude Code 설치본은 7.0.0이며 brainstorming도 직접 읽었다. 7.0.1의 짧은 설계 문서 승인과
  7.0.0의 작은 변경 대화 설명 승인을 같은 동작으로 쓰지 않는다. 모든 스킬이 동일하다고 가정하지 않는다.
- [Codex plugin 명령](https://learn.chatgpt.com/docs/developer-commands#codex-plugin),
  [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md),
  [Claude Code memory](https://code.claude.com/docs/en/memory).
  Codex plugin CLI 도움말도 대조했다. Claude Code의 직접 로딩은 버전·설정 조건이 있다.
  Claude memory 공식 원문을 2026-10-25에 다시 대조했다. /memory는 파일 위치 목록이며 없는 파일 위치도 표시한다.
  /context의 시작 시 CLAUDE.md·rules 확인, 직접 AGENTS.md 로딩 안내·버전·설정을 구분한다.
  작동하는 @AGENTS.md import는 유지할 수 있고 도구 전용 지침도 범위 확인 없이 삭제하지 않는다.
- Paseo 부록은 [orchestration](https://paseo.sh/docs/orchestration.md)·
  [workflows](https://paseo.sh/docs/orchestration-workflows.md)·
  [profiles](https://paseo.sh/docs/agent-profiles.md)를 2026-10-25에 다시 대조했다.
  프로필·When to use와 실제 작업 폴더 연결에 한정한다. 모델·추론 수준은 예시이고 공식 성능 추천이 아니다.
  provider 내부 하위 에이전트에 프로필이 자동 적용된다고 가정하지 않으며 결합 실행은 미실측이다.

설치본 직접 열람과 세션의 자동 발견·실행을 구분한다.
이 개편에서 패키지 설치·새 세션의 전체 스킬 실행·Paseo 결합·독립 에이전트 이관 시험은 하지 않았다.
공식 자료 대조, 콘텐츠 의미 리뷰, 사이트 검증을 실제 실행 시험과 구분한다.

## 작성과 호환성

- 기본 가이드는 요청과 결과 판정이 중심이다. 스킬의 질문 목록·양식을 요청문에 길게 복제하지 않는다.
  부록을 추가 필수 실행 절차로 만들지 않으며 스킬의 리뷰 절차를 다시 정의하지 않는다.
- 공식 동작·덱의 추가 규칙·설명용 가정·미확인은 해당 설명 가까이에서 구분한다.
- 예시는 가상 업무 서비스의 CSV 내보내기다. PRD는 `docs/product-specs/PRD-task-manager.md`,
  설계는 `docs/superpowers/specs/2026-10-24-csv-export-design.md`,
  계획은 `docs/superpowers/plans/2026-10-24-csv-export.md`를 사용한다.
  처음 한도는 1,000건, 후속 변경은 5,000건이며 실제 제품 사실이 아니다.
- 기본 가이드는 5쪽, 부록은 폴더 구조·지침 로딩·문서 역할과 수명·Paseo의 4쪽이다.
  project-structure는 가상 task-manager의 파일 위치·수명·읽기 연결을 보여 준다. 이 사이트 자체의 구조나
  모든 프로젝트에 강제할 새 배치 규칙으로 쓰지 않는다. 경로·역할의 정본은 기존 project-setup의 연결 규칙이다.
  현재 기술 문서·CSV 규약과 갱신 판단 예제는 design-and-plans에, 하위 지침 설명은 agents-md에 둔다.
  현재 기술 문서는 기존 위치 또는 README에서 유지하며 기능 수로 파일 분리를 강제하지 않는다.
  CSV 출력 규약·HTTP 상태는 가상 예제의 설계 선택이며 보편적인 안전 보장이 아니다.
  현재 내부 링크는 실제 페이지·절을 가리키게 유지한다.
  삭제·통합한 페이지의 옛 주소·절 ID 호환을 위한 리다이렉트나 빈 이동 안내는 유지하지 않는다.
- 이 학습 사이트 자체의 실행 정책은 루트 AGENTS.md가 정한다. 덱의 예시 프로젝트 정책과 혼용하지 않는다.
