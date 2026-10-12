# Claude Code · Codex 레포 운영 덱의 기준

이 덱을 수정하기 전에 읽는다.

## 독자·학습 결과·범위

독자는 Git·Markdown·기본 명령 실행을 알고, 자신의 프로젝트에서 Codex와 Claude Code를 함께 쓴다.
이 덱을 읽고 그 레포에 `AGENTS.md`와 `docs/product-specs/`·`design-docs/`·`exec-plans/`를
두고, 각 문서를 언제 만들고 어떻게 유지하는지 알며, 한 작업을 요청부터 다른 도구의 재개까지
끌고 갈 수 있게 한다. 이 학습 사이트를 운영하는 법에 한정하지 않는다.

기본 경로는 레포 구조 → 지침 파일(AGENTS.md 작성법·로딩 조건) → 문서 세 층(스펙·설계·계획) → 작업 흐름이다.
monorepo와 공개 레포 비교는 선택 심화다. 두 도구의 설정 항목 전체, API 개발, 모델 성능 비교는 범위 밖이다.

## 현재성 기준

2026-09-20에 아래 공식 문서와 공개 레포의 실제 파일을 대조했고, 2026-09-23에 Anthropic memory·changelog를
다시 대조해 기본 구성을 CLAUDE.md 없는 AGENTS.md 하나로 바꿨다. 같은 날 Claude Code 2.1.278에서 CLAUDE.md를
지운 레포로 새 세션을 열어 `agents-md: no CLAUDE.md found; AGENTS.md loaded: <경로>` 줄을 실제로 확인했다.
그 밖의 권한·컨텍스트 복원은 실측한 것이 아니다. 예시 서비스(업무 목록 CSV 내보내기)는 설명용 가정이다.

- Anthropic memory: <https://code.claude.com/docs/en/memory>, changelog: <https://code.claude.com/docs/en/changelog>
  (v2.1.277, 2026-09-18부터 AGENTS.md 직접 로딩. 기본값 `claude-md-or-agents-md`는 작업 디렉터리·상위에
  CLAUDE.md·CLAUDE.local.md가 없을 때만 AGENTS.md를 읽고, 있으면 CLAUDE.md만 읽는다. 함께 읽기는
  `claude-md-and-agents-md`. 이전 버전·Bedrock·Vertex·Foundry·telemetry off·hook 비활성·업그레이드 직후 첫 세션은
  직접 로딩 불가라 `@AGENTS.md` 어댑터가 예외 대안. AGENTS.local.md·AGENTS.override.md·.agents/는 읽지 않음.
  하위 폴더 AGENTS.md는 그 폴더 파일을 읽을 때 로드. 직접 읽은 AGENTS.md는 /context에 안 나오고
  `agents-md: no CLAUDE.md found; AGENTS.md loaded: <경로>` 줄로 확인(2.1.278에서 실측). 파일당 200줄 아래 권장. import는 파일 기준 상대 경로, 같은 AGENTS는 두 번 읽지 않음.)
- Anthropic best practices: <https://code.claude.com/docs/en/best-practices>
  (인터뷰 → 스펙 파일 → 새 세션 구현, 완료 전 별도 컨텍스트 리뷰)
- Anthropic hooks: <https://code.claude.com/docs/en/hooks-guide>
- OpenAI AGENTS: <https://learn.chatgpt.com/docs/agent-configuration/agents-md>
  (루트→cwd, 폴더당 `AGENTS.override.md` → `AGENTS.md` 하나, 합계 32 KiB, cwd 아래는 시작 때 읽지 않음)
- OpenAI sandbox·승인: <https://learn.chatgpt.com/docs/sandboxing>, <https://learn.chatgpt.com/docs/agent-approvals-security>
- OpenAI harness engineering: <https://openai.com/index/harness-engineering/>
  (약 100줄 AGENTS 목차, `docs/product-specs`·`design-docs`·`exec-plans/active·completed`. 추천 구조의 이름 출처)
- OpenAI ExecPlan: <https://developers.openai.com/cookbook/articles/codex_exec_plans> (cookbook `registry.yaml`에서 archived)
- GitHub spec-kit: <https://github.com/github/spec-kit>, Kiro specs: <https://kiro.dev/docs/specs/> (기능별 폴더 사례)

공개 레포의 관찰 근거는 public-repositories.mdx의 커밋 고정 링크로 남긴다.

## 서술 규칙

- **사족을 넣지 않는다.** "모든 레포에 강제하지 않는다", "실측은 아니다" 같은 유보는 index와
  이 baseline에 한 번만 두고 본문에서 반복하지 않는다. 본문은 "이렇게 한다"로 쓰고 근거 링크를 그 문장에 건다.
- 페이지마다 중심 질문 하나. 파일·문서 종류별로 "무엇을 적는가 / 언제 만드는가 / 어떻게 유지하는가"를
  같은 순서로 답한다. 새 개념은 없으면 생기는 문제 → 해법 순서로 연다.
- 설명용 예시는 가상 업무 서비스의 CSV 내보내기 하나로 통일한다. 스펙 `docs/product-specs/task-export.md`,
  설계 `docs/design-docs/csv-output.md`, 계획 `docs/exec-plans/active/0007-csv-export.md`, 요구 ID `FR-EXP-*`·`NFR-EXP-*`.
  페이지마다 다른 예시를 만들지 않는다. 실행 가능한 앱이나 실제 통과한 테스트처럼 소개하지 않는다.
- 추천 구조는 OpenAI Harness engineering의 폴더 이름을 따른다. 각 층의 생략 조건은 repository-layout에 한 번만 둔다.
  다른 배치와의 비교는 public-repositories에서 한 번만 한다.
- 기본 구성은 CLAUDE.md 없는 AGENTS.md 하나다. CLAUDE.md `@AGENTS.md` 어댑터는 직접 로딩이 안 되는
  세션의 예외 대안이며, 그 조건과 어댑터 설명은 instruction-loading에서만 한다. 다른 페이지의 구조도·예시에
  CLAUDE.md를 그리지 않는다.
- 지침은 모델이 읽는 권고이고 강제는 hook·권한·sandbox가 맡는다. 설정 항목 전체는 공식 문서 링크로 대신한다.
- 실행 범위(조사만 / 특정 마일스톤까지 / 전체 완료)와 마일스톤의 뜻은 exec-plans에서 정하고 다른 페이지는 링크한다.
- 완료 주장 전 별도 컨텍스트의 대조 리뷰 단계를 둔다. 정확성·요구 누락만 보고하게 한다.
- 이 저장소의 정책(계획은 사용자가 명시 요청할 때만 생성, 네 자리 번호, `product-specs/`·`design-docs/` 없음)은
  다른 레포에 적용할 원리와 구분해 짧게 언급만 한다. 실제 관리 규칙은 docs/exec-plans/README.md가 정본이다.
- 소유자의 개인 레포는 이름으로 인용하지 않는다.

각 학습 본문은 Thesis·TermIntro와 하나의 중심 질문을 가지며 번호 없는 파일명·제목·URL을 쓴다.
