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
			keepStylesheets(node);
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
				if (child.children.every((grandchild) => grandchild.type === 'text')) {
					child.children.unshift({ type: 'comment', value: '' });
				}
			} else {
				stack.push(child);
			}
		}
	}
}
