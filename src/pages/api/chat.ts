import { NextApiRequest, NextApiResponse } from "next";

interface ChatRequestBody {
	message: string;
	model?: string;
	maxTokens?: number;
}

async function getMistralResponse(requestBody: ChatRequestBody) {
	try {
		const { message, model = "mistral", maxTokens = 300 } = requestBody;

		const response = await fetch("http://localhost:11434/api/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model,
				prompt: message,
				stream: false,
				max_tokens: maxTokens,
			}),
		});

		if (!response.ok) {
			throw new Error(`Erro na API do Ollama: ${response.statusText}`);
		}

		const data = await response.json();
		return data.response || data.text || "";
	} catch (error) {
		console.error("Erro ao chamar a API:", error);
		throw error;
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Método não permitido. Use POST." });
	}

	try {
		const { message, model, maxTokens } = req.body as ChatRequestBody;

		if (!message || typeof message !== "string") {
			return res
				.status(400)
				.json({ error: "É necessário fornecer uma mensagem válida." });
		}

		const response = await getMistralResponse({
			message,
			model,
			maxTokens: maxTokens ? Number(maxTokens) : undefined,
		});

		return res.status(200).json({ response });
	} catch (error) {
		console.error("Erro completo:", error);
		return res.status(500).json({
			error: "Erro ao processar a requisição",
			message: error instanceof Error ? error.message : "Erro desconhecido",
		});
	}
}
