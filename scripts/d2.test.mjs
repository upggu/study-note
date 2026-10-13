import assert from 'node:assert/strict';
import { test } from 'node:test';
import { d2Arguments, imgHtml, inlineSvgHtml, parseD2Attributes, softenEdgeLabels, svgSize } from '../src/integrations/d2.mjs';

test('fence attributes: defaults, overrides, quoting, truthy flags, target root', () => {
	assert.deepEqual(parseD2Attributes(undefined), {
		layout: 'elk', pad: 40, sketch: true, theme: '0', darkTheme: '200', title: 'Diagram', inline: false, appendix: false,
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
		'--layout=elk', '--theme=0', '--sketch=true', '--pad=40', '--dark-theme=200', '-', '/tmp/out.svg',
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

test('edge labels: the mask is removed and a translucent theme-colored box is placed behind each label', () => {
	const svg = [
		'<svg viewBox="0 0 400 100"><svg class="d2-1 d2-svg"><mask id="d2-1" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="100">',
		'<rect x="0" y="0" width="400" height="100" fill="white"></rect><rect x="150" y="40" width="100" height="21" fill="black"></rect></mask>',
		'<text x="50" y="30" class="text fill-N1">shape label</text>',
		'<g><path d="M 0 50 L 400 50" class="connection" mask="url(#d2-1)" /><text x="200" y="55" class="text-italic fill-N2">edge label</text></g>',
		'</svg></svg>',
	].join('');
	const out = softenEdgeLabels(svg);
	assert.ok(!out.includes('mask="url('));
	assert.ok(out.includes('<rect x="150" y="40" width="100" height="21" rx="3" class="fill-N7" fill-opacity="0.6" /><text x="200" y="55"'));
	assert.ok(out.includes('<text x="50" y="30" class="text fill-N1">'));
	assert.equal(out.match(/fill-opacity/g).length, 1);
	assert.equal(softenEdgeLabels('<svg><text x="1" y="2">no mask</text></svg>'), '<svg><text x="1" y="2">no mask</text></svg>');
});
