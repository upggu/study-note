import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import childProcess from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';

async function fixture(t, dev = true) {
	const key = `__deckDatesTest${Math.random()}`;
	const state = { head: 'first', collections: 0, lookups: 0, headChecks: 0, date: 1000 };
	globalThis[key] = state;
	t.mock.method(childProcess, 'execFileSync', (command, args) => {
		state.headChecks++;
		assert.equal(command, 'git');
		assert.deepEqual(args, ['rev-parse', 'HEAD']);
		if (state.head === null) throw new Error('No Git history');
		return state.head;
	});
	syncBuiltinESMExports();
	const server = await createServer({
		configFile: false,
		appType: 'custom',
		logLevel: 'silent',
		server: { middlewareMode: true, watch: null },
		define: { 'import.meta.env.DEV': JSON.stringify(dev) },
		plugins: [{
			name: 'deck-dates-fixtures',
			enforce: 'pre',
			resolveId(id) {
				if (['astro:content', 'virtual:starlight/git-info'].includes(id)) return `\0fixture:${id}`;
			},
			load(id) {
				const state = `globalThis[${JSON.stringify(key)}]`;
				if (id === '\0fixture:astro:content') return `export async function getCollection() {
					${state}.collections++;
					return [{id:'guide/index', filePath:'guide/index.mdx'}, {id:'guide/intro', filePath:'guide/intro.mdx'}];
				}`;
				if (id === '\0fixture:virtual:starlight/git-info') return `export function getNewestCommitDate() {
					${state}.lookups++;
					return new Date(${state}.date);
				}`;

			},
		}],
	});
	t.after(async () => {
		await server.close();
		delete globalThis[key];
		t.mock.restoreAll();
		syncBuiltinESMExports();
	});
	const { getDeckUpdatedAt } = await server.ssrLoadModule('/src/data/deck-updated-at.ts');
	return { state, getDeckUpdatedAt };
}

test('dev reuses dates for repeated and concurrent requests at the same HEAD', async (t) => {
	const { state, getDeckUpdatedAt } = await fixture(t);
	const [first, second] = await Promise.all([getDeckUpdatedAt(), getDeckUpdatedAt()]);
	assert.strictEqual(first, second);
	assert.strictEqual(await getDeckUpdatedAt(), first);
	assert.equal(state.collections, 1);
	assert.equal(state.lookups, 2);
	assert.equal(state.headChecks, 3);
});

test('dev refreshes dates when HEAD changes', async (t) => {
	const { state, getDeckUpdatedAt } = await fixture(t);
	assert.equal((await getDeckUpdatedAt()).get('guide').getTime(), 1000);
	state.head = 'second';
	state.date = 2000;
	assert.equal((await getDeckUpdatedAt()).get('guide').getTime(), 2000);
	await getDeckUpdatedAt();
	assert.equal(state.collections, 2);
	assert.equal(state.lookups, 4);
});

test('dev tolerates unavailable HEAD and refreshes when it becomes available', async (t) => {
	const { state, getDeckUpdatedAt } = await fixture(t);
	state.head = null;
	const first = await getDeckUpdatedAt();
	assert.strictEqual(await getDeckUpdatedAt(), first);
	assert.equal(state.collections, 1);
	state.head = 'first-commit';
	await getDeckUpdatedAt();
	assert.equal(state.collections, 2);
});

test('build reuses dates without querying HEAD', async (t) => {
	const { state, getDeckUpdatedAt } = await fixture(t, false);
	const first = await getDeckUpdatedAt();
	state.head = 'second';
	assert.strictEqual(await getDeckUpdatedAt(), first);
	assert.equal(state.collections, 1);
	assert.equal(state.headChecks, 0);
});
