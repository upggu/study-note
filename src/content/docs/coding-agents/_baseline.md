# Claude Code · Codex 레포 운영 덱의 기준

이 덱을 수정하기 전에 읽는다.

## 독자·학습 결과·범위

독자는 Git·Markdown·기본 명령 실행을 알고, 자신의 프로젝트에서 Codex와 Claude Code를 함께 쓴다.
독자는 두 도구에 superpowers를 설치해 쓴다(설치 안내는 개요에 있다). 이 덱을 읽고 그 레포에 `AGENTS.md`를
두고, superpowers로 작업별 spec·plan을 관리하며, 프로젝트의 현재 구조·규약을 별도 문서에서 유지할 수 있게 한다.
공유 지침은 AGENTS.md 하나로 관리하고, Claude Code도 이를 직접 읽는 버전·설정을 전제로 한다.
프로젝트 문서 참고 → spec → plan → 구현·검증 → 프로젝트 문서 갱신을 기본 흐름으로 삼고 다른 도구로도 이어받는다.
이 학습 사이트를 운영하는 법에 한정하지 않는다.

전체는 개요를 포함해 일곱 쪽이다. 기본 경로는 개요의 "따라 하기" → AGENTS.md → 설계·계획·진행 기록 →
프로젝트 설계·규약 문서 → 작업 흐름이다. Paseo 사용자는 이어서 "Paseo에서 구현과 리뷰 나누기"를 읽는다.
다른 방식 비교(superpowers 없이 하는 층별 폴더·spec-kit·Kiro·monorepo)는
"더 필요할 때"로 묶은 선택 심화다.
superpowers skill 각각의 절차(TDD·디버깅·리뷰), 두 도구의 설정 항목 전체, API 개발, 모델 성능 비교는 범위 밖이다.

2026-10-24에 10쪽을 6쪽으로 줄였다. 따라 하기 쉽게 만드는 것이 목적이었다. 기본 경로에서는 요구 ID·마일스톤
표·세 층 구조를 빼고, 그것들은 "더 필요할 때"에서만 다룬다. 지운 페이지의 옛 URL은
`src/pages/coding-agents/[page].astro`가 새 위치로 보낸다. 이 라우터의 절별 목적지와 같은 URL의 본문에 둔
호환 anchor를 함께 유지한다. `product-specs`는 작업별 spec을 설명하는 `design-and-plans`로 연결한다.

같은 날 superpowers 배치를 기본으로 바꿨다. 작업별 spec·plan·ledger는 superpowers의 형식과 경로를 따른다.
덱은 AGENTS.md로 문서를 연결하는 법, 도구 간 인계, 프로젝트 설계·규약을 관련 구현과 함께 갱신하는 원칙을 더한다.
프로젝트 문서는 기존 README·docs를 활용하고, 별도 관리가 필요할 때 `docs/design-docs/`를 쓴다.

그 전에 가짜 레포(낡은 CLAUDE.md·.cursorrules·ADR·루트 PLAN.md)에서 이 대화를 모르는 에이전트에게 덱 6쪽만 주고
"가이드대로 바꿔 줘"를 시켜 봤다. 질문 없이 잘 수행했고, 에이전트가 지어내야 했던 세 곳을 덱에 보탰다.
개요의 "AI에게 시킨다" 요청문과 기존 파일 처리 표, AGENTS.md 페이지의 코드 스타일 행이다(계획 README 템플릿은
superpowers 배치로 바꾸며 제거). 덱을 다시 고치면 같은 시험을 반복해 빠진 곳을 찾는다.

## 현재성 기준

2026-10-24에 아래 공식 문서와 공개 레포의 실제 파일을 대조했다. 같은 날 Claude Code 2.1.310 CLI 본문에서
세션 시작 메시지가 `no CLAUDE.md found; AGENTS.md loaded: <경로>`임을 확인했다(2.1.278 때 적었던
`agents-md:` 접두사는 없다). 그 밖의 권한·컨텍스트 복원은 실측한 것이 아니다.
예시 서비스(업무 목록 CSV 내보내기)는 설명용 가정이다.

Paseo 페이지는 같은 날 공식 Codex·Orchestration·Common orchestration workflows·Agent profiles 문서와 대조했다.
중심 질문은 "superpowers 계획의 구현자·리뷰어를 Paseo에서 어떻게 배정하는가"다.
`gpt-6-astra`(설계·조율 medium, 리뷰 high)와 `gpt-6.1-sol`(구현 medium)은 설명용 역할 배정이며,
공식 추천 조합·성능 비교가 아니다. 두 모델의 선택 가능 여부는 Paseo Codex 모델 목록에서 확인했다.
프로필 생성·위임·superpowers 실행의 결합은 실측하지 않았다. 공식 연동 기능이라고 설명하지 않는다.
주 에이전트가 ledger를 관리하고 같은 worktree에서 구현 뒤 리뷰하는 예제로 한정한다.

