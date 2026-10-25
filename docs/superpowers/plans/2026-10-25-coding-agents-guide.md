# coding-agents Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PM Skills·superpowers를 사용하는 요청 중심 기본 가이드와 참조 부록으로 덱을 개편한다.

**Architecture:** 기존 편집의 유효한 내용을 재사용하고 요청 중심으로 페이지를 재구성한다. 기본 가이드 5쪽에서 요청·결과 확인을 안내하고, 부록 3쪽에서 지침 로딩·문서 역할과 수명·선택적인 Paseo 사용을 설명한다. 추가 규칙의 정본은 project-setup이며 baseline·다른 본문은 이를 연결한다.

**Tech Stack:** Astro Starlight, MDX, 기존 Thesis·TermIntro·Steps·DeckMap, npm run check.

**Spec:** docs/superpowers/specs/2026-10-25-coding-agents-guide-design.md

## Global Constraints

- 기본 경로에서 상황별 요청문·받을 결과·판정 기준을 먼저 찾을 수 있다.
- 설치·지침 로딩, 제품 결정, 설계·계획 승인, 인계 조건은 기본 경로에 남긴다.
- 기본 설치는 superpowers·pm-product-discovery·pm-execution이며, 탐색은 필요한 요청에 적용하고 모든 개발 작업의 필수 선행 단계로 만들지 않는다.
- 스킬 내부 절차·양식·파일명을 다시 정의하지 않는다.
- 기존 미커밋 변경을 출발점으로 유효한 결정·설명·예제를 재사용하며, 완료한 조사·편집을 처음부터 반복하지 않는다.
- 기존 페이지 수·파일·절 구성은 고정하지 않는다. 요청 중심 흐름에 맞춰 통합·분리·삭제·이름과 순서 변경이 가능하다.
- 현재 내부 링크와 리다이렉트 목적지를 새 구성에 맞춘다. 옛 절 ID 80개를 전부 본문에 남기는 것은 완료 조건이 아니다.
- 페이지 순서는 _deck.mjs로 관리한다.
- 현재 main 작업 폴더를 유지하고 커밋·푸시는 하지 않는다. 이는 이 저장소 AGENTS.md의 실행 정책이다.
- 사이트 작성 지침·검증 지침을 따른다. 최종 npm run check는 한 번 실행하고 실패나 추가 수정이 있을 때만 반복한다.
- 새 페이지와 순서 변경만으로 브라우저를 실행하지 않는다.
- 사이트 UI·배포·공통 설정·다른 덱은 범위 밖이다. 커밋·푸시는 하지 않는다.

## Review Focus

1. 실제 스킬을 읽을 수 없거나 설치 버전이 다름: 사용 가능한 원문·버전·미확인을 구분하고 덱의 요약으로 덮어쓰지 않는다. Task 1에서 설치본과 요청문 대조.
2. 기존 PRD가 다른 위치에 있거나 없고 탐색·수정 범위도 다름: 기존 파일을 활용하고, 연결만 요청한 작업은 탐색·PRD 작성까지 확대하지 않는다. Task 1에서 PRD 존재/부재·빈 프로젝트 두 범위·탐색만/PRD까지·확정 요구의 탐색 비반복·PRD 리뷰만/리뷰와 문서 수정을 대조한다.
3. 제품 요구는 합의했으나 설계·계획은 미승인: 승인 순서가 유지되고 계획까지만 요청하면 구현하지 않는다. Task 2에서 단계별 요청과 받을 결과 대조.
4. 다른 폴더에서 재개하며 미추적 파일·Git 제외 ledger가 빠짐: 실제 상태를 먼저 맞추고 완료 작업을 반복하지 않는다. Task 2에서 같은 폴더/다른 폴더 사례 대조.
5. 통합·삭제한 페이지에 옛 규칙이나 끊긴 참조가 남음: baseline·본문·요청문과 이동 매핑이 새 구성으로 이어진다. Task 3의 이관 대조와 의미 검색, Task 4의 실제 내부 링크·리다이렉트 목적지 검사.

