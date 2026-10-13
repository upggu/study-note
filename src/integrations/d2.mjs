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
// - d2는 src/d2/를 cwd로 실행한다. 로고는 src/d2/icons/에 두고 펜스에서 `icon: icons/<이름>.svg`로 쓴다.
// - 렌더된 SVG는 softenEdgeLabels로 후처리해 엣지 라벨 뒤에서도 선이 보이게 한다.

export const defaultD2Options = Object.freeze({
	layout: 'elk',
	pad: 40,
	sketch: true,
	theme: '0',
	darkTheme: '200',
});

const attributePattern =
	/(?<key>[^\s"'=]+)=(?:(?<plain>[^\s"']+)|'(?<single>[^']+)'|"(?<double>[^"]+)")|(?<truthy>[^\s"'=]+)/g;
const knownKeys = new Set([
	'title', 'layout', 'pad', 'sketch', 'theme', 'darkTheme', 'target', 'animateInterval', 'appendix', 'inline',
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
		if (key === 'pad') options.pad = Number(value);
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
	if (options.darkTheme !== false && options.darkTheme !== 'false') args.push(`--dark-theme=${options.darkTheme}`);
	if (options.animateInterval) args.push(`--animate-interval=${options.animateInterval}`);
	if (options.target !== undefined) args.push(`--target=${options.target}`);
	if (options.appendix) args.push('--force-appendix');
	args.push('-', outputPath);
	return args;
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

/** <img> 출력. 크기를 속성으로 줘서 지연 로딩 전에도 자리를 잡는다. */
export function imgHtml({ src, title, width, height }) {
	return `<img alt="${escapeAttribute(title)}" decoding="async" loading="lazy" src="${escapeAttribute(src)}" width="${width}" height="${height}" />`;
}

/**
 * inline 출력. D2 SVG 문자열을 본문에 바로 넣을 수 있게 다듬는다.
 * - XML 선언을 떼고, 루트 <svg>에 viewBox 크기를 width/height로 줘서 <img>처럼 자연 크기로 그려지게 한다.
 * - 루트에 data-d2-inline을 달아 custom.css와 MarkdownContent.astro의 선택자가 이 그림만 잡게 한다.
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
 * 엣지 라벨 뒤에서 선이 보이게 한다.
 * D2는 연결선 라벨 자리를 SVG mask로 잘라내므로 라벨이 선을 끊어 보인다(옵션으로 끌 수 없다).
 * mask의 검은 사각형이 곧 라벨 상자이므로, mask를 떼고 그 상자 좌표에 반투명 배경 사각형을
 * 라벨 텍스트 앞에 넣는다. 배경색은 D2의 배경 클래스(fill-N7)를 써서 다크 테마를 그대로 따른다.
 * 브라우저 비교(2026-10-13): mask 제거만 하면 글자 사이로 선이 지나가고, 글자 테두리(halo)는
 * 단어 사이로 선이 토막나 보였다. 60% 배경이 선의 연속성과 가독성을 같이 지켰다.
 */
export function softenEdgeLabels(svg, opacity = 0.6) {
	const mask = svg.match(/<mask\b[^>]*>(.*?)<\/mask>/s);
	if (!mask) return svg;
	const boxes = [...mask[1].matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" fill="black"/g)]
		.map(([, x, y, width, height]) => ({ x: Number(x), y: Number(y), width: Number(width), height: Number(height) }));
	if (boxes.length === 0) return svg;
	const unmasked = svg.replace(/\smask="url\(#[^)]*\)"/g, '');
	return unmasked.replace(/<text\b[^>]*>/g, (tag) => {
		const x = Number(tag.match(/\sx="([-\d.]+)"/)?.[1]);
		const y = Number(tag.match(/\sy="([-\d.]+)"/)?.[1]);
		if (Number.isNaN(x) || Number.isNaN(y)) return tag;
		const box = boxes.find((candidate) => x >= candidate.x && x <= candidate.x + candidate.width && y >= candidate.y && y <= candidate.y + candidate.height);
		if (!box) return tag;
		return `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="3" class="fill-N7" fill-opacity="${opacity}" />${tag}`;
	});
}

/** 렌더 직후 SVG 파일에 적용하는 후처리. <img>·inline 양쪽과 d2-measure의 PNG 미리보기가 같은 결과를 본다. */
export function postprocessD2Svg(svg) {
	return softenEdgeLabels(svg);
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
export async function renderD2({ binary, source, options, outputPath, cwd }) {
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	await runD2(binary, d2Arguments(options, outputPath), source, cwd);
	const svg = postprocessD2Svg(await fs.readFile(outputPath, 'utf8'));
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

export function remarkD2({ binary, base, publicDir, root, outputDir = 'd2', defaults = defaultD2Options }) {
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
					svg = await renderD2({ binary, source: node.value, options, outputPath, cwd: d2WorkingDirectory(root) });
				} catch (error) {
					throw new Error(`[D2 변환 실패] ${location}\n${error.message}`, { cause: error });
				}
				const html = options.inline
					? inlineSvgHtml(svg, { title: options.title })
					: imgHtml({
							src: path.posix.join(base, outputDir, relativeOutput.split(path.sep).join('/')),
							title: options.title,
							...svgSize(svg),
						});
				parent.children.splice(index, 1, { type: 'html', value: html });
			}),
		);
	};
}

export default function d2(userOptions = {}) {
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
				processor.options.remarkPlugins.push([remarkD2, { binary, base: config.base, publicDir, root, outputDir, defaults }]);
			},
		},
	};
}