- Paseo Codex: <https://paseo.sh/docs/codex.md>
- Paseo orchestration: <https://paseo.sh/docs/orchestration.md>
- Paseo workflows: <https://paseo.sh/docs/orchestration-workflows.md>
- Paseo profiles: <https://paseo.sh/docs/agent-profiles.md>

- Anthropic memory: <https://code.claude.com/docs/en/memory>, changelog: <https://code.claude.com/docs/en/changelog>
  (v2.1.277, 2026-09-18부터 AGENTS.md 직접 로딩. 기본값 `claude-md-or-agents-md`는 작업 디렉터리·상위에
  CLAUDE.md·CLAUDE.local.md가 없을 때만 AGENTS.md를 읽고, 있으면 CLAUDE.md만 읽는다. 함께 읽기는
  `claude-md-and-agents-md`. v2.1.281부터 Bedrock·Vertex·Foundry·게이트웨이·telemetry off 세션도 직접 읽는다.
  남은 예외는 이전 버전·업그레이드 직후 첫 세션·내장 plugin 비활성. 덱은 업데이트·설정·새 세션으로 직접 로딩 조건을 맞춘다.
  v2.1.285부터 `pluginConfigs` 키는 `cc-plugin-agents-md@builtin`. AGENTS.local.md·AGENTS.override.md·.agents/는 읽지 않음.
  하위 폴더 AGENTS.md는 그 폴더 파일을 읽을 때 로드. 직접 읽은 AGENTS.md는 /context에 안 나옴. 파일당 200줄 아래 권장.
  v2.1.283부터 `/doctor prompt-audit`가 지침 파일의 낡은 경로·모순을 점검. v2.1.284부터 기본 권한 모드가 auto.)
- Anthropic best practices: <https://code.claude.com/docs/en/best-practices>
  (인터뷰 → 스펙 파일 → 새 세션 구현, 완료 전 별도 컨텍스트 리뷰)
- Anthropic hooks: <https://code.claude.com/docs/en/hooks-guide>
- OpenAI AGENTS: <https://learn.chatgpt.com/docs/agent-configuration/agents-md>
  (전역 `~/.codex/AGENTS.md` → 루트→cwd, 폴더당 `AGENTS.override.md` → `AGENTS.md` 하나, 합계 32 KiB, cwd 아래는 시작 때 읽지 않음)
- OpenAI sandbox·승인: <https://learn.chatgpt.com/docs/sandboxing>, <https://learn.chatgpt.com/docs/agent-approvals-security>
- OpenAI harness engineering: <https://openai.com/index/harness-engineering/>
  (`docs/product-specs`·`design-docs`·`exec-plans/active·completed`. 추천 구조의 이름 출처)
- openai/codex 레포: 2026-09-30 커밋 18131270fe에서 루트 AGENTS.md와 `.codex/skills/`를 삭제. 덱은 옛 커밋 고정 링크와 삭제 사실을 함께 적는다.
- superpowers: <https://github.com/obra/superpowers> (v7.0.1, main 2ce8aa15, 2026-10-21. 별 304k. 설계 `docs/superpowers/specs/<날짜>-<주제>-design.md`,
  계획 `docs/superpowers/plans/<날짜>-<기능>.md`, ledger `.superpowers/sdd/<plan-basename>/progress.md`. `sdd-workspace`가
  `.superpowers/sdd/.gitignore`에 `*`를 쓰되 이미 있으면 덮어쓰지 않음(v7.0.0). 덱의 `*`/`!*/`/`!*/progress.md`/`!.gitignore`
  패턴은 로컬 git에서 progress.md만 추적되고 brief는 제외됨을 확인. 마지막 리뷰 뒤 workspace 삭제. using-superpowers가
  "AGENTS.md가 skill보다 우선"을 명시. brainstorming·writing-plans 모두 "사용자 선호가 기본 경로를 덮는다"고 적음.
  Claude 설치 `/plugin install superpowers@claude-plugins-official`, Codex는 `/plugins`에서 검색. 완료 후 규약을 옮기는 단계 없음)
