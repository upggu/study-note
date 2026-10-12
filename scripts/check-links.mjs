import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'parse5';
import parseSrcset from 'parse-srcset';
import { normalizeBase, stripBase, withBase } from '../src/utils/site-path.mjs';

export function checkSite({ outDir, base = '/', site }) {
	const distRoot = path.resolve(outDir);
	base = normalizeBase(base);
	const origin = new URL(site || 'https://local.invalid').origin;
	const issues = new Set();
	let checkedLinks = 0;
	function walk(directory) {
		return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
			const file = path.join(directory, entry.name);
			return entry.isDirectory() ? walk(file) : [file];
		});
	}
	function routeFor(file) {
		const relative = path.relative(distRoot, file).split(path.sep).join('/');
		return withBase(`/${relative.replace(/(^|\/)index\.html$/u, '$1')}`, base);
	}
	function visit(node, callback) {
		callback(node);
		for (const child of node.childNodes ?? []) visit(child, callback);
		if (node.content) visit(node.content, callback);
	}
	const files = walk(distRoot);
	const pages = new Map();
	for (const file of files.filter((file) => file.endsWith('.html'))) {
		const document = parse(fs.readFileSync(file, 'utf8'));
		const ids = new Set();
		visit(document, (node) => {
			const id = node.attrs?.find((attr) => attr.name === 'id');
			if (id) ids.add(id.value);
		});
		pages.set(routeFor(file), { document, ids });
	}
	function checkReference(href, from, checkAnchor = false) {
		let url;
		try { url = new URL(href, `${origin}${from}`); }
		catch { issues.add(`${from} -> ${href} (올바르지 않은 URL)`); return; }
		if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) return;
		checkedLinks++;
		let pathname;
		try { pathname = decodeURI(url.pathname); }
		catch { issues.add(`${from} -> ${href} (올바르지 않은 URL encoding)`); return; }
		const localPath = stripBase(pathname, base);
		if (localPath === null) {
			issues.add(`${from} -> ${href} (배포 경로 ${base} 밖의 URL)`);
			return;
		}
		if (!pathname.endsWith('/') && !path.extname(pathname)) pathname += '/';
		const target = pages.get(pathname);
		if (!target) {
			const asset = path.resolve(distRoot, '.' + localPath);
			if (!asset.startsWith(distRoot + path.sep) && asset !== distRoot) {
				issues.add(`${from} -> ${href} (출력 폴더 밖의 경로)`);
			} else if (!fs.existsSync(asset) || !fs.statSync(asset).isFile()) {
				issues.add(`${from} -> ${href} (페이지나 파일 없음)`);
			}
			return;
		}
		if (checkAnchor && url.hash.length > 1) {
			let id;
			try { id = decodeURIComponent(url.hash.slice(1)); }
			catch { issues.add(`${from} -> ${href} (올바르지 않은 fragment encoding)`); return; }
			if (!target.ids.has(id)) issues.add(`${from} -> ${href} (anchor #${id} 없음)`);
		}
	}
	for (const [route, { document }] of pages) {
		visit(document, (node) => {
			if (!node.tagName) return;
			const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
			if (node.tagName === 'a' && attrs.href !== undefined) checkReference(attrs.href, route, true);
			if (['img', 'script', 'source', 'video', 'audio', 'iframe', 'input'].includes(node.tagName) && attrs.src) {
				checkReference(attrs.src, route);
			}
			if (attrs.poster) checkReference(attrs.poster, route);
			if (attrs.srcset) for (const { url } of parseSrcset(attrs.srcset)) checkReference(url, route);
			if (node.tagName === 'link' && attrs.href) {
				// Astro emits 404.html, while Starlight gives it the virtual canonical /404/.
				const errorCanonical = route === withBase('/404.html', base) && attrs.rel === 'canonical';
				if (!errorCanonical) checkReference(attrs.href, route);
				if (attrs.rel === 'canonical' && site) {
					const expected = new URL(errorCanonical ? withBase('/404/', base) : route, site).href;
					if (attrs.href.replace(/\/$/u, '') !== expected.replace(/\/$/u, '')) {
						issues.add(`${route} (canonical 불일치: ${attrs.href}, 예상 ${expected})`);
					}
				}
			}
		});
	}
	// Generated stylesheets also reference fonts and images; resolve relative to the CSS URL.
	for (const file of files.filter((file) => file.endsWith('.css'))) {
		const css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//gu, '');
		for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gu)) {
			const href = match[1] ?? match[2] ?? match[3];
			if (!href.startsWith('#')) checkReference(href, routeFor(file));
		}
	}
	for (const file of files.filter((file) => /sitemap[^/]*\.xml$/u.test(file))) {
		const xml = fs.readFileSync(file, 'utf8');
		for (const [, href] of xml.matchAll(/<loc>([^<]+)<\/loc>/gu)) {
			checkReference(href.replaceAll('&amp;', '&'), routeFor(file));
			if (site && new URL(href).origin !== origin) issues.add(`sitemap 대표 주소 불일치: ${href}`);
		}
	}
	return { issues: [...issues], pages: pages.size, checkedLinks };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	try {
		// Actual resolved Astro configuration, including CLI --base/--site overrides.
		const build = JSON.parse(fs.readFileSync('.astro/site-build.json', 'utf8'));
		const result = checkSite(build);
		if (result.issues.length) {
			console.error(`내부 링크·자산 검사 실패 (${result.issues.length}건)\n` + result.issues.map((issue) => `- ${issue}`).join('\n'));
			process.exitCode = 1;
		} else {
			console.log(`내부 링크·자산 검사 통과: ${result.pages}개 HTML, ${result.checkedLinks}개 참조, base=${build.base}`);
		}
	} catch (error) {
		console.error(`빌드 산출물을 검사할 수 없습니다. npm run build 뒤에 실행하세요.\n${error.message}`);
		process.exitCode = 1;
	}
}
