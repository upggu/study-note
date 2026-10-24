# 설계·계획 문서

이 폴더는 superpowers가 설계와 계획을 쓰는 기본 자리다. 파일을 언제 만드는지는
[AGENTS.md의 작업 계획](../../AGENTS.md#작업-계획)이 정본이고, 파일 형식은 superpowers skill이 정한다.
이 저장소는 형식을 덧붙이지 않는다.

| 폴더 | 내용 | 만드는 skill |
|---|---|---|
| `specs/` | 작업 하나의 설계. `YYYY-MM-DD-<주제>-design.md` | brainstorming |
| `plans/` | 그 설계를 구현하는 계획. `YYYY-MM-DD-<이름>.md` | writing-plans |

실행 중 진행 기록(ledger)은 `.superpowers/sdd/<계획 이름>/progress.md`에 생기고 Git에서 제외된다.
최종 리뷰 뒤 finishing 단계로 넘어가기 전에 superpowers가 그 폴더를 지운다. `ls .superpowers/sdd/`는
현재 작업 폴더의 실행 기록을 찾는 데 쓴다. 아직 실행하지 않았거나 다른 clone·worktree에 기록이 있을 수도 있으므로,
완료 여부는 계획·실제 변경·검증 결과를 대조해 판단한다.

## ledger 삭제 전에 옮길 것

설계·계획은 끝나도 고치지 않는다. 앞으로도 필요한 사실은 최종 리뷰와 ledger 삭제 전에 제자리로 옮긴다. 덱 버전·범위는 `_baseline.md`,
학습 내용은 본문, 공통 작성·검증 규칙은 `docs/`의 해당 지침, 실습 사용법은 공개 실습 저장소 `../study-lab`의
해당 README에 반영한다. 저장소 전체에 반복해서 필요한 행동 규칙만 AGENTS.md에 둔다.

비밀번호·개인키·토큰·실제 개인정보와 긴 원본 로그는 기록하지 않는다.
검증 종류와 범위는 [검증 지침](../verification.md)을 따른다.
