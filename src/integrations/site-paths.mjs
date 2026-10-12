import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import parseSrcset from 'parse-srcset';
import { withBase } from '../utils/site-path.mjs';

// Transform authored nodes before astro-d2 creates URLs with its own base.
// Custom components own their URL props; only native elements and Starlight link components
// are handled here. Code fences/inline code and JS expressions are not rewritten.
export function remarkSitePaths({ base }) {
	return (tree) => {
		function walk(node) {
			if (['link', 'image', 'definition'].includes(node.type)) node.url = withBase(node.url, base);
			if (['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type)) {
				const attributes = {
					a: ['href'], img: ['src', 'srcset', 'srcSet'], source: ['src', 'srcset', 'srcSet'],
					video: ['src', 'poster'], audio: ['src'], iframe: ['src'],
					LinkCard: ['href'], LinkButton: ['href'],
				}[node.name] ?? [];
				for (const attribute of node.attributes ?? []) {
					if (attributes.includes(attribute.name) && typeof attribute.value === 'string') {
						attribute.value = attribute.name.toLowerCase() === 'srcset'
							? parseSrcset(attribute.value).map(({ url, w, h, d }) => [
								withBase(url, base), w && `${w}w`, h && `${h}h`, d && `${d}x`,
							].filter(Boolean).join(' ')).join(', ')
							: withBase(attribute.value, base);
					}
				}
			}
			for (const child of node.children ?? []) walk(child);
		}
		walk(tree);
	};
}

export default function sitePaths() {
	let resolved;
	return {
		name: 'site-paths',
		hooks: {
			'astro:config:setup': ({ config }) => {
				config.markdown.processor.options.remarkPlugins.unshift([remarkSitePaths, { base: config.base }]);
			},
			'astro:config:done': ({ config }) => { resolved = config; },
			'astro:build:done': async ({ dir }) => {
				// Keep the exact build configuration outside the published output.
				await fs.mkdir('.astro', { recursive: true });
				await fs.writeFile('.astro/site-build.json', JSON.stringify({
					base: resolved.base, site: resolved.site, outDir: fileURLToPath(dir),
				}));
			},
		},
	};
}