---

## 승인·재개 조건

이 계획은 사용자 요청에 따라 수정한 **검토 초안**이다. 개편 방향의 합의를 설계·계획 승인으로 보지 않는다.
설계 builder check → 사용자 설계 승인 → writing-plans 자체 검토·사용자 계획 리뷰 확인을 거친 뒤 실행한다.
설계 승인 후 이 초안과 달라지는 내용이 있으면 갱신된 계획을 제시한다. 이미 제시된 두 문서를 사용자가
명시적으로 모두 확인한 경우 같은 승인 질문을 반복하지 않는다.
후속 요청은 기존 문서·목차·페이지 구성을 바꿔도 된다는 범위 수정이며 세부 설계·계획 전체의 승인으로 간주하지 않는다.
pm-product-discovery를 기본으로 안내한다는 추가 합의도 설치·기획 안내 범위의 수정이다. 본문 개편 실행이나 패키지 설치 승인으로 확대하지 않는다.

기존 실행 선호는 SDD이며, 도구가 없을 때 native다. 이 선호를 재선택하게 하지 않는다.
이번 계획은 파일 경계별로 Task 1 → 2 → 3을 순차 구현·리뷰하고 Task 4에서 통합 검증한다.
각 작업은 이전 작업의 링크·경로를 소비한다. 본문 의미 리뷰는 콘텐츠에 맞게 수행하며 코드용 TDD를
문장 단위 테스트로 복제하지 않는다. 아래 작업의 의미 검토는 두 실행 경로 모두 수행한다.
별도 작업 리뷰어는 SDD에서만 주 에이전트가 작성자와 분리해 배정한다. SDD의 하위 구현자는 리뷰어를 생성하지 않는다.
native는 executing-plans에 따라 작업별 별도 리뷰어 없이 진행하고 최종 전체 변경 리뷰를 유지한다.
하위 에이전트 도구가 있으면 새 최종 리뷰어를 배정하고, 없으면 최종 self-review와 그 제한을 보고한다.

지속할 결정은 관련 본문 작업에서 본문·baseline에 반영해 Task 4의 통합 검증과 최종 리뷰에 포함한다.
최종 리뷰에서 새로 생긴 결정도 해당 수정과 함께 반영하고 필요한 검증·리뷰 절차를 따른다.
Task 4는 통합 검증·리뷰 자료 준비만 맡는다. 모든 Task의 완료 기록 이후 최종 전체 리뷰·수정 처리·workspace 정리는
주 에이전트가 실행 스킬에 따라 수행하며 Task 4 담당자에게 위임하지 않는다.

현재 HEAD는 `abe3a07`이며 시작 시 추적 변경 8개, 미추적 본문 3개와 설계·계획 2개다.
`installation`은 이미 있으므로 Create로 다시 수행하지 않는다. `updates-and-handoff`만 아직 없다.
Task 번호는 이번 개정에서 재구성했다. 이전 ledger의 Task 1은 아래 Task 1·2에 걸친 부분 편집이며
새 번호의 완료 증거가 아니다. 실제 상태를 대조한 결과를 ledger에 기록한 뒤 빠진 부분만 작업한다.

검토 패키지는 `git diff HEAD -- <대상>`와 대상 미추적 파일 원문·검증 보고로 만든다.
스킬의 review-package는 커밋 범위를 요구해 현재 무커밋 정책과 맞지 않으므로 `HEAD..HEAD`를 넣지 않는다.
작업별 범위는 시작 시 보관한 파일 사본과 이후 diff로 구분하고, 최종 리뷰는 개편 전체를 본다.
완료 기록에는 실제 파일·검증·리뷰 증거를 쓰고 존재하지 않는 커밋 범위를 만들지 않는다.

## 모든 Task 완료 후 주 에이전트의 최종 리뷰·정리

