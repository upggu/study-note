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
