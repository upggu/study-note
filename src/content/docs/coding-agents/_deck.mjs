export default {
  "navOrder": 2100,
  "catalogOrder": 2100,
  "label": "Claude Code · Codex",
  "title": "AI에게 기획부터 개발까지 맡기기",
  "icon": "pencil",
  "aliases": [
    "코딩 에이전트",
    "Coding Agents",
    "AGENTS.md",
    "CLAUDE.md",
    "superpowers",
    "PM Skills",
    "pm-execution",
    "product-specs",
    "PRD",
    "design-docs",
    "ledger"
  ],
  "description": "PM Skills와 superpowers에 기획·개발을 맡기는 요청 중심 가이드. 설치·프로젝트 적용·결과 확인·갱신과 이어받기.",
  "category": "tools",
  "tags": [
    "agent"
  ],
  "termIntro": "required",
  "sidebar": [
    {
      "label": "기본 가이드",
      "pages": [
        "installation",
        "project-setup",
        "product-requirements",
        "workflow",
        "updates-and-handoff"
      ]
    },
    {
      "label": "부록",
      "pages": [
        "project-structure",
        "agents-md",
        "design-and-plans",
        "paseo-agents",
        "plans-outside-repo"
      ]
    }
  ],
  "map": [
    {
      "label": "설치",
      "href": "/coding-agents/installation/",
      "title": "스킬 설치와 준비 확인",
      "tone": "key",
      "desc": "사용하는 도구에 설치하고 실제 스킬·지침 로딩을 확인한다"
    },
    {
      "label": "적용",
      "href": "/coding-agents/project-setup/",
      "title": "프로젝트에 적용하기",
      "tone": "key",
      "desc": "기존 문서를 연결하거나 새 프로젝트의 첫 기획과 실행 환경을 준비한다"
    },
    {
      "label": "기획",
      "href": "/coding-agents/product-requirements/",
      "title": "제품 기획과 PRD 리뷰 맡기기",
      "tone": "key",
      "desc": "제품 맥락을 전달하고 범위·가정·성과 기준을 확인한다"
    },
    {
      "label": "개발",
      "href": "/coding-agents/workflow/",
      "title": "개발 맡기고 결과 확인하기",
      "tone": "ok",
      "desc": "합의한 요구를 넘겨 설계·계획을 검토하고 개발 결과를 확인한다"
    },
    {
      "label": "갱신",
      "href": "/coding-agents/updates-and-handoff/",
      "title": "변경하고 이어받기",
      "tone": "ok",
      "desc": "요구와 문서를 함께 갱신하고 같은 폴더·다른 폴더의 인계 조건을 확인한다"
    },
    {
      "label": "참조",
      "title": "필요할 때 찾는 부록",
      "tone": "mute",
      "desc": "적용한 프로젝트의 폴더 구조·지침 로딩·문서 갱신과 수명·Paseo 연결 조건·레포 밖 개인 계획",
      "items": [
        [
          "적용한 프로젝트의 폴더 구조",
          "/coding-agents/project-structure/"
        ],
        [
          "AGENTS.md와 지침 로딩",
          "/coding-agents/agents-md/"
        ],
        [
          "문서 역할과 수명",
          "/coding-agents/design-and-plans/"
        ],
        [
          "Paseo 프로필과 작업 폴더 연결",
          "/coding-agents/paseo-agents/"
        ],
        [
          "계획을 레포 밖에 둘 때",
          "/coding-agents/plans-outside-repo/"
        ]
      ]
    }
  ]
};