이 절은 구현자에게 넘기는 Task가 아니다. 주 에이전트가 Task 4까지 완료 기록을 남긴 뒤
선택한 실행 스킬의 최종 리뷰·수정·finishing 절차를 적용한다. 아래 스킬 경로는 설치된 superpowers의 `skills/` 기준이다.

- SDD는 `subagent-driven-development/references/final-review.md`에 따라 전체 변경 리뷰와 후속 수정·검토를 주관한다.
- native는 `executing-plans/SKILL.md`의 Final Review를 따른다. 하위 에이전트 도구가 있으면 새 리뷰어를 배정하고,
  없으면 마지막 Task 완료 기록 뒤 별도 self-review를 수행해 `Final review: self-review (no subagent tool)`과 제한을 보고한다.
- 최종 리뷰에서 새로 생긴 결정은 해당 수정과 함께 본문·baseline에 반영하고 영향받는 검증과 실행 스킬의 리뷰 절차를 수행한다.
  문서 갱신을 최종 리뷰 이후 처음 수행할 별도 정리 작업으로 미루지 않는다.
- 작업 완료·최종 리뷰·수정 및 검증 결과를 기록하고, 모든 Ruling과 남은 제한·보류 사항을 최종 보고에 확보한다.
  실행 스킬의 정리 조건을 충족한 뒤 주 에이전트만 이번 workspace를 정리한다. 완료 기록 전이나 승인 대기 중에는 삭제하지 않는다.
  무커밋 정책에 맞춰 실제 diff·원문·검증 증거로 보고하며 커밋·병합을 완료 조건으로 새로 요구하거나 수행하지 않는다.

## 파일 책임과 현재 상태

모든 본문 경로는 `src/content/docs/coding-agents/` 기준이다.

| 파일 | 현재 상태 | 이번 책임 |
|---|---|---|
| _baseline.md, _deck.mjs, index.mdx | 새 방향의 부분 편집 | 버전·범위와 기본/부록 연결 정합성 |
| installation.mdx, project-setup.mdx | 미추적, 새 방향의 초안 | 설치 증거·적용 범위·최소 연결 규칙 보완 |
| product-requirements.mdx | 미추적, 옛 규칙 잔존 | discovery 탐색에서 create-prd 작성·리뷰로 연결하는 요청과 결과 확인 |
| workflow.mdx | 부분 편집, 옛 규칙 잔존 | superpowers 개발 요청·승인·결과 확인 |
| updates-and-handoff.mdx | 없음, 참조만 있음 | 요구 변경·갱신·이어받기 |
| agents-md.mdx, design-and-plans.mdx | 부분 편집 | 지침 로딩·문서 역할과 수명 부록 |
| design-docs.mdx, other-approaches.mdx | 부분 편집 | 유효한 내용 통합 후 학습 페이지 삭제 |
| paseo-agents.mdx | 기존 본문 그대로 | 선택 부록화·연결 요청 간소화 |
| src/pages/coding-agents/[page].astro | 기존 파일 그대로 | 통합·삭제한 페이지와 기존 이동 경로를 새 목적지로 연결 |

### Task 1: 기획까지의 요청과 연결 기준 정리

**Files:**
- Modify: `src/content/docs/coding-agents/_baseline.md`, `index.mdx`, `installation.mdx`, `project-setup.mdx`, `product-requirements.mdx`
- Review: `src/content/docs/coding-agents/_deck.mjs`

**Interfaces:**
- Consumes: 설계의 설치 버전 표, 기존 파일·AGENTS.md 정책, 기존 절 ID의 변경 영향 목록.
- Produces: `/coding-agents/project-setup/#ai가-적용할-연결-규칙`, `/coding-agents/product-requirements/#기존-prd를-리뷰한다`, 기획에서 개발로 넘길 `docs/product-specs/PRD-task-manager.md` 예시.

