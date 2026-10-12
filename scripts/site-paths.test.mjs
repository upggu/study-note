import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { normalizeBase, stripBase, withBase } from '../src/utils/site-path.mjs';
import { remarkSitePaths } from '../src/integrations/site-paths.mjs';
import { checkSite } from './check-links.mjs';

for (const base of ['/', '/study-notes/', '/team/notes/']) {
	test(`authored and published URLs: ${base}`, () => {
		assert.equal(withBase('/guide/?q=a#한글', base), `${base}guide/?q=a#한글`);
		assert.equal(withBase('/', base), base);
		assert.equal(stripBase(`${base}guide/`, base), '/guide/');
		for (const url of ['#한글', '?q=test', '../guide/', 'https://example.com/a', '//cdn.test/a', 'mailto:a@b.test', 'data:image/svg+xml,abc']) {
			assert.equal(withBase(url, base), url);
		}
		if (base !== '/') assert.equal(stripBase('/guide/', base), null);
	});
}

test('base and content folder may share a name; never guess that an authored URL is prefixed', () => {
	assert.equal(withBase('/starlight/intro/', '/starlight'), '/starlight/starlight/intro/');
	assert.equal(stripBase('/notes-other/a/', '/notes'), null);
	assert.equal(normalizeBase('/team/notes'), '/team/notes/');
	for (const base of ['notes', '//host/', '/a/../b', '/a?b', '/a#b', '/a\\b', '/a//b']) {
		assert.throws(() => normalizeBase(base));
	}
});

test('remark rewrites authored links while leaving examples, expressions and component-owned props alone', () => {
	const jsx = (name, attr, value) => ({ type: 'mdxJsxFlowElement', name, attributes: [{ name: attr, value }] });
	const expression = { type: 'mdxJsxAttributeValueExpression', value: 'url' };
	const tree = { children: [
		{ type: 'link', url: '/guide/#절' }, { type: 'image', url: '/images/a.png' },
		{ type: 'definition', url: '/guide/' }, jsx('LinkCard', 'href', '/guide/'),
		jsx('a', 'href', '/guide/'), jsx('img', 'src', '/images/a.png'),
		jsx('SourceFigure', 'src', '/images/a.png'), jsx('LinkButton', 'href', expression),
		{ type: 'code', value: '<a href="/guide/">example</a>' },
		{ type: 'inlineCode', value: '/guide/' },
		jsx('img', 'srcSet', '/images/a.png 1x, /images/b.png 2x'),
	] };
	remarkSitePaths({ base: '/notes/' })(tree);
	assert.equal(tree.children[0].url, '/notes/guide/#절');
	assert.equal(tree.children[1].url, '/notes/images/a.png');
	assert.equal(tree.children[2].url, '/notes/guide/');
	for (const index of [3, 4]) assert.equal(tree.children[index].attributes[0].value, '/notes/guide/');
	assert.equal(tree.children[5].attributes[0].value, '/notes/images/a.png');
	assert.equal(tree.children[6].attributes[0].value, '/images/a.png');
	assert.equal(tree.children[7].attributes[0].value, expression);
	assert.equal(tree.children[8].value, '<a href="/guide/">example</a>');
	assert.equal(tree.children[9].value, '/guide/');
	assert.equal(tree.children[10].attributes[0].value, '/notes/images/a.png 1x, /notes/images/b.png 2x');
});

test('artifact checker resolves nested base, assets, srcset, CSS, canonical and encoded anchors', (t) => {
	const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'starlight-base-'));
	t.after(() => fs.rmSync(outDir, { recursive: true, force: true }));
	const write = (name, contents) => {
		fs.mkdirSync(path.dirname(path.join(outDir, name)), { recursive: true });
		fs.writeFileSync(path.join(outDir, name), contents);
	};
	const base = '/team/notes/';
	const site = 'https://pages.example.test';
	write('index.html', `<a href="${base}guide/?q=a&amp;b=c#%ED%95%9C%EA%B8%80">guide</a>
		<link rel="canonical" href="${site}${base}"><link rel="stylesheet" href="${base}assets/site.css">
		<img src="${base}images/a.png" srcset="${base}images/a.png 1x, ${base}images/b.png 2x">
		<script src="${base}assets/app.js"></script>
		<pre>&lt;a href="/example-only/"&gt;</pre>`);
	write('guide/index.html', '<h2 id="한글">title</h2><a href="../">home</a>');
	write('assets/site.css', 'body { background: url(../images/a.png) }');
	write('assets/app.js', '');
	write('images/a.png', ''); write('images/b.png', '');
	write('sitemap-0.xml', `<urlset><url><loc>${site}${base}guide/</loc></url></urlset>`);
	assert.deepEqual(checkSite({ outDir, base, site }).issues, []);
	write('guide/index.html', `<a href="/guide/">escaped base</a><a href="${base}#missing">anchor</a>
		<img src="${base}missing.png"><script src="/assets/app.js"></script>`);
	const issues = checkSite({ outDir, base, site }).issues.join('\n');
	assert.match(issues, /배포 경로/);
	assert.match(issues, /missing.png/);
	assert.match(issues, /anchor #missing 없음/);
	assert.match(issues, /app.js/);
	assert.match(issues, /anchor #한글 없음/);
	write('guide/index.html', `<link rel="canonical" href="https://wrong.example/guide/">
		<img srcset="/images/a.png 1x, ${base}missing-srcset.png 2x">`);
	write('assets/site.css', 'body { background: url(/images/a.png) }');
	const assetIssues = checkSite({ outDir, base, site }).issues.join('\n');
	assert.match(assetIssues, /canonical 불일치/);
	assert.match(assetIssues, /missing-srcset.png/);
	assert.match(assetIssues, /assets\/site.css.*배포 경로/);
});
