import assert from 'node:assert/strict';
import { test } from 'node:test';
import { d2Arguments, imgHtml, inlineSvgHtml, parseD2Attributes, svgSize } from '../src/integrations/d2.mjs';

test('fence attributes: defaults, overrides, quoting, truthy flags, target root', () => {
	assert.deepEqual(parseD2Attributes(undefined), {
		layout: 'elk', pad: 40, sketch: false, theme: '0', darkTheme: '200', title: 'Diagram', inline: false, appendix: false,
	});
	const options = parseD2Attributes(`layout=tala pad=20 title="빌드 흐름 (요약)" inline darkTheme=false target=root appendix=true`);
	assert.equal(options.layout, 'tala');
	assert.equal(options.pad, 20);
	assert.equal(options.title, '빌드 흐름 (요약)');
	assert.equal(options.inline, true);
	assert.equal(options.darkTheme, false);
	assert.equal(options.target, '');
	assert.equal(options.appendix, true);
	assert.equal(parseD2Attributes(`title='따옴표 "안"' target=layers.x`).title, '따옴표 "안"');
	assert.throws(() => parseD2Attributes('titel="오타"'), /알 수 없는 속성 'titel'/);
});

test('CLI arguments mirror the fence options and end with stdin and the output path', () => {
	assert.deepEqual(d2Arguments(parseD2Attributes('pad=40'), '/tmp/out.svg'), [
		'--layout=elk', '--theme=0', '--sketch=false', '--pad=40', '--dark-theme=200', '-', '/tmp/out.svg',
	]);
	const args = d2Arguments(parseD2Attributes('darkTheme=false animateInterval=1200 target=steps.2 appendix=true'), 'o.svg');
	assert.ok(!args.some((argument) => argument.startsWith('--dark-theme')));
	assert.ok(args.includes('--animate-interval=1200'));
	assert.ok(args.includes('--target=steps.2'));
	assert.ok(args.includes('--force-appendix'));
});

const sample = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" d2Version="v0.9.0" preserveAspectRatio="xMinYMin meet" viewBox="0 0 580 418"><svg class="d2-1 d2-svg" width="580" height="418" viewBox="-25 -46 580 418"><style type="text/css"><![CDATA[.a{}]]></style><rect/></svg></svg>`;

test('img output carries alt, size and the base-prefixed path', () => {
	assert.deepEqual(svgSize(sample), { width: 580, height: 418 });
	assert.equal(
		imgHtml({ src: '/notes/d2/docs/a/b-0.svg', title: 'A "quoted" <title>', ...svgSize(sample) }),
		'<img alt="A &quot;quoted&quot; &lt;title&gt;" decoding="async" loading="lazy" src="/notes/d2/docs/a/b-0.svg" width="580" height="418" />',
	);
});

test('inline output drops the XML prolog, sizes and marks the root, and adds the title', () => {
	const html = inlineSvgHtml(sample, { title: '고르는 <기준>' });
	assert.ok(html.startsWith('<svg xmlns="http://www.w3.org/2000/svg" d2Version="v0.9.0" preserveAspectRatio="xMinYMin meet" viewBox="0 0 580 418" width="580" height="418" data-d2-inline=""><title>고르는 &lt;기준&gt;</title><svg class="d2-1 d2-svg"'));
	assert.ok(html.endsWith('</svg></svg>'));
	assert.ok(!html.includes('<?xml'));
});