- [ ] **Step 1: 설치 원문과 공개 근거를 연결한다.** Codex superpowers 7.0.1·Claude Code 7.0.0·pm-execution 2.2.0을 구분한다. pm-product-discovery도 기본 설치 안내에 추가한다. 설계에 기록한 discovery marketplace 원문과 설치본 확인을 구분하고, 각 패키지의 실제 스킬·버전을 확인하는 요청을 둔다. 실제 열람과 자동 발견·실행 실측을 구별한다. 기존 PM Skills 공개 커밋의 create-prd와 설치본 대응 확인 결과를 재사용한다.
  Expected: 기본 설치 대상은 세 패키지이며 discovery를 이미 설치·실행했다고 쓰지 않는다. 파일명·PRD 질문 조건·설계 승인 설명의 출처가 명확하고 버전 전체가 동일하다는 주장이 없다.
- [ ] **Step 2: 연결 규칙과 적용 요청을 바로잡는다.** 새 PRD 보관 폴더만 지정하고 `PRD-[product-name].md`를 유지한다. 기존 문서는 원래 위치에서 연결하고 허용한 수정만 반영한다. 문서 연결만 요청했을 때 PRD가 없으면 기획 페이지로 연결한다. 새 프로젝트의 전체 세팅 요청과 문서만 준비하는 요청의 결과를 구별한다. 실행 선호는 사전 지정된 선호로 전달하고 별도 공통 규칙 행에서는 뺀다. 이번 작업에서 지속할 역할·범위·확인 근거를 본문·baseline에 함께 반영한다.
  Expected: 기존 문서 사본·필수 제품 README·연결만 요청한 작업의 자동 탐색/PRD 생성·요청 밖 환경 설치가 없다. 신규 세팅에서는 필요한 제품 탐색을 거쳐 같은 첫 PRD로 연결한다.
- [ ] **Step 3: 탐색·기획·PRD 리뷰 본문을 정리한다.** 상황별 짧은 요청문과 받을 결과를 먼저 둔다. 아이디어나 해결 방향을 탐색하는 요청에는 pm-product-discovery를 연결하고, 후보·선택 이유·핵심 가정·근거・실험과 판정 기준을 결과에서 확인하게 한다. 탐색만 요청하면 그 결과에서 멈추고, PRD까지 요청하면 제품 맥락과 남은 가정을 create-prd에 넘긴다. 스킬의 질문·양식은 복제하지 않고 부족한 제품 맥락과 가정 처리 조건을 설명한다. 탐색 산출물은 실제 경로로 연결하며 새 고정 파일명·양식을 만들지 않는다. PRD 리뷰만 요청한 예시는 결정에 필요한 누락을 먼저, 줄일 내용을 다음으로 제안하고 멈춘다. 리뷰와 문서 수정 예시는 대상 파일·문장 및 링크 교정 등 허용 범위를 명시하고 수정 내역을 보고한다. 제품 목적·범위·정책의 변경은 제안으로 남긴다. 요구 변경의 상세 요청은 Task 2의 페이지로 연결한다. 현재 참조를 새 절로 맞추고 불필요한 옛 절 안내는 제거한다.
  Expected: overview·요구 ID 신설·상태 관리 양식이 사라진다. PRD 리뷰만 요청하면 파일 변경·새 PRD 생성이 없고, 수정 포함 요청은 허용 범위만 기존 위치에 반영한다. 실험 설계가 검증 완료로 표현되지 않으며, 기획만 요청한 작업은 개발 설계·계획·구현으로 넘어가지 않는다.
- [ ] **Step 4: 의미 검토와 작업 보고를 마친다.** 기존 PRD 존재/부재, 새 프로젝트 문서만/환경 포함, 탐색만/PRD까지, PRD 리뷰만/리뷰와 문서 수정 요청을 각각 스킬과 대조한다. 리뷰만 요청은 지적·제안으로 끝나는지, 수정 포함 예시는 대상·범위와 수정 내역이 맞는지 확인한다. 확정 요구에 탐색을 반복하지 않는지, 실험 계획을 실제 검증 결과로 보고하지 않는지 확인한다. 새 프로젝트 세팅에서 작성한 PRD를 다음 페이지에서 다시 만들지 않는지 확인한다. `git diff --check` 결과와 작업 범위의 원문을 보고한다. SDD의 별도 작업 리뷰·완료 기록은 주 에이전트가 맡고 native는 직접 검토 결과를 기록한다.
  Expected: Review Focus 1·2 충족. 승인된 구현·검증 완료로 과장하지 않고 남은 작업을 ledger에 기록한다.

