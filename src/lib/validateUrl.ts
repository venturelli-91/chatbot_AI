/**
 * Valida que uma URL de Ollama aponta exclusivamente para localhost.
 * Previne SSRF ao bloquear redirecionamento a endpoints internos arbitrários.
 */
export function isLocalhostUrl(raw: string): boolean {
	try {
		const { hostname, protocol } = new URL(raw);
		if (protocol !== "http:" && protocol !== "https:") return false;
		return (
			hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
		);
	} catch {
		return false;
	}
}

export function validateOllamaUrl(raw: string, fallback: string): string {
	return isLocalhostUrl(raw) ? raw : fallback;
}
