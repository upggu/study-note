import { getCollection } from 'astro:content';
import { getNewestCommitDate } from 'virtual:starlight/git-info';

// 랜딩과 덱 전환 메뉴가 같은 기준을 쓴다: 덱 안 문서의 가장 최근 Git 커밋 시각.
// 배포 체크아웃 시각인 mtime이나 내용 검토일인 reviewedAt은 사용하지 않는다.
async function collectDeckUpdatedAt() {
	const updatedAt = new Map<string, Date>();
	for (const entry of await getCollection('docs')) {
		if (!entry.filePath) continue;
		const slug = entry.id.split('/')[0];
		try {
			const date = getNewestCommitDate(entry.filePath);
			if (date.getTime() > (updatedAt.get(slug)?.getTime() ?? 0)) {
				updatedAt.set(slug, date);
			}
		} catch {
			// 아직 Git 이력이 없는 새 문서는 날짜 계산에서 제외한다.
		}
	}
	return updatedAt;
}

let buildDates: ReturnType<typeof collectDeckUpdatedAt> | undefined;

export function getDeckUpdatedAt() {
	// 빌드는 모든 페이지에서 재사용하고, dev는 새 커밋을 다음 요청에 반영한다.
	if (import.meta.env.DEV) return collectDeckUpdatedAt();
	return (buildDates ??= collectDeckUpdatedAt());
}
