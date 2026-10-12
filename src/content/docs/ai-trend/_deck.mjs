// 덱 단위 metadata와 구조. 페이지 소속·순서는 sidebar 배열에 있다.
export default {
	"navOrder": 2300,
	"catalogOrder": 2300,
	"label": "AI 트렌드",
	"title": "AI 트렌드 노트",
	"icon": "star",
	"aliases": [
		"AI Trend",
		"새 모델",
		"Jev",
		"TypeSafe AI",
		"System One model",
		"Google AX",
		"agentexecutor",
		"Meta Muse",
		"메타 뮤즈"
	],
	"description": "AI가 답변을 넘어 실제 일을 하려면 무엇이 필요한가 — 판단 모델·개인 에이전트·실행 플랫폼의 문제의식과 큰 그림.",
	"category": "ai",
	"tags": [],
	"termIntro": "required",
	"sidebar": [
		{
			"label": "모델",
			"pages": [
				"jev"
			]
		},
		{
			"label": "에이전트",
			"pages": [
				"meta-muse"
			]
		},
		{
			"label": "플랫폼",
			"pages": [
				"google-ax"
			]
		}
	],
	"map": [
		{
			"label": "모델",
			"href": "/ai-trend/jev/",
			"title": "Jev — 문장을 만들지 않는 결정 모델",
			"tone": "zone",
			"desc": "고객 문의로 이해하는 선택·점수·확률 · 판단 뒤의 행동은 코드가 결정",
			"note": "작은 판단마다 긴 답변을 받아야 할까?"
		},
		{
			"label": "에이전트",
			"href": "/ai-trend/meta-muse/",
			"title": "Meta Muse — 일상 업무를 이어서 수행하는 개인 에이전트",
			"tone": "ok",
			"desc": "여행 준비로 이해하는 기억·후속 작업·실행 권한 · 모델과 제품의 차이",
			"note": "추천을 받은 뒤의 실행과 변경 사항은 누가 챙길까?"
		},
		{
			"label": "플랫폼",
			"href": "/ai-trend/google-ax/",
			"title": "Google AX — 에이전트를 위한 실행 오케스트레이터",
			"tone": "key",
			"desc": "많은 에이전트의 작업 환경 준비 · Task·Workspace·Model · 파일 복원과 업무 복구의 차이",
			"note": "작업이 많아지고 대기가 길어지면 실행 환경을 어떻게 관리할까?"
		}
	]
};
