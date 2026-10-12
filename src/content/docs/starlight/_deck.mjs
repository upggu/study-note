export default {
  "navOrder": 1300,
  "catalogOrder": 2000,
  "label": "Starlight",
  "title": "Starlight",
  "icon": "star",
  "aliases": [
    "Astro Starlight",
    "AI 지식 정리",
    "시각적 학습 문서"
  ],
  "description": "AI가 정리하고 사람이 읽고 피드백하는 지식베이스 — 시각 자료 활용부터 검토와 웹 공유까지.",
  "category": "tools",
  "tags": [],
  "termIntro": "required",
  "sidebar": [
    {
      "label": "목적과 도구 선택",
      "pages": [
        "intro",
        "landscape"
      ]
    },
    {
      "label": "AI와 문서 다듬기",
      "pages": [
        "writing",
        "site-vocabulary"
      ]
    },
    {
      "label": "시각적으로 이해하기",
      "pages": [
        "components",
        "d2",
        "learning-flow"
      ]
    },
    {
      "label": "검토와 공유",
      "pages": [
        "pipeline",
        "publishing",
        "github-pages",
        "vercel",
        "cloudflare-pages"
      ]
    }
  ],
  "map": [
    {
      "label": "목적과 도구 선택",
      "href": "/starlight/intro/",
      "title": "왜 웹 문서인가",
      "tone": "mute",
      "desc": "AI 작성 · 사람의 피드백 · 문서 도구 비교",
      "note": "다시 읽고 찾고 공유할 지식을 어떤 방식으로 쌓을까",
      "items": [
        [
          "문서 도구 선택",
          "/starlight/landscape/"
        ]
      ]
    },
    {
      "label": "AI와 문서 다듬기",
      "href": "/starlight/writing/",
      "title": "질문에서 문서로",
      "tone": "key",
      "desc": "새 덱 요청 · 기존 노트 정리 · 화면을 짚는 피드백",
      "note": "코드를 직접 쓰지 않고 원하는 학습 결과를 전달한다",
      "items": [
        [
          "화면 명칭과 수정 요청",
          "/starlight/site-vocabulary/"
        ]
      ]
    },
    {
      "label": "시각적으로 이해하기",
      "href": "/starlight/components/",
      "title": "보고 따라가며 이해하기",
      "tone": "ok",
      "desc": "표·탭·카드 · 이미지와 관계도 · 단계별 상태",
      "note": "이해되지 않는 관계에 맞는 표현을 고른다",
      "items": [
        [
          "D2로 정적 다이어그램 그리기",
          "/starlight/d2/"
        ],
        [
          "LearningFlow",
          "/starlight/learning-flow/"
        ]
      ]
    },
    {
      "label": "검토와 공유",
      "href": "/starlight/pipeline/",
      "title": "다시 찾고 함께 읽기",
      "tone": "warn",
      "desc": "결과 검토 · 검색과 갱신 · 배포와 링크 공유",
      "note": "설명을 판단하고 공유할 결과로 발전시킨다",
      "items": [
        [
          "웹으로 공유하기",
          "/starlight/publishing/"
        ],
        [
          "GitHub Pages 배포",
          "/starlight/github-pages/"
        ],
        [
          "Vercel 배포",
          "/starlight/vercel/"
        ],
        [
          "Cloudflare Pages 배포",
          "/starlight/cloudflare-pages/"
        ]
      ]
    }
  ]
};
