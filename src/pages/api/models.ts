import { NextApiRequest, NextApiResponse } from "next";
import { validateOllamaUrl } from "../../lib/validateUrl";
import { OLLAMA_DEFAULT_URL } from "../../lib/env";
import { fetchWithTimeout } from "../../lib/fetchWithTimeout";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Método não permitido. Use GET." });
	}

	const rawUrl =
		typeof req.query.ollamaUrl === "string"
			? req.query.ollamaUrl
			: OLLAMA_DEFAULT_URL;

	const ollamaUrl = validateOllamaUrl(rawUrl, OLLAMA_DEFAULT_URL);

	try {
		const response = await fetchWithTimeout(`${ollamaUrl}/api/tags`, {}, 10_000);
		if (!response.ok) {
			return res
				.status(502)
				.json({ error: "Falha ao conectar com o Ollama", models: [] });
		}
		const data = await response.json();
		const models: string[] =
			data.models?.map((m: { name: string }) => m.name) ?? [];
		return res.status(200).json({ models });
	} catch {
		return res
			.status(503)
			.json({ error: "Ollama não está disponível", models: [] });
	}
}
