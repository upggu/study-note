import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { visit } from 'unist-util-visit';
import { prepareD2 } from '../../scripts/prepare-d2.mjs';

// ```d2 펜스를 빌드 때 native D2 CLI로 SVG로 바꾸는 자체 Astro integration.
//
// 2026-10-13에 astro-d2를 대체했다. 이 레포가 쓰는 기능은 펜스 속성 몇 개와 <img>/inline 출력뿐인데,
// astro-d2는 쓰지 않는 D2.js WebAssembly(@d2lang/d2, 92MB)를 정적으로 로드하고 satteri 버전 충돌을
// 일으켰으며 inline 모드의 속성 인식 버그가 있었다. 배경은 docs/starlight-changes.md.
//
// - 바이너리는 scripts/prepare-d2.mjs가 준비한 고정 버전을 절대 경로로 실행한다. PATH를 건드리지 않는다.
// - 산출물은 astro-d2와 같은 경로 규칙(public/d2/docs/<덱>/<파일>-<펜스 번호>.svg)을 유지한다.
//   docs/와 scripts/d2-measure.mjs가 이 이름을 전제한다.
// - 옵션 파싱·CLI 인자 조립은 scripts/d2-measure.mjs와 공유한다. 측정값이 빌드 산출물과 같아야 한다.
// - 펜스 안 `link: /…`의 base 처리는 앞서 실행되는 site-paths의 remark 플러그인이 맡는다.
// - 크기 기본값은 defaultD2Options(pad·fontSize)와 elkSpacing 둘이다. 글자 크기는 d2Source가 원본 앞에 glob으로 붙이고,
//   ELK 간격은 d2Arguments가 CLI 플래그로 넘긴다. 본문 표시는 크기 상한 없이 D2Figure가 미리보기로 줄인다.
// - d2는 src/d2/를 cwd로 실행한다. 로고는 src/d2/icons/에 두고 펜스에서 `icon: icons/<이름>.svg`로 쓴다.
// - 렌더된 SVG는 matchPageBackground로 후처리한다(D2 배경색을 사이트 테마의 페이지 배경에 맞춰 그림이 흰 상자로 뜨지 않게).
//   엣지 라벨은 D2 기본대로 뒤의 선을 가린다. 2026-10-13~11-10에 mask를 떼고 반투명 배경을 깔아 선이 비치게 했으나
//   취소선처럼 보여 되돌렸다(softenEdgeLabels 삭제). 다시 시도하지 않는다.

export const defaultD2Options = Object.freeze({
	layout: 'elk',
	// 2026-11-10: 그림이 본문보다 커 보여 pad 40→24, 글자 16→13으로 낮췄다. 배경은 docs/d2-authoring.md "레이아웃과 크기".
	pad: 24,
	sketch: true,
	// 사이트 테마(Dracula/Alucard)에 맞춘 값. 라이트 7 Aubergine(보라 accent), 다크 200 Dark Mauve.
	theme: '7',
	darkTheme: '200',
	// 노드 라벨 px. 엣지 라벨은 1px 작다. 0이면 D2 기본(16)을 그대로 둔다. 펜스 `fontSize=`로 그림마다 바꾼다.
	fontSize: 13,
});

/** ELK 간격(px). D2 기본은 층 사이 70·컨테이너 안쪽 50·엣지-노드 40이라 세로로 길어져 줄였다. layout=elk 펜스에만 붙는다. */
export const elkSpacing = Object.freeze({ nodeNodeBetweenLayers: 40, padding: 30, edgeNodeBetweenLayers: 25 });

