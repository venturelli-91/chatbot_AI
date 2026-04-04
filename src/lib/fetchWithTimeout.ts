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

export async function getAvailableModels(baseUrl: string): Promise<string[]> {
	try {
		const response = await fetchWithTimeout(`${baseUrl}/api/tags`, {}, 10_000);
		if (!response.ok) return [];
		const data = await response.json();
		return (data.models ?? []).map((m: { name: string }) => m.name);
	} catch {
		return [];
	}
}