### Task 2: 개발·갱신·이어받기 기본 경로 완성

**Files:**
- Modify: `src/content/docs/coding-agents/workflow.mdx`, `_deck.mjs`
- Create: `src/content/docs/coding-agents/updates-and-handoff.mdx`
- Adjust links if needed: `src/content/docs/coding-agents/index.mdx`, `project-setup.mdx`, `product-requirements.mdx`

**Interfaces:**
- Consumes: Task 1의 연결 규칙·PRD 예시와 승인 조건.
- Produces: `/coding-agents/workflow/`, `/coding-agents/updates-and-handoff/`; 기본 가이드 순서 installation → project-setup → product-requirements → workflow → updates-and-handoff.

- [ ] **Step 1: 개발 요청과 확인 순서를 작성한다.** 합의한 PRD를 입력으로 접근법·설계 승인을 받은 뒤 계획을 작성·검토하고 실행한다. 계획까지만 요청과 승인 후 끝까지 실행 요청을 구분한다. 제품 결정이 바뀌는 경우만 PM Skills와 사용자 결정으로 돌아간다. 자체 파일 생략·추가 도구 리뷰 강제는 제거한다.
  Expected: 제품 합의가 설계·계획 승인으로 오인되지 않고 기존 요구의 버그 수정에 제품 탐색이나 PRD 재작성을 강제하지 않는다.
- [ ] **Step 2: 변경·갱신 요청을 작성한다.** 같은 PRD에서 CSV 한도 1,000건 → 5,000건을 다룬다. 5,000건 성공·5,001건 제한 안내, 기존 권한·필터 유지의 결과 확인을 둔다. 제품 요구·기술 문서는 관련 구현과 함께 갱신해 통합 검증·최종 리뷰에 포함하고, 최종 리뷰에서 생긴 결정도 해당 수정과 함께 반영하도록 설명한다. 구현/출시 여부를 구분하되 새 상태 양식을 만들지 않는다.
  Expected: 결정된 변경과 실제 제공 상태가 구분되고 완료된 spec·plan을 현재 기준으로 계속 고치지 않는다.
- [ ] **Step 3: 인계·재개 요청을 작성한다.** 같은 작업 폴더에서는 기존 spec·plan·ledger와 git log/status/diff를 대조한다. 다른 폴더에서는 미커밋·미추적 파일·Git 제외 기록까지 전달하고 필요한 로컬 실행 준비도 확인한다. ledger가 없으면 코드·기록으로 범위를 복원하며 없다는 이유로 처음부터 반복하지 않는다.
  Expected: 계획 경로만 전달해도 모든 파일이 이동한다는 오해가 없다. 실행하지 않은 검증은 미확인이다.
- [ ] **Step 4: 소스 구조의 의미 검토와 작업 보고를 마친다.** 기본 가이드 5쪽을 등록하고 부록은 Task 3에서 3쪽으로 줄인다. map·본문 링크를 실제 제목과 맞춘다. Review Focus 3·4를 요청문과 대조하고 `git diff --check` 결과와 작업 범위의 원문을 보고한다. 별도 작업 리뷰는 SDD일 때 주 에이전트가 배정한다.
  Expected: updates-and-handoff가 등록되고 기본 경로가 부록의 선행 학습 없이 읽힌다.

### Task 3: 부록 통합과 페이지 이동 연결