const attributePattern =
	/(?<key>[^\s"'=]+)=(?:(?<plain>[^\s"']+)|'(?<single>[^']+)'|"(?<double>[^"]+)")|(?<truthy>[^\s"'=]+)/g;
const knownKeys = new Set([
	'title', 'layout', 'pad', 'sketch', 'theme', 'darkTheme', 'target', 'animateInterval', 'appendix', 'inline', 'fontSize',
]);

/** ```d2 layout=elk pad=40 title="…" 형태의 펜스 meta를 옵션으로 바꾼다. 모르는 키는 오타로 보고 거부한다. */
export function parseD2Attributes(meta, defaults = defaultD2Options) {
	const options = { ...defaults, title: 'Diagram', inline: false, appendix: false };
	for (const match of (meta ?? '').matchAll(attributePattern)) {
		const { key: assignedKey, plain, single, double, truthy } = match.groups;
		const key = truthy ?? assignedKey;
		const value = truthy ? 'true' : (plain ?? single ?? double);
		if (!knownKeys.has(key)) {
			throw new Error(`[D2 펜스 속성] 알 수 없는 속성 '${key}'입니다. 허용: ${[...knownKeys].join(', ')}`);
		}
		if (key === 'pad' || key === 'fontSize') options[key] = Number(value);
		else if (key === 'sketch' || key === 'appendix' || key === 'inline') options[key] = value === 'true';
		else if (key === 'target') options.target = value === 'root' ? '' : value;
		else if (key === 'darkTheme') options.darkTheme = value === 'false' ? false : value;
		else options[key] = value;
	}
	return options;
}

/** D2 CLI 인자. 입력은 stdin('-'), 출력은 outputPath. */
export function d2Arguments(options, outputPath) {
	const args = [
		`--layout=${options.layout}`,
		`--theme=${options.theme}`,
		`--sketch=${options.sketch}`,
		`--pad=${options.pad}`,
	];
	if (options.layout === 'elk') {
		const { nodeNodeBetweenLayers, padding, edgeNodeBetweenLayers } = elkSpacing;
		args.push(
			`--elk-nodeNodeBetweenLayers=${nodeNodeBetweenLayers}`,
			`--elk-padding=[top=${padding},left=${padding},bottom=${padding},right=${padding}]`,
			`--elk-edgeNodeBetweenLayers=${edgeNodeBetweenLayers}`,
		);
	}
	if (options.darkTheme !== false && options.darkTheme !== 'false') args.push(`--dark-theme=${options.darkTheme}`);
	if (options.animateInterval) args.push(`--animate-interval=${options.animateInterval}`);
	if (options.target !== undefined) args.push(`--target=${options.target}`);
	if (options.appendix) args.push('--force-appendix');
	args.push('-', outputPath);
	return args;
}

/**
 * 펜스 원본 앞에 전역 글자 크기 glob을 붙인다. glob은 뒤에 선언되는 객체와 import·보드에도 적용되고,
 * 작성자가 적은 명시적 `style.font-size`가 뒤에 오므로 이긴다. fontSize가 0이면 원본 그대로다.
 */
export function d2Source(source, options) {
	const size = Number(options.fontSize);
	if (!size) return source;
	return `**.style.font-size: ${size}\n(** -> **)[*].style.font-size: ${Math.max(size - 1, 1)}\n${source}`;
}

/** D2 SVG의 viewBox에서 크기를 읽는다. */
export function svgSize(svg) {
	const match = svg.match(/viewBox="\d+ \d+ (?<width>\d+) (?<height>\d+)"/);
	if (!match) throw new Error('[D2 산출물] SVG에서 viewBox를 읽지 못했습니다.');
	return { width: Number(match.groups.width), height: Number(match.groups.height) };
}

function escapeAttribute(value) {
	return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function escapeText(value) {
	return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/** D2 이미지 출력. 일반 이미지 확대 플러그인에서 명시적으로 제외한다. */
export function imgHtml({ src, title, width, height }) {
	return `<img data-zoom-off alt="${escapeAttribute(title)}" decoding="async" loading="lazy" src="${escapeAttribute(src)}" width="${width}" height="${height}" />`;
}

/** 정적·인라인 D2를 같은 전용 UI로 감싼다. 작성자는 별도 MDX 컴포넌트를 import하지 않는다. */
export function figureHtml(svg, { options, src }) {
	// 소스 정규식 대신 렌더 결과를 본다. import한 원본 안의 링크·툴팁·움직임도 잡혀야 한다.
	// 보드 자동 교차는 선/노드 재생 UI와 계약이 달라 여기서는 자동 인라인으로 바꾸지 않는다.
	const motion = !options.animateInterval && /<(?:path|g)\b[^>]*(?:class="[^"]*\banimated-|style="[^"]*\banimation\s*:)/.test(svg);
	const interactive = !options.appendix && /<(?:a\s|title[\s>])/.test(svg);
	const inline = options.inline || motion || interactive;
	const { width, height } = svgSize(svg);
	const content = inline ? inlineSvgHtml(svg, { title: options.title }) : imgHtml({ src, title: options.title, width, height });
	// --d2-w/--d2-h: 본문 미리보기 크기 규칙(D2Figure CSS)이 폭 100%·높이 80vh 안에 비율대로 맞추는 데 쓴다.
	return `<d2-figure role="figure" aria-label="${escapeAttribute(options.title)}" style="--d2-w:${width};--d2-h:${height}"${motion ? ' data-motion' : ''}>${content}</d2-figure>`;
}

/**
 * inline 출력. D2 SVG 문자열을 본문에 바로 넣을 수 있게 다듬는다.
 * - XML 선언을 떼고, 루트 <svg>에 viewBox 크기를 width/height로 줘서 <img>처럼 자연 크기로 그려지게 한다.
 * - 루트에 data-d2-inline을 달아 D2Figure와 rehype 플러그인이 이 그림만 다루게 한다.
 * - 펜스 title을 접근 가능한 이름(<title>)으로 넣는다.
 * D2가 심는 <style>은 Astro MDX가 접어 버리므로 src/integrations/d2-inline.mjs가 hast 단계에서 보호한다.
 */
export function inlineSvgHtml(svg, { title }) {
	const { width, height } = svgSize(svg);
	const withoutProlog = svg.replace(/^\s*<\?xml[^>]*\?>\s*/, '');
	const root = withoutProlog.match(/<svg\b[^>]*>/);
	if (!root) throw new Error('[D2 산출물] SVG 루트 요소를 찾지 못했습니다.');
	const rootTag = root[0].replace(/\s*\/?>$/, '');
	const attributes = ` width="${width}" height="${height}" data-d2-inline=""`;
	return `${withoutProlog.slice(0, root.index)}${rootTag}${attributes}><title>${escapeText(title)}</title>${withoutProlog.slice(root.index + root[0].length)}`;
}

/**
 * 사이트 테마의 페이지 배경색. D2의 배경 클래스(fill-N7)를 이 색으로 바꿔 그림이 본문에 녹아들게 한다.
 * 라이트는 Alucard의 크림색, 다크는 Dracula의 배경이다(starlight-theme-dracula). 테마를 바꾸면 여기를 같이 바꾼다.
 */
export const pageBackground = Object.freeze({ light: '#fffbeb', dark: '#282a36' });

/**
 * D2 SVG의 배경색 규칙을 페이지 배경으로 바꾼다. D2는 `.fill-N7{fill:…}`을 라이트 블록에 한 번,
 * `@media (prefers-color-scheme: dark)` 블록에 한 번 쓰므로 첫 번째를 라이트, 두 번째를 다크로 본다.
 * fill-N7은 배경 사각형과 라벨 배경 상자가 함께 쓰므로 둘이 같은 색으로 맞춰진다.
 */
export function matchPageBackground(svg, background = pageBackground) {
	let index = 0;
	return svg.replace(/(\.fill-N7\{fill:)#[0-9A-Fa-f]{3,8}(;?\})/g, (match, head, tail) => {
		const color = index === 0 ? background.light : index === 1 ? background.dark : undefined;
		index += 1;
		return color ? `${head}${color}${tail}` : match;
	});
}

/** 렌더 직후 SVG 파일에 적용하는 후처리. <img>·inline 양쪽과 d2-measure의 PNG 미리보기가 같은 결과를 본다. */
export function postprocessD2Svg(svg, { background = pageBackground } = {}) {
	return matchPageBackground(svg, background);
}

/** D2를 stdin 입력으로 실행한다. 실패하면 stderr를 메시지로 던진다. */
function runD2(binary, args, source, cwd) {
	return new Promise((resolve, reject) => {
		const child = spawn(binary, args, { cwd, stdio: ['pipe', 'ignore', 'pipe'] });
		let stderr = '';
		child.stderr.setEncoding('utf8');
		child.stderr.on('data', (chunk) => { stderr += chunk; });
		child.on('error', (error) => reject(new Error(`'${binary}' 실행 실패: ${error.message}`, { cause: error })));
		child.on('close', (code) => {
			if (code === 0) resolve();
			else reject(new Error(stderr.trim() || `D2 종료 코드 ${code}`));
		});
		child.stdin.on('error', () => {});
		child.stdin.end(source);
	});
}

/** 펜스 하나를 D2로 변환해 후처리까지 마친 SVG를 outputPath에 저장하고 그 문자열을 돌려준다. */
export async function renderD2({ binary, source, options, outputPath, cwd, background }) {
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	await runD2(binary, d2Arguments(options, outputPath), d2Source(source, options), cwd);
	const svg = postprocessD2Svg(await fs.readFile(outputPath, 'utf8'), { background });
	await fs.writeFile(outputPath, svg);
	return svg;
}

/** D2 실행 디렉터리. 펜스의 `icon: icons/<이름>.svg`와 `...@<파일>` import가 이 폴더 기준으로 풀린다. */
export function d2WorkingDirectory(root) {
	return path.join(root, 'src', 'd2');
}

// 산출물 경로: src/content/docs/<덱>/<파일>.mdx → docs/<덱>/<파일>-<i>.svg (astro-d2의 규칙 그대로).
function outputRelativePath(root, filePath, index) {
	const relative = path.relative(root, filePath).replace(/^src[/\\](content|pages)[/\\]/, '');
	const parsed = path.parse(relative);
	return path.join(parsed.dir, `${parsed.name}-${index}.svg`);
}

export function remarkD2({ binary, base, publicDir, root, outputDir = 'd2', defaults = defaultD2Options, background = pageBackground }) {
	return async (tree, file) => {
		const fences = [];
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang === 'd2' && parent && index !== undefined) fences.push({ node, index, parent });
		});
		if (fences.length === 0) return;

		const filePath = file.history[0] ?? file.path;
		await Promise.all(
			fences.map(async ({ node, index, parent }, fenceIndex) => {
				const location = `${path.relative(root, filePath)}:${node.position?.start.line ?? 0}`;
				let options;
				try {
					options = parseD2Attributes(node.meta, defaults);
				} catch (error) {
					throw new Error(`${location} ${error.message}`, { cause: error });
				}
				const relativeOutput = outputRelativePath(root, filePath, fenceIndex);
				const outputPath = path.join(publicDir, outputDir, relativeOutput);
				let svg;
				try {
					svg = await renderD2({ binary, source: node.value, options, outputPath, cwd: d2WorkingDirectory(root), background });
				} catch (error) {
					throw new Error(`[D2 변환 실패] ${location}\n${error.message}`, { cause: error });
				}
				const html = figureHtml(svg, {
					options,
					src: path.posix.join(base, outputDir, relativeOutput.split(path.sep).join('/')),
				});
				parent.children.splice(index, 1, { type: 'html', value: html });
			}),
		);
	};
}

