import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { validateOllamaUrl } from "../../lib/validateUrl";

const DEFAULT_OLLAMA_URL = "http://localhost:11434";
const DEFAULT_MODEL = "mistral";
const DEFAULT_MAX_TOKENS = 300;
const FETCH_TIMEOUT_MS = 30_000;

const ChatSchema = z.object({
	message: z
		.string()
		.min(1, "Mensagem não pode ser vazia")
		.max(4000, "Mensagem muito longa"),
	model: z.string().optional(),
	maxTokens: z.number().int().min(50).max(4000).optional(),
	ollamaUrl: z.string().url("URL do Ollama inválida").optional(),
});

function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	return fetch(url, { ...init, signal: controller.signal }).finally(() =>
		clearTimeout(id),
	);
}

async function getAvailableModels(baseUrl: string): Promise<string[]> {
	const response = await fetchWithTimeout(`${baseUrl}/api/tags`, {});
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
	maxTokens: number,
	baseUrl: string,
): Promise<string> {
	const response = await fetchWithTimeout(`${baseUrl}/api/generate`, {
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
				: `Erro na API do Ollama: ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data.response || data.text || "";
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Método não permitido. Use POST." });
	}

	const parsed = ChatSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({
			error:
				parsed.error.issues[0]?.message ?? "Dados inválidos na requisição.",
		});
	}

	const { message, model, maxTokens, ollamaUrl } = parsed.data;
	const baseUrl = validateOllamaUrl(
		ollamaUrl ?? DEFAULT_OLLAMA_URL,
		DEFAULT_OLLAMA_URL,
	);

	try {
		const availableModels = await getAvailableModels(baseUrl);

		if (availableModels.length === 0) {
			return res.status(503).json({
				error: "Nenhum modelo disponível no Ollama",
				message:
					"Verifique se o Ollama está rodando e instale um modelo com 'ollama pull <model>'",
			});
		}

		const modelToUse = resolveModel(model || DEFAULT_MODEL, availableModels);

		const response = await generateResponse(
			message,
			modelToUse,
			maxTokens ?? DEFAULT_MAX_TOKENS,
			baseUrl,
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
				message: `Verifique se o Ollama está rodando em ${baseUrl}`,
			});
		}

		return res.status(500).json({
			error: "Erro ao processar a requisição",
			message: error instanceof Error ? error.message : "Erro desconhecido",
		});
	}
}
