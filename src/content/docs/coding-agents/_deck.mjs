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
    "exec-plans",
    "product-specs",
    "design-docs"
  ],
  "description": "Codex와 Claude Code가 같은 기준으로 일하도록 레포의 지침 파일과 스펙·설계·계획 문서를 두고 유지하는 방법.",
  "category": "tools",
  "tags": [
    "agent"
  ],
  "termIntro": "required",
  "sidebar": [
    {
      "label": "레포 구조",
      "pages": [
        "repository-layout"
      ]
    },
    {
      "label": "지침 파일",
      "pages": [
        "agents-md",
        "instruction-loading"
      ]
    },
    {
      "label": "문서 세 층",
      "pages": [
        "product-specs",
        "design-docs",
        "exec-plans"
      ]
    },
    {
      "label": "작업 흐름",
      "pages": [
        "workflow"
      ]
    },
    {
      "label": "선택 심화",
      "pages": [
        "monorepo-instructions",
        "public-repositories"
      ]
    }
  ],
  "map": [
    {
      "label": "구조",
      "href": "/coding-agents/repository-layout/",
      "title": "레포 구조",
      "tone": "key",
      "desc": "지침 파일 하나와 문서 세 층. 각 파일이 답하는 질문과 갱신 시점"
    },
    {
      "label": "지침",
      "title": "AGENTS.md",
      "tone": "ok",
      "desc": "무엇을 적고 무엇을 뺄지, 두 도구가 이 파일을 언제 읽는지",
      "items": [
        ["AGENTS.md 작성법", "/coding-agents/agents-md/"],
        ["지침 로딩", "/coding-agents/instruction-loading/"]
      ]
    },
    {
      "label": "문서",
      "title": "스펙 · 설계 · 계획",
      "tone": "warn",
      "desc": "요구는 스펙, 규약과 결정은 설계, 순서와 현재 상태는 계획",
      "items": [
        ["스펙 문서", "/coding-agents/product-specs/"],
        ["설계 문서", "/coding-agents/design-docs/"],
        ["계획 문서", "/coding-agents/exec-plans/"]
      ]
    },
    {
      "label": "흐름",
      "href": "/coding-agents/workflow/",
      "title": "요청 · 구현 · 검증 · 인계",
      "tone": "zone",
      "desc": "한 작업을 요청부터 다른 도구의 재개까지 끌고 가는 순서"
    },
    {
      "label": "심화",
      "title": "선택 심화",
      "tone": "mute",
      "desc": "규칙이 갈라지는 monorepo와 공개 레포의 배치 비교",
      "items": [
        ["Monorepo의 지침 경계", "/coding-agents/monorepo-instructions/"],
        ["공개 레포의 배치 비교", "/coding-agents/public-repositories/"]
      ]
    }
  ]
};