**Files:**
- Modify: `src/content/docs/coding-agents/agents-md.mdx`, `design-and-plans.mdx`, `paseo-agents.mdx`, `_deck.mjs`, `_baseline.md`, `index.mdx`
- Merge then remove: `src/content/docs/coding-agents/design-docs.mdx`, `other-approaches.mdx`
- Modify: `src/pages/coding-agents/[page].astro` (목적지 매핑·표시 문구)
- Adjust incoming links: `src/content/docs/coding-agents/*.mdx` (현재 검색에서 다른 덱의 해당 경로 참조는 없음)

**Interfaces:**
- Consumes: Task 1의 연결 규칙, Task 2의 기본 가이드, 기존 본문·절 ID 목록과 정적 이동 페이지의 매핑.
- Produces: 부록 agents-md → design-and-plans → paseo-agents, 통합 문서와 새 이동 목적지. 기존 페이지·절 구성을 보존할 의무는 없다.

- [ ] **Step 1: 부록을 통합하고 중복 절차를 제거한다.** design-docs의 현재 기술 문서·갱신 예제를 design-and-plans로 옮기고 제목을 문서 역할과 수명으로 바꾼다. other-approaches의 하위 지침 설명은 agents-md로, 필요한 공식 근거는 해당 설명으로 옮긴다. 기존 미커밋 내용에서 옮긴 사실·예제와 삭제한 중복·비교·옛 규칙을 ledger에 기록한 뒤 두 MDX를 삭제한다. AGENTS.md 예시는 실제 명령·읽을 경로·문서 갱신 연결만 간결하게 남긴다. 작은 변경 파일 생략·ledger Git 추적 예제·별도 수동 계획 양식·기능 수 기반 분리·반복 위임 규칙을 없앤다. 코드 블록 안에도 같은 기준을 적용한다. 스킬의 양식은 원문을 연결한다.
  Expected: 덱의 추가 규칙은 보관·연결·인계·갱신에 한정되고 project-setup의 정본과 모순되지 않는다.
- [ ] **Step 2: 실제 도구 조건을 반영한다.** Claude Code 로딩을 공식 `/memory` 안내·버전·설정과 대조하고 기존 import·도구 전용 파일을 일괄 삭제하지 않는다. native 실행의 도구 부재 시 최종 self-review·제한 보고를 설명한다. Paseo는 프로필·같은 작업 폴더 연결만 남기고 모델 배정은 예시, 결합 실행은 미실측으로 밝힌다.
  Expected: 도구가 없는데 위임·독립 리뷰를 완료했다는 설명이 없다. 부록을 새 필수 절차로 만들지 않는다.
- [ ] **Step 3: 새 페이지 구성과 들어오는 참조를 연결한다.** sidebar·map·index·baseline을 기본 5쪽/부록 3쪽으로 맞춘다. design-docs·other-approaches 옛 URL은 정적 이동 페이지에서 design-and-plans로 연결하고 monorepo 관련 절은 agents-md의 해당 절로 연결한다. specs-and-design·monorepo-instructions·public-repositories 기존 경로도 새 페이지를 직접 가리킨다. 현재 본문에서 폐기된 경로·절을 참조하는 링크는 수정한다.
  Expected: 삭제한 MDX와 새 이동 라우트의 충돌 없음, 이동 사슬 없음, 현재 내부 참조 누락 0. 옛 절 ID 80개는 영향 확인 자료로만 사용하며 빈 호환 절을 본문에 쌓지 않는다.
- [ ] **Step 4: 잔존 규칙의 의미 검토와 작업 보고를 마친다.** 아래 검색 결과를 본문·baseline·요청문 전체에서 읽는다. 기존 문서의 요구 ID 보존이나 삭제 대상 설명은 신규 규칙과 구분한다. 이번 작업에서 지속할 결정을 관련 본문·baseline에 반영했는지 확인한다.
  Run: `rg -n 'overview|product-specs/README|CSV-0|요구 ID|작은 수정|파일 생략|둘 이상|기능 수|exec-plans|progress\.md|추가 리뷰|40줄|CLAUDE\.md|기본 실행' src/content/docs/coding-agents`
  Expected: 스킬을 덮어쓰는 규칙은 0건. 관련 용어 자체의 0건을 요구하지 않는다. `git diff --check` 결과와 작업 범위의 원문을 보고하고, 주 에이전트는 실행 경로에 맞는 리뷰 결과를 ledger에 기록한다.