export default function d2({ background = pageBackground, ...userOptions } = {}) {
	const defaults = { ...defaultD2Options, ...userOptions };
	const outputDir = 'd2';
	return {
		name: 'd2',
		hooks: {
			'astro:config:setup': async ({ command, config, logger }) => {
				if (command !== 'build' && command !== 'dev') return;
				const processor = config.markdown.processor;
				if (processor?.name !== 'unified' || !Array.isArray(processor.options?.remarkPlugins)) {
					throw new Error("[D2 integration] markdown.processor가 unified()가 아닙니다. astro.config.mjs의 설정을 확인하세요.");
				}
				const binary = path.join(await prepareD2(), 'd2');
				const root = fileURLToPath(config.root);
				const publicDir = fileURLToPath(config.publicDir);
				if (command === 'build') {
					// 이전 빌드의 SVG와 콘텐츠 레이어 캐시를 지워 바뀐 펜스가 반드시 다시 그려지게 한다.
					await fs.rm(path.join(publicDir, outputDir), { force: true, recursive: true });
					const dataStore = new URL('data-store.json', config.cacheDir);
					await fs.rm(dataStore, { force: true });
					logger.info('D2 산출물과 콘텐츠 캐시를 비웠습니다.');
				}
				processor.options.remarkPlugins.push([remarkD2, { binary, base: config.base, publicDir, root, outputDir, defaults, background }]);
			},
		},
	};
}
