import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import { withBase } from './utils/site-path.mjs';

// topics 0.8 runs first (order: pre). In the root locale it leaves topic links unprefixed.
// Apply base once here so the dropdown and header receive the same published URLs.
export const onRequest = defineRouteMiddleware((context) => {
	const { entry, pagination } = context.locals.starlightRoute;
	// These frontmatter URLs are passed through by Starlight's components.
	for (const action of entry.data.hero?.actions ?? []) {
		action.link = withBase(action.link, import.meta.env.BASE_URL);
	}
	for (const direction of ['prev', 'next'] as const) {
		const override = entry.data[direction];
		const link = pagination[direction];
		if (link && typeof override === 'object' && override.link) {
			link.href = withBase(override.link, import.meta.env.BASE_URL);
		}
	}
	const topics = context.locals.starlightSidebarTopics;
	if (!context.currentLocale) {
		topics.topics = topics.topics.map((topic) => ({
			...topic, link: withBase(topic.link, import.meta.env.BASE_URL),
		}));
	}
	if (!topics.isPageWithTopic) return;

	// topics compares a published href to a content id at deck boundaries, which fails with base.
	// Its selected sidebar already has Starlight's isCurrent flags and only this deck's entries.
	const { sidebar } = context.locals.starlightRoute;
	function flatten(entries: StarlightRouteData['sidebar']): StarlightRouteData['sidebar'] {
		return entries.flatMap((entry) => entry.type === 'group' ? flatten(entry.entries) : [entry]);
	}
	const links = flatten(sidebar);
	const first = links[0];
	const last = links.at(-1);
	if (first?.type === 'link' && first.isCurrent) pagination.prev = undefined;
	if (last?.type === 'link' && last.isCurrent) pagination.next = undefined;
});
