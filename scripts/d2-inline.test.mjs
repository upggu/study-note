import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rehypeD2Inline } from '../src/integrations/d2-inline.mjs';

const svg = (properties, children = []) => ({ type: 'element', tagName: 'svg', properties, children });
const style = (css) => ({ type: 'element', tagName: 'style', properties: {}, children: [{ type: 'text', value: css }] });

test('inline D2 stylesheets get an empty comment so the MDX pipeline does not collapse them', () => {
	const sheet = style('.fill-N7{fill:#fff}');
	const diagram = svg({ dataD2Inline: '', width: '580' }, [svg({ className: ['d2-svg'] }, [sheet])]);
	rehypeD2Inline()({ type: 'root', children: [diagram] });
	assert.deepEqual(sheet.children.map((child) => child.type), ['comment', 'text']);
	assert.equal(sheet.children[0].value, '');
	assert.equal(sheet.children[1].value, '.fill-N7{fill:#fff}');
});

test('stylesheets outside inline D2 and already-protected sheets are untouched', () => {
	const plain = style('p{}');
	const icon = svg({ viewBox: '0 0 24 24' }, [style('.a{}')]);
	const protectedSheet = style('.b{}'); protectedSheet.children.unshift({ type: 'comment', value: 'x' });
	const diagram = svg({ dataD2Inline: '' }, [protectedSheet]);
	rehypeD2Inline()({ type: 'root', children: [plain, icon, diagram] });
	assert.equal(plain.children.length, 1);
	assert.equal(icon.children[0].children.length, 1);
	assert.deepEqual(protectedSheet.children.map((child) => child.value), ['x', '.b{}']);
});

test('inline dark styles follow the site toggle instead of the OS preference', () => {
	const sheet = style('.d2-1 .fill-N7{fill:#fff}@media screen and (prefers-color-scheme:dark){.d2-1 .fill-N7{fill:#222}}');
	rehypeD2Inline()({ type: 'root', children: [svg({ dataD2Inline: '' }, [sheet])] });
	assert.ok(sheet.children[1].value.includes(':root[data-theme="dark"]{.d2-1'));
	assert.ok(!sheet.children[1].value.includes('prefers-color-scheme'));
});

test('D2 link glyphs navigate to the same URL as the node; descriptions are keyboard accessible', () => {
	const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
	const txt = (value) => ({ type: 'text', value });
	const node = el('g', { className: ['cGljdHVyZQ==', 'mute'] }, [
		el('text', {}, [txt('이미지 안내')]), el('title', {}, [txt('제품 화면 설명')]),
	]);
	const link = el('a', { href: '/notes/starlight/components/' }, [node]);
	const icon = el('g', { className: ['appendix-icon'] }, [svg({}, [
		el('defs', {}, [el('clipPath', { id: 'clip0_3440_35088111-d2-3896716829-OBUWG5DVOJSQ' })]),
	])]);
	const info = el('g', { className: ['appendix-icon'] }, [el('title', {}, [txt('제품 화면 설명')])]);
	const diagram = svg({ dataD2Inline: '' }, [link, icon, info]);
	rehypeD2Inline()({ type: 'root', children: [diagram] });
	assert.equal(diagram.children[1].tagName, 'a');
	assert.equal(diagram.children[1].properties.href, '/notes/starlight/components/');
	assert.equal(link.properties.dataD2Description, '제품 화면 설명');
	assert.equal(info.properties.tabIndex, 0);
	assert.equal(info.properties.role, 'button');
	assert.equal(info.properties.dataD2Description, '제품 화면 설명');
});
