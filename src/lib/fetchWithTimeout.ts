export function fetchWithTimeout(
	url: string,
	init: RequestInit = {},
	timeoutMs = 30_000,
): Promise<Response> {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeoutMs);
	return fetch(url, { ...init, signal: controller.signal }).finally(() =>
		clearTimeout(id),
	);
}
