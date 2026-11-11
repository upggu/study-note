import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rehypeExternalLinks, isExternal } from '../src/integrations/external-links.mjs';

const anchor = (href) => ({ type: 'element', tagName: 'a', properties: { href }, children: [] });
const run = (nodes) => {
	const tree = { type: 'root', children: nodes };
	rehypeExternalLinks({ site: 'https://study.example.com' })(tree);
	return tree.children;
};

test('http(s) links to other hosts open in a new tab with a safe rel', () => {
	const [a] = run([anchor('https://d2lang.com/tour/intro/')]);
	assert.equal(a.properties.target, '_blank');
	assert.equal(a.properties.rel, 'noopener noreferrer');
});

test('internal paths, anchors, and the site\'s own absolute URL stay as they are', () => {
	const links = run([anchor('/starlight/intro/'), anchor('#section'), anchor('https://study.example.com/starlight/')]);
	for (const a of links) {
		assert.equal(a.properties.target, undefined);
		assert.equal(a.properties.rel, undefined);
	}
});

test('non-http schemes and malformed values are ignored', () => {
	assert.equal(isExternal('mailto:a@example.com', 'x'), false);
	assert.equal(isExternal(undefined, 'x'), false);
	assert.equal(isExternal('https://[bad', 'x'), false);
});
