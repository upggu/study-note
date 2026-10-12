/** Canonical base: one leading/trailing slash; root is '/'. */
export function normalizeBase(base = '/') {
	if (!/^\/(?:[^?#\\\s]*)$/u.test(base) || base.startsWith('//') || base.includes('//') ||
		base.split('/').some((part) => part === '.' || part === '..')) {
		throw new Error(`base는 / 또는 /team/notes/ 같은 경로여야 합니다: ${base}`);
	}
	return base === '/' ? '/' : `${base.replace(/\/$/u, '')}/`;
}

/** Input is an authored site-root URL, NEVER an already published URL. */
export function withBase(url, base = '/') {
	if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) return url;
	return normalizeBase(base).slice(0, -1) + url;
}

/** Reverse a published pathname. null means it escapes this site's base. */
export function stripBase(pathname, base = '/') {
	const prefix = normalizeBase(base);
	if (prefix === '/') return pathname;
	if (pathname === prefix.slice(0, -1)) return '/';
	return pathname.startsWith(prefix) ? `/${pathname.slice(prefix.length)}` : null;
}
