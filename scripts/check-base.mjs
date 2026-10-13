import { spawnSync } from 'node:child_process';

// Build sequentially: the D2 integration regenerates public/d2 for each base.
// Keep dist/ for the normal site; these verification artifacts stay under .astro/.
for (const base of ['/study-notes/', '/team/notes/']) {
	console.log(`\n하위 경로 검증: ${base}`);
	const outDir = `.astro/base-check/${base.split('/').filter(Boolean).join('-')}`;
	const env = { ...process.env, SITE_BASE: base, SITE_URL: 'https://pages.example.test' };
	for (const args of [
		['node_modules/astro/bin/astro.mjs', 'build', '--outDir', outDir],
		['scripts/check-links.mjs'],
	]) {
		const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
		if (result.error) throw result.error;
		if (result.status !== 0) process.exit(result.status ?? 1);
	}
}
