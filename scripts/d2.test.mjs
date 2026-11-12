import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { prepareD2 } from './prepare-d2.mjs';
import { d2Arguments, d2Source, d2WorkingDirectory, figureHtml, imgHtml, inlineSvgHtml, matchPageBackground, parseD2Attributes, remarkD2, renderD2, svgSize } from '../src/integrations/d2.mjs';

test('deck-local imports render independently in build and measurement, including nested sources and shared icons', async () => {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'd2 decks '));
	try {
		const binary = path.join(await prepareD2(), 'd2');
		const icons = path.join(root, 'src/d2/icons');
		await fs.mkdir(icons, { recursive: true });
		await fs.writeFile(path.join(icons, 'test.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>');
		for (const [deck, label, fontSize] of [['first', 'Alpha', 0], ['second', 'Beta', 13]]) {
			const directory = path.join(root, 'src/content/docs', deck);
			await fs.mkdir(path.join(directory, '_d2'), { recursive: true });
			await fs.writeFile(path.join(directory, '_d2/diagram.d2'), '...@nested\n');
			await fs.writeFile(path.join(directory, '_d2/nested.d2'), `a: ${label}\na -> b\n`);
			const filePath = path.join(directory, 'page.mdx');
			const source = '...@_d2/diagram\na.icon: icons/test.svg';
			const meta = `sketch=false fontSize=${fontSize}`;
			const tree = { type: 'root', children: [{ type: 'code', lang: 'd2', meta, value: source }] };
			await remarkD2({ binary, base: '/', publicDir: path.join(root, 'public'), root })(tree, { history: [filePath] });
			assert.equal(tree.children[0].type, 'html');
			const built = await fs.readFile(path.join(root, 'public/d2/docs', deck, 'page-0.svg'), 'utf8');
			assert.ok(built.includes(label));
			// d2-measure uses these same source/options/cwd helpers.
			const measured = await renderD2({
				binary, source: d2Source(source, parseD2Attributes('fontSize=0'), { root, filePath }),
				options: parseD2Attributes(meta), outputPath: path.join(root, 'measured.svg'), cwd: d2WorkingDirectory(root),
			});
			assert.deepEqual(svgSize(measured), svgSize(built));
		}
		const missing = { type: 'root', children: [{ type: 'code', lang: 'd2', value: '...@_d2/missing' }] };
		await assert.rejects(
			remarkD2({ binary, base: '/', publicDir: path.join(root, 'public'), root })(missing, { history: [path.join(root, 'src/content/docs/first/missing.mdx')] }),
			/\[D2 변환 실패\].*missing\.mdx/,
		);
	} finally {
		await fs.rm(root, { recursive: true, force: true });
	}
});

test('fence attributes: defaults, overrides, quoting, truthy flags, target root', () => {
	assert.deepEqual(parseD2Attributes(undefined), {
		layout: 'elk', pad: 24, sketch: true, theme: '7', darkTheme: '200', fontSize: 13, title: 'Diagram', inline: false, appendix: false,
	});
	const options = parseD2Attributes(`layout=tala pad=20 fontSize=16 title="빌드 흐름 (요약)" inline darkTheme=false target=root appendix=true`);
	assert.equal(options.layout, 'tala');
	assert.equal(options.pad, 20);
	assert.equal(options.fontSize, 16);
	assert.equal(options.title, '빌드 흐름 (요약)');
	assert.equal(options.inline, true);
	assert.equal(options.darkTheme, false);
	assert.equal(options.target, '');
	assert.equal(options.appendix, true);
	assert.equal(parseD2Attributes(`title='따옴표 "안"' target=layers.x`).title, '따옴표 "안"');
	assert.throws(() => parseD2Attributes('titel="오타"'), /알 수 없는 속성 'titel'/);
});

test('CLI arguments mirror the fence options, add ELK spacing only for elk, and end with stdin and the output path', () => {
	assert.deepEqual(d2Arguments(parseD2Attributes('pad=40'), '/tmp/out.svg'), [
		'--layout=elk', '--theme=7', '--sketch=true', '--pad=40',
		'--elk-nodeNodeBetweenLayers=40', '--elk-padding=[top=30,left=30,bottom=30,right=30]', '--elk-edgeNodeBetweenLayers=25',
		'--dark-theme=200', '-', '/tmp/out.svg',
	]);
	assert.ok(!d2Arguments(parseD2Attributes('layout=tala'), 'o.svg').some((argument) => argument.startsWith('--elk-')));
	const args = d2Arguments(parseD2Attributes('darkTheme=false animateInterval=1200 target=steps.2 appendix=true'), 'o.svg');
	assert.ok(!args.some((argument) => argument.startsWith('--dark-theme')));
	assert.ok(args.includes('--animate-interval=1200'));
	assert.ok(args.includes('--target=steps.2'));
	assert.ok(args.includes('--force-appendix'));
});

