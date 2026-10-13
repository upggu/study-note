// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightThemeDracula from 'starlight-theme-dracula';
import starlightImageZoom from 'starlight-image-zoom';
import d2 from './src/integrations/d2.mjs';
import { topics } from './src/data/decks.mjs';
import { site, base } from './src/config/site.mjs';
import sitePaths from './src/integrations/site-paths.mjs';
import { rehypeD2Inline } from './src/integrations/d2-inline.mjs';

export default defineConfig({
	// 대표 주소와 게시 경로는 src/config/site.mjs가 소유한다. canonical 링크와 sitemap의 기준이므로
	// 배포 전에 그 파일의 site 기본값을 실제 대표 주소로 바꾼다.
	site,
	base,
	// unified 프로세서를 명시한다. site-paths integration이 unified의 remarkPlugins 배열에 직접 끼어들기
	// 때문이며, Astro 7 기본값인 Sätteri로 가려면 그 integration을 mdastPlugins 방식으로 먼저 이식해야 한다.
	// rehypeD2Inline은 inline D2(```d2 inline=true)의 <style>이 MDX에서 접히지 않게 지킨다 — 파일 머리 주석 참고.
	markdown: { processor: unified({ rehypePlugins: [rehypeD2Inline] }) },
	integrations: [
		sitePaths(),
		// 자체 D2 integration(src/integrations/d2.mjs). site-paths 뒤, starlight 앞에 둔다 —
		// site-paths가 먼저 펜스 안 link 값에 base를 붙이고, 그다음 여기서 펜스를 SVG로 바꾼다.
		d2({ layout: 'elk', pad: 40, sketch: true, theme: '7', darkTheme: '200', background: { light: '#fffbeb', dark: '#282a36' } }),
		starlight({
			title: 'Study Note',
			routeMiddleware: './src/route-middleware.ts',
			defaultLocale: 'root',
			locales: {
				root: { label: '한국어', lang: 'ko' },
			},
			customCss: [
				// 한글 폰트 — dynamic subset이라 페이지에 쓰인 글자의 조각만 내려받는다.
				'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css',
				'./src/styles/custom.css',
			],
			components: {
				// 검색 결과에 덱 이름을 표시하기 위한 Pagefind meta 주입 — 파일 안 주석 참고.
				MarkdownContent: './src/components/layout/MarkdownContent.astro',
				// 덱 목록을 드롭다운으로 접는다.
				Sidebar: './src/components/layout/Sidebar.astro',
				// 헤더에 "[사이드바 토글] Study Note / <현재 덱>".
				SiteTitle: './src/components/layout/SiteTitle.astro',
				// 헤더 오른쪽 테마 선택을 해/달 아이콘 토글로 바꾼다 — 파일 머리 주석 참고.
				ThemeSelect: './src/components/layout/ThemeToggle.astro',
			},
			plugins: [
				starlightImageZoom(),
				// 사이트 테마 — Dracula(다크)·Alucard(라이트), accent는 기본 보라. 2026-10-14에 Rapide에서 교체.
				// D2 테마(라이트 7 Aubergine · 다크 200 Dark Mauve)도 이 톤에 맞춘 값이다.
				starlightThemeDracula(),
				starlightSidebarTopics(topics, {
					// 랜딩 페이지는 어느 topic에도 속하지 않는다.
					exclude: ['/'],
				}),
			],
		}),
	],
});
