import { NextApiRequest, NextApiResponse } from "next";

const OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "mistral";
const DEFAULT_MAX_TOKENS = 300;

interface ChatRequestBody {
	message: string;
	model?: string;
	maxTokens?: number;
}

async function getAvailableModels(): Promise<string[]> {
	const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);

	if (!response.ok) return [];

	const data = await response.json();
	return data.models?.map((model: { name: string }) => model.name) || [];
}

function resolveModel(requested: string, available: string[]): string {
	const baseRequested = requested.split(":")[0];
	if (available.some((m) => m.includes(baseRequested))) {
		return requested;
	}
	return available[0];
}

async function generateResponse(
	message: string,
	model: string,
	maxTokens: number
): Promise<string> {
	const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model,
			prompt: message,
			stream: false,
			options: { num_predict: maxTokens },
		}),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		throw new Error(
			errorData?.error
				? `Erro na API do Ollama: ${response.statusText} - ${errorData.error}`
				: `Erro na API do Ollama: ${response.statusText}`
		);
	}

	const data = await response.json();
	return data.response || data.text || "";
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Método não permitido. Use POST." });
	}

	const { message, model, maxTokens } = req.body as ChatRequestBody;

	if (!message || typeof message !== "string") {
		return res
			.status(400)
			.json({ error: "É necessário fornecer uma mensagem válida." });
	}

	try {
		const availableModels = await getAvailableModels();

		if (availableModels.length === 0) {
			return res.status(503).json({
				error: "Nenhum modelo disponível no Ollama",
				message:
					"Verifique se o Ollama está rodando e instale um modelo com 'ollama pull <model>'",
			});
		}

		const modelToUse = resolveModel(
			model || DEFAULT_MODEL,
			availableModels
		);

		const response = await generateResponse(
			message,
			modelToUse,
			maxTokens ?? DEFAULT_MAX_TOKENS
		);

		return res.status(200).json({
			response,
			modelUsed: modelToUse,
			availableModels,
		});
	} catch (error) {
		const isConnectionError =
			error instanceof TypeError && error.message.includes("fetch");

		if (isConnectionError) {
			return res.status(503).json({
				error: "Serviço Ollama não está disponível",
				message:
					"Verifique se o Ollama está rodando em http://localhost:11434",
			});
		}

		return res.status(500).json({
			error: "Erro ao processar a requisição",
			message:
				error instanceof Error ? error.message : "Erro desconhecido",
		});
	}
}
