// D2 펜스 오프라인 측정·렌더 도구 — 빌드 없이 크기와 미리보기 배율을 잰다.
//
//   node scripts/d2-measure.mjs <파일.mdx> [<파일.mdx> …]          폭·높이·미리보기 배율 출력
//   node scripts/d2-measure.mjs --png <파일.mdx> [<파일.mdx> …]    블록별 PNG를 .d2-measure/에 저장
//
// 빌드가 쓰는 자체 D2 integration(src/integrations/d2.mjs)과 같은 native D2 v0.9.0 CLI를 같은 옵션
// 파싱·인자 조립 코드로 직접 호출하므로 결과 SVG의 width/height가 빌드 산출물과 픽셀 단위로 일치한다.
// `npm run check` 전체 빌드 대신 파일 하나만 빠르게 확인할 때 쓴다.
// 기본값(elk · pad 24 · 글자 13 · sketch · theme 7/200)과 ELK 간격은 integration의 defaultD2Options·elkSpacing 하나다.
// astro.config.mjs가 같은 값을 넘기는지 확인한다.
//
// native CLI도 astro.config.mjs와 같은 준비 함수를 거치므로 시스템 전역 D2에는 의존하지 않는다.
// 일반 측정의 SVG는 OS 임시 디렉터리에 만들고, --png일 때만 .d2-measure/에 남긴다.
//
// 이슈 #2에서 확인된 PNG 함정을 코드에 반영해 뒀다:
// - PNG 렌더(sharp)는 라벨에 emoji(⚠️ 등)가 있으면 로컬 Pango 폰트 문제로 **프로세스째 abort**한다
//   (try/catch로 못 잡는다). 그래서 래스터화만 블록별 자식 프로세스로 격리했다 — 죽은 블록은
//   "PNG 실패"로 표시되고 나머지는 계속 나온다. 그 블록의 실물은 브라우저에서 본다.
// - 수치는 라벨 겹침·컨테이너 관통을 잡지 못한다. 그 확인은 소유자가 사이트에서 하고, 지적받은 그림을 고칠 때만
//   --png로 본다(docs/d2-authoring.md "검증").
//
// 크기 상한은 없다. 본문은 폭 100%·높이 80vh 안에 비율대로 줄인 미리보기이고(D2Figure), 1280×800 화면 기준
// 본문 폭 632·높이 640px으로 배율과 표시 글자 px를 계산해 보여 준다.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { prepareD2 } from './prepare-d2.mjs';
import { d2Arguments, d2Source, d2WorkingDirectory, parseD2Attributes, postprocessD2Svg } from '../src/integrations/d2.mjs';

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(scriptPath), '..');
const outputRoot = path.join(repositoryRoot, '.d2-measure');
// 1280×800 화면에서 양쪽 사이드바를 켠 본문 폭과 80vh. 최악 조건이라 넓은 화면에서는 덜 줄어든다.
const PREVIEW = Object.freeze({ width: 632, height: 640 });

// 내부용: Pango abort를 격리하기 위해 래스터화 한 건만 자식 프로세스로 수행한다.
if (process.argv[2] === '--rasterize') {
	const [, , , svgPath, pngPath] = process.argv;
	const sharpModulePath = path.join(repositoryRoot, 'node_modules/sharp/lib/index.js');
	const sharp = (await import(pathToFileURL(sharpModulePath).href)).default;
	await sharp(fs.readFileSync(svgPath)).flatten({ background: '#ffffff' }).png().toFile(pngPath);
	process.exit(0);
}

const args = process.argv.slice(2);
const renderPng = args.includes('--png');
const files = args.filter((argument) => argument !== '--png');
if (files.length === 0) {
	console.error('사용법: node scripts/d2-measure.mjs [--png] <파일.mdx> …');
	process.exit(1);
}

const d2BinDirectory = await prepareD2();
const d2Binary = path.join(d2BinDirectory, 'd2');

// ```d2 layout=elk pad=40 title="…" 형태의 펜스에서 본문과 속성을 뽑는다.
function extractD2Blocks(source) {
	const blocks = [];
	const lines = source.split(/\r?\n/);
	let current = null;
	for (const line of lines) {
		if (current === null) {
			const opening = line.match(/^```d2\b(.*)$/);
			if (opening) current = { attributes: opening[1].trim(), body: [] };
		} else if (line === '```') {
			blocks.push({ attributes: current.attributes, body: current.body.join('\n') });
			current = null;
		} else {
			current.body.push(line);
		}
	}
	return blocks;
}

if (renderPng) fs.mkdirSync(outputRoot, { recursive: true });
const temporaryOutputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'study-note-d2-measure-'));

try {
	for (const file of files) {
		const absolutePath = path.resolve(file);
		const blocks = extractD2Blocks(fs.readFileSync(absolutePath, 'utf8'));
		const baseName = path.basename(absolutePath, path.extname(absolutePath));
		if (blocks.length === 0) {
			console.log(`${file}: d2 블록 없음`);
			continue;
		}
		for (const [index, block] of blocks.entries()) {
			// 빌드 산출물과 같은 0-기준 번호(<slug>-<i>.svg)를 쓴다.
			const label = `${file} #${index}`;
			const svgPath = renderPng
				? path.join(outputRoot, `${baseName}-${index}.svg`)
				: path.join(temporaryOutputRoot, `${baseName}-${index}.svg`);
			try {
				const options = parseD2Attributes(block.attributes);
				const child = spawnSync(d2Binary, d2Arguments(options, svgPath), {
					cwd: d2WorkingDirectory(repositoryRoot),
					encoding: 'utf8',
					input: d2Source(block.body, options, { root: repositoryRoot, filePath: absolutePath }),
				});
				if (child.error) throw child.error;
				if (child.status !== 0) throw new Error(child.stderr?.trim() || `D2 종료 코드 ${child.status}`);

				const svg = postprocessD2Svg(fs.readFileSync(svgPath, 'utf8'));
				fs.writeFileSync(svgPath, svg);
				const size = svg.match(/width="(\d+)" height="(\d+)"/);
				if (!size) {
					console.log(`${label}: SVG에서 크기를 읽지 못함`);
					continue;
				}
				const width = Number(size[1]);
				const height = Number(size[2]);
				const scale = Math.min(1, PREVIEW.width / width, PREVIEW.height / height);
				const preview = scale < 1
					? ` 미리보기 ${Math.round(scale * 100)}% · 글자 ≈ ${((options.fontSize || 16) * scale).toFixed(1)}px`
					: '';
				console.log(`${label}: ${width}x${height}${preview}`);
				if (renderPng) {
					const pngPath = path.join(outputRoot, `${baseName}-${index}.png`);
					const rasterize = spawnSync(process.execPath, [scriptPath, '--rasterize', svgPath, pngPath], {
						stdio: ['ignore', 'ignore', 'pipe'],
					});
					if (rasterize.status === 0) {
						console.log(`  -> ${path.relative(repositoryRoot, pngPath)}`);
					} else {
						console.log('  -> PNG 실패 — 라벨의 emoji가 로컬 폰트에서 죽는 경우다. 브라우저에서 확인');
					}
				}
			} catch (error) {
				console.log(`${label}: 컴파일 실패 — ${String(error.message ?? error).split('\n')[0]}`);
			}
		}
	}
} finally {
	fs.rmSync(temporaryOutputRoot, { force: true, recursive: true });
}
