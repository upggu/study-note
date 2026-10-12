import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
			schema: docsSchema({
				extend: z.object({
					// Thesis 규칙 도입 전 페이지의 ratchet. Thesis를 추가하면 제거한다.
					legacyThesis: z.literal(true).optional(),
					// 검색할 때 떠올릴 법한 옛 이름·약어·동의어.
					aliases: z.array(z.string()).optional(),
					// 개념·제품의 소개 연월. 월별 분류를 위해 검토일과 별도로 보관한다.
					introduced: z.object({
						month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
						event: z.string().trim().min(1),
						source: z.string().url(),
					}).optional(),
					// 단순 수정일이 아니라 내용의 현재성을 마지막으로 확인한 날짜.
					reviewedAt: z.coerce.date().optional(),
					// 생략을 stable로 간주하지 않는다. 날짜만 있으면 표시 단에서 stable로 해석한다.
					status: z.enum(['unreviewed', 'stable', 'review', 'stale']).optional(),
				}),
		}),
	}),
};
