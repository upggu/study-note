/** 단계 끝의 완전한 snapshot. 누적 mutation이나 실제 네트워크 실행을 담지 않는다. */
export interface LearningFlow {
  title: string;
  terms?: { id: string; name: string; description: string }[];
  objects: { id: string; label: string; role: string }[];
  steps: {
    id: string;
    title: string;
    description: string;
    message: { from: string; to: string; kind: string; label: string; values?: string[] };
    storage: Record<string, string>;
    /** 객체 옆에 표시할 짧은 snapshot. 상세 설명은 storage에 유지한다. */
    storageSummary?: Record<string, string>;
  }[];
}

export function validateFlow(flow: LearningFlow) {
  const unique = (ids: string[]) => new Set(ids).size === ids.length && ids.every(id => /^[a-z][a-z0-9-]*$/.test(id));
  const ids = flow.objects.map(object => object.id);
  if (ids.length < 2 || ids.length > 4 || !unique(ids) || !flow.steps.length || !unique(flow.steps.map(step => step.id))) {
    throw new Error('LearningFlow: 2~4개 객체와 고유한 slug ID, 하나 이상의 단계가 필요합니다.');
  }
  if (flow.terms && (!unique(flow.terms.map(term => term.id)) || flow.terms.some(term => !term.name.trim() || !term.description.trim()))) {
    throw new Error('LearningFlow: 용어 ID와 이름·설명을 확인하세요.');
  }
  for (const step of flow.steps) {
    if (!ids.includes(step.message.from) || !ids.includes(step.message.to) ||
        Object.keys(step.storage).length !== ids.length || ids.some(id => !step.storage[id]?.trim()) ||
        (step.storageSummary && (Object.keys(step.storageSummary).length !== ids.length || ids.some(id => !step.storageSummary![id]?.trim())))) {
      throw new Error(`LearningFlow: ${step.id}의 경로와 모든 객체의 보관 상태를 확인하세요.`);
    }
  }
}
