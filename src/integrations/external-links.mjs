import { visit } from 'unist-util-visit';

// 본문의 외부 링크를 새 탭에서 열게 한다.
//
// 학습 페이지는 공식 문서·원문을 참조하면서 읽는 자리라, 외부 링크로 현재 페이지가 바뀌면 돌아오는 비용이 든다.
// 작성자는 일반 마크다운 링크만 쓰고 이 rehype 플러그인이 렌더된 <a>에 target·rel을 붙인다.
// 사이트 자신의 절대 주소(site.mjs의 site)와 base 없는 내부 경로는 그대로 둔다.
// Astro 컴포넌트(LinkCard 등)의 출력은 rehype를 거치지 않으므로 거기에는 작성자가 target을 직접 준다.
export function rehypeExternalLinks({ site } = {}) {
	const ownHost = site ? new URL(site).host : undefined;
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'a') return;
			const href = node.properties?.href;
			if (!isExternal(href, ownHost)) return;
			node.properties.target = '_blank';
			node.properties.rel = 'noopener noreferrer';
		});
	};
}

export function isExternal(href, ownHost) {
	if (typeof href !== 'string' || !/^https?:\/\//iu.test(href)) return false;
	try {
		return new URL(href).host !== ownHost;
	} catch {
		return false;
	}
}
