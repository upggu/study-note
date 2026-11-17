import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
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
let devDates: { head: string | undefined; dates: ReturnType<typeof collectDeckUpdatedAt> } | undefined;

function getHead() {
	try {
		return execFileSync('git', ['rev-parse', 'HEAD'], {
			cwd: fileURLToPath(new URL('../../', import.meta.url)),
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
	} catch {
		// Git 이력이 없는 환경에서도 페이지를 렌더한다.
		return undefined;
	}
}

export function getDeckUpdatedAt() {
	// dev도 같은 HEAD에서는 재사용한다. Promise를 저장해 동시 요청도 계산을 공유한다.
	if (import.meta.env.DEV) {
		const head = getHead();
		if (!devDates || devDates.head !== head) {
			devDates = { head, dates: collectDeckUpdatedAt() };
		}
		return devDates.dates;
	}
	return (buildDates ??= collectDeckUpdatedAt());
}