test('the global font size is prepended as globs so the author\'s explicit font-size still wins; 0 disables it', () => {
	assert.equal(d2Source('a -> b', parseD2Attributes('')), '**.style.font-size: 13\n(** -> **)[*].style.font-size: 12\na -> b');
	assert.equal(d2Source('a -> b', parseD2Attributes('fontSize=16')), '**.style.font-size: 16\n(** -> **)[*].style.font-size: 15\na -> b');
	assert.equal(d2Source('a -> b', parseD2Attributes('fontSize=0')), 'a -> b');
});

const sample = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" d2Version="v0.9.0" preserveAspectRatio="xMinYMin meet" viewBox="0 0 580 418"><svg class="d2-1 d2-svg" width="580" height="418" viewBox="-25 -46 580 418"><style type="text/css"><![CDATA[.a{}]]></style><rect/></svg></svg>`;

test('img output carries alt, size and the base-prefixed path', () => {
	assert.deepEqual(svgSize(sample), { width: 580, height: 418 });
	assert.equal(
		imgHtml({ src: '/notes/d2/docs/a/b-0.svg', title: 'A "quoted" <title>', ...svgSize(sample) }),
		'<img data-zoom-off alt="A &quot;quoted&quot; &lt;title&gt;" decoding="async" loading="lazy" src="/notes/d2/docs/a/b-0.svg" width="580" height="418" />',
	);
});

test('all D2 figures get the dedicated wrapper; static images stay lazy and opt out of image zoom', () => {
	const html = figureHtml(sample, { options: parseD2Attributes('title="정적 그림"'), src: '/team/notes/d2/docs/a/b-0.svg' });
	assert.ok(html.startsWith('<d2-figure role="figure" aria-label="정적 그림" style="--d2-w:580;--d2-h:418"><img data-zoom-off'));
	assert.ok(html.includes('loading="lazy"'));
	assert.ok(html.includes('src="/team/notes/d2/docs/a/b-0.svg"'));
	assert.ok(html.endsWith('</d2-figure>'));
	assert.ok(!html.includes('data-d2-inline'));
});

test('rendered links, tooltips and motion automatically use inline SVG, including imported D2 content', () => {
	const render = (contents, attributes = '') => figureHtml(sample.replace('<rect/>', contents), {
		options: parseD2Attributes(attributes), src: '/d2/example.svg',
	});
	for (const contents of ['<a href="/guide/"><rect/></a>', '<g><title>설명</title></g>', '<path class="connection animated-connection"/>']) {
		const html = render(contents);
		assert.ok(html.includes('data-d2-inline'), contents);
		assert.ok(!html.includes('<img'), contents);
	}
	assert.ok(render('<path class="connection animated-connection"/>').includes(' data-motion>'));
	assert.ok(!render('<a href="/guide/"><rect/></a>').includes(' data-motion>'));
	assert.ok(render('<g><title>부록</title></g>', 'appendix=true').includes('<img data-zoom-off'));
	assert.ok(render('<rect/>', 'inline=true').includes('data-d2-inline'));
});

test('inline output drops the XML prolog, sizes and marks the root, and adds the title', () => {
	const html = inlineSvgHtml(sample, { title: '고르는 <기준>' });
	assert.ok(html.startsWith('<svg xmlns="http://www.w3.org/2000/svg" d2Version="v0.9.0" preserveAspectRatio="xMinYMin meet" viewBox="0 0 580 418" width="580" height="418" data-d2-inline=""><title>고르는 &lt;기준&gt;</title><svg class="d2-1 d2-svg"'));
	assert.ok(html.endsWith('</svg></svg>'));
	assert.ok(!html.includes('<?xml'));
});

test('diagram background follows the page: first fill-N7 rule is light, the one in the dark media block is dark', () => {
	const svg = '<style>.d2-1 .fill-N7{fill:#FFFFFF;} .d2-1 .fill-N6{fill:#EEE;} @media screen and (prefers-color-scheme:dark){.d2-1 .fill-N7{fill:#1E1E2E;}}</style><rect class="fill-N7"/>';
	assert.equal(
		matchPageBackground(svg, { light: '#fffbeb', dark: '#282a36' }),
		'<style>.d2-1 .fill-N7{fill:#fffbeb;} .d2-1 .fill-N6{fill:#EEE;} @media screen and (prefers-color-scheme:dark){.d2-1 .fill-N7{fill:#282a36;}}</style><rect class="fill-N7"/>',
	);
	assert.equal(matchPageBackground('.fill-N7{fill:#FFFFFF;}', { light: '#fffbeb', dark: '#282a36' }), '.fill-N7{fill:#fffbeb;}');
	assert.equal(matchPageBackground('<svg/>', { light: '#fffbeb', dark: '#282a36' }), '<svg/>');
});
