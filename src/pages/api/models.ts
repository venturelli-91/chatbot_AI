import { NextApiRequest, NextApiResponse } from "next";

const DEFAULT_OLLAMA_URL = "http://localhost:11434";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Método não permitido. Use GET." });
	}

	const ollamaUrl =
		typeof req.query.ollamaUrl === "string"
			? req.query.ollamaUrl
			: DEFAULT_OLLAMA_URL;

	try {
		const response = await fetch(`${ollamaUrl}/api/tags`);
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
