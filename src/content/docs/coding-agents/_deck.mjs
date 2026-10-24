export default {
  "navOrder": 2100,
  "catalogOrder": 2100,
  "label": "Claude Code · Codex",
  "title": "Claude Code · Codex 레포 운영",
  "icon": "pencil",
  "aliases": [
    "코딩 에이전트",
    "Coding Agents",
    "AGENTS.md",
    "CLAUDE.md",
    "superpowers",
    "design-docs",
    "ledger"
  ],
  "description": "superpowers로 작업별 spec·plan을 관리하고, 프로젝트의 현재 설계·규약을 함께 갱신하며 Codex와 Claude Code로 작업을 이어가는 방법.",
  "category": "tools",
  "tags": [
    "agent"
  ],
  "termIntro": "required",
  "sidebar": [
    {
      "label": "기본",
      "pages": [
        "agents-md",
        "design-and-plans",
        "design-docs"
      ]
    },
    {
      "label": "작업 흐름",
      "pages": [
        "workflow"
      ]
    },
    {
      "label": "더 필요할 때",
      "pages": [
        "other-approaches"
      ]
    }
  ],
  "map": [
    {
      "label": "지침",
      "href": "/coding-agents/agents-md/",
      "title": "AGENTS.md",
      "tone": "key",
      "desc": "명령·제약·읽을 문서·작업 방식 40줄. 두 도구가 읽는 조건과 읽혔는지 확인하는 법"
    },
    {
      "label": "파일",
      "href": "/coding-agents/design-and-plans/",
      "title": "설계 · 계획 · 진행 기록",
      "tone": "warn",
      "desc": "작업별 spec·plan과 임시 실행 기록의 역할. 완료된 작업 기록과 프로젝트의 현재 기준을 구분한다"
    },
    {
      "label": "프로젝트",
      "href": "/coding-agents/design-docs/",
      "title": "프로젝트 설계·규약 문서",
      "tone": "zone",
      "desc": "현재 구조·데이터·규약과 결정 이유. 작업 시작 때 참고하고 관련 구현과 함께 갱신한다"
    },
    {
      "label": "흐름",
      "href": "/coding-agents/workflow/",
      "title": "참고 · 설계 · 구현 · 갱신",
      "tone": "ok",
      "desc": "프로젝트 문서에서 시작해 spec·plan으로 구현하고 현재 기준을 갱신하는 흐름과 도구 간 인계"
    },
    {
      "label": "심화",
      "title": "더 필요할 때",
      "tone": "mute",
      "desc": "superpowers 없이 하는 법, 다른 방식의 비교와 monorepo의 지침 경계",
      "items": [
        ["다른 방식과 비교", "/coding-agents/other-approaches/"]
      ]
    }
  ]
};