- GitHub spec-kit: <https://github.com/github/spec-kit> (`specs/<번호>-<기능>/`, constitution은 `.specify/memory/`),
  Kiro specs: <https://kiro.dev/docs/specs/> (requirements·design·tasks, 2026-10부터 bugfix.md 유형 추가)
- 공개 레포 관찰: ghostty 22f100c6(AGENTS.md 약 210단어), opencode c272a63c(약 190줄), tldraw 12921f6d(AGENTS.md + `@AGENTS.md` CLAUDE.md + `.agents/skills/`). 셋 다 계획 문서 없음.

## 서술 규칙

- **사족을 넣지 않는다.** "모든 레포에 강제하지 않는다", "실측은 아니다" 같은 유보는 index와
  이 baseline에 한 번만 두고 본문에서 반복하지 않는다. 본문은 "이렇게 한다"로 쓰고 근거 링크를 그 문장에 건다.
- 페이지마다 중심 질문 하나. AGENTS.md·작업별 파일·프로젝트 문서·작업 흐름을 구분하고,
  적용에 필요한 예시나 요청문을 둔다. 새 개념은 없으면 생기는 문제 → 해법 순서로 연다.
- spec은 이번 작업의 요구·완료 조건, plan은 실행 순서, ledger는 임시 진행 기록이다. 완료된 spec·plan은
  당시 기록으로 남기며, 프로젝트 문서는 현재 구조·데이터·규약과 결정 이유를 설명하고 관련 코드와 함께 갱신한다.
- 프로젝트 문서의 참고·갱신은 기본 흐름이다. 별도 폴더 생성은 선택이며 기존 문서를 활용할 수 있다.
- 설명용 예시는 가상 업무 서비스의 CSV 내보내기 하나로 통일한다. 설계 `docs/superpowers/specs/2026-10-24-csv-export-design.md`,
  계획 `docs/superpowers/plans/2026-10-24-csv-export.md`, ledger `.superpowers/sdd/2026-10-24-csv-export/progress.md`,
  규약 `docs/design-docs/csv-output.md`. superpowers 없이 하는 층별 폴더 예시는 `docs/exec-plans/active/0001-csv-export.md`.
- superpowers의 파일 형식·경로·skill 이름은 지어내지 않고 고정 커밋의 SKILL.md를 인용한다.
  ledger 커밋용 `.gitignore`와 프로젝트 문서 갱신은 덱의 운영 방식으로 구분한다.
- 작은 수정의 설계·계획 파일 생략은 AGENTS.md에 명시하는 덱의 운영 원칙이다. v7.0.1의 brainstorming은
  명확한 단순 요청을 바로 처리하지만, 설계가 필요한 작은 변경은 짧은 설계 문서를 작성·승인받고 writing-plans로 넘긴다.
  "프로젝트만 파일을 만든다"를 제품의 기본 동작으로 설명하지 않는다.
- 구현·검증·작업별 커밋·리뷰는 superpowers 절차를 따른다. 가이드의 템플릿·요청문에 별도 커밋 금지 정책을 넣지 않는다.
  merge·push·PR·브랜치 보존은 finishing 단계의 선택이며, 실행 중 커밋과 구분한다.
- 공유 지침은 CLAUDE.md 없는 AGENTS.md 하나다. 기존 도구별 지침은 적용 범위에 맞는 AGENTS.md에 흡수한 뒤 지운다.
  어댑터 생성이나 두 파일 동시 로딩을 권하지 않는다. 직접 로딩이 안 되면 버전·설정·세션을 바로잡는다.
- 지침은 모델이 읽는 권고이고 강제는 hook·권한·sandbox가 맡는다. 설정 항목 전체는 공식 문서 링크로 대신한다.
- 멈출 지점(계획까지 / 끝까지)은 요청문에 적는다. 사람이 결정하는 지점(설계 승인·계획 승인과 실행 방식·merge 선택)은
  작업 흐름 페이지에서 정하고 다른 페이지는 링크한다.
- 도구를 바꿔 리뷰하는 배치를 권한다. 정확성·요구 누락만 보고하게 한다.
- 이 저장소도 2026-10-24부터 superpowers 배치를 쓴다. 설계·계획 파일 생성은 사용자 요청과 superpowers의
  작업 규모 판단·절차를 따른다. 저장소 정책(`design-docs/` 없이 기존 본문·baseline·지침을 활용)은
  덱에 적지 않는다. 정본은 AGENTS.md의 작업 계획이다.
- 소유자의 개인 레포는 이름으로 인용하지 않는다.

각 학습 본문은 Thesis·TermIntro와 하나의 중심 질문을 가지며 번호 없는 파일명·제목·URL을 쓴다.
