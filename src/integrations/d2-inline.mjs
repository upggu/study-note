import { visit } from 'unist-util-visit';

// inline D2(```d2 inline=true)의 <style>을 Astro MDX의 접힘에서 지킨다.
//
// Astro MDX 파이프라인은 <style> 본문을 `set:html` 속성으로 접고(rehype-collapse-script-style), 정적
// 최적화 단계가 그 속성을 글자 그대로 HTML에 직렬화한다. 그러면 D2 스타일시트가 빈 채로 나와 테마와
// 다크 모드 규칙이 사라진다(배경이 검게 보인다). 접힘은 텍스트가 아닌 자식이 하나라도 있으면 건너뛰므로,
// 빈 주석(`<!---->`, CSS 파서가 무시하는 CDO/CDC 쌍)을 각 스타일시트 앞에 넣는다.
// 문자열 단계(src/integrations/d2.mjs)에서는 할 수 없다 — <style> 안의 `<!---->`는 HTML 파서가 텍스트로 읽는다.
export function rehypeD2Inline() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'svg' || !('dataD2Inline' in node.properties)) return;
			node.properties.preserveAspectRatio = 'xMidYMid meet';
			keepStylesheets(node);
			enhanceInteractions(node);
		});
	};
}

function keepStylesheets(root) {
	const stack = [root];
	while (stack.length > 0) {
		const node = stack.pop();
		for (const child of node.children ?? []) {
			if (child.type !== 'element') continue;
			if (child.tagName === 'style') {
				// 외부 SVG의 media query는 <img>의 color-scheme을 따르지만 inline에서는 OS를 따른다.
				// CSS nesting으로 페이지의 명시적 테마에 묶는다(확대 dialog에서도 같은 SVG를 쓴다).
				for (const text of child.children) {
					if (text.type === 'text') text.value = text.value.replace(/@media\s+screen\s+and\s*\(prefers-color-scheme:\s*dark\)/g, ':root[data-theme="dark"]');
				}
				if (child.children.every((grandchild) => grandchild.type === 'text')) {
					child.children.unshift({ type: 'comment', value: '' });
				}
			} else {
				stack.push(child);
			}
		}
	}
}

// D2 0.9의 노드 class는 base64, appendix clip ID의 마지막 부분은 base32다.
// 링크 아이콘 자체에는 <a>가 없어서 동일 객체 ID의 링크로 감싼다. 좌표·선언 순서로 추측하지 않는다.
function base32(bytes) {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
	let bits = 0, value = 0, result = '';
	for (const byte of bytes) {
		value = (value << 8) | byte;
		bits += 8;
		while (bits >= 5) { result += alphabet[(value >>> (bits -= 5)) & 31]; }
	}
	if (bits) result += alphabet[(value << (5 - bits)) & 31];
	return result;
}

function enhanceInteractions(root) {
	const links = new Map();
	visit(root, 'element', (node) => {
		if (node.tagName !== 'a') return;
		const shape = node.children.find((child) => child.tagName === 'g' && child.properties?.className?.length);
		if (!shape) return;
		const id = base32(Buffer.from(shape.properties.className[0], 'base64'));
		const labels = [];
		visit(shape, 'text', (text) => labels.push(text.value));
		const label = labels.join(' ').trim();
		links.set(id, { properties: node.properties, label });
		node.properties.ariaLabel = label;
	});
	visit(root, 'element', (node, index, parent) => {
		if (node.tagName !== 'g') return;
		const title = node.children.find((child) => child.tagName === 'title');
		if (title) {
			const text = title.children.filter((child) => child.type === 'text').map((child) => child.value).join('');
			node.properties.dataD2Description = text;
			if (parent?.tagName !== 'a') {
				node.properties.tabIndex = 0;
				node.properties.role = 'button';
				node.properties.ariaLabel = `설명 보기: ${text}`;
			} else parent.properties.dataD2Description = text;
		}
		if (!node.properties.className?.includes('appendix-icon') || title || parent?.tagName === 'a') return;
		let id;
		visit(node, 'element', (child) => {
			if (child.tagName === 'clipPath') id = String(child.properties.id).match(/-d2-\d+-([A-Z2-7]+)$/)?.[1];
		});
		const link = links.get(id);
		if (!link || !parent || index === undefined) return;
		parent.children[index] = {
			type: 'element', tagName: 'a',
			properties: { ...link.properties, ariaLabel: `${link.label} 페이지로 이동` }, children: [node],
		};
	});
}