### Task 4: 통합 검증과 최종 리뷰 자료 준비

이 작업은 본문 구현 Task가 아니라 통합 확인·증거 정리 작업이다. 담당자는 검증 결과와 리뷰 자료를
주 에이전트에게 전달한다. 리뷰어 생성·최종 전체 변경 리뷰·workspace 삭제는 이 Task의 책임이 아니다.

**Files:**
- Review: Task 1~3 전체 파일과 설계·계획
- Record: `.superpowers/sdd/2026-10-25-coding-agents-guide/` (Git 제외)

**Interfaces:**
- Consumes: 완성된 기본 가이드·부록, pre-edit-anchors.json, 정적 이동 페이지 매핑, 작업별 리뷰 결과.
- Produces: 사이트 검사 증거, 현재 참조·새 이동 목적지 대조 결과, 최종 리뷰에 넘길 전체 변경 자료와 미실측 범위 보고.

- [ ] **Step 1: 전체 변경의 범위와 의미를 확인한다.** `git status --short --untracked-files=all`, `git diff --check`를 확인하고 미추적 본문도 읽는다. spec의 모든 목표와 Review Focus 5개를 실제 본문에 연결한다. 앞선 의미 리뷰가 다룬 조건을 이유 없이 재실행하지 않고 새 충돌만 해결한다.
  Expected: 범위 밖 변경 없음, 누락된 새 파일 없음, 지속할 결정이 이미 반영된 baseline·본문·요청문의 일관성 확인. 누락은 관련 작업에서 보완한 뒤 검증한다.
- [ ] **Step 2: 필수 사이트 검사를 한 번 실행한다.**
  Run: `npm run check` (출력은 이번 workspace의 check.log에 보관하고 종료 코드·전체 결과를 확인).
  Expected: 콘텐츠 검사·Astro 빌드·렌더된 내부 링크 검사 모두 성공, 종료 코드 0. 실패 시 원인을 고친 뒤 필요한 검사를 다시 실행한다.
- [ ] **Step 3: 페이지 구성과 변경한 이동 동작을 검사한다.** 설치된 parse5로 정적 이동 페이지의 기본 목적지와 anchorDestinations가 출력 HTML의 실제 페이지·절을 가리키는지 대조한다. sidebar·map의 기본 5쪽/부록 3쪽과 본문 등록을 확인한다. `playwright-cli` 스킬을 읽고 로컬 preview에서 대표 두 경로(design-docs의 옮긴 절, monorepo-instructions의 매핑된 절)에 query를 붙여 새 페이지·절·query 보존을 확인한다.
  Expected: 매핑된 목적지 누락 0, 본문 등록 누락·중복 0, 대표 이동 2건 통과. 외부의 모든 옛 절 주소가 호환된다고 보고하지 않는다. 나머지 덱 순회·UI 검사는 하지 않는다.
- [ ] **Step 4: 최종 리뷰 자료를 주 에이전트에게 전달한다.** 전체 미커밋 diff·미추적 원문·spec·plan·검증 증거·ledger의 판단과 남은 제한을 정리한다. SDD에서는 주 에이전트가 Task 4의 결과를 작업 범위 안에서 리뷰하고 완료를 기록한다. native에서는 직접 검토 결과와 완료를 기록한다. 이 작업의 리뷰를 최종 전체 변경 리뷰로 대체하지 않는다.
  Expected: 검토 가능한 전체 변경 자료와 실제 검증 결과가 갖춰지고 workspace는 보존된다. 전체 실행·Paseo 결합·새 세션 이관을 실측했다고 쓰지 않는다.
