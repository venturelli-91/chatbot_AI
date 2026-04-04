import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { validateOllamaUrl } from "../../lib/validateUrl";
import { checkRateLimit } from "../../lib/rateLimit";
import { OLLAMA_DEFAULT_URL } from "../../lib/env";
import { fetchWithTimeout, getAvailableModels } from "../../lib/fetchWithTimeout";

const DEFAULT_MODEL = "mistral";
const DEFAULT_MAX_TOKENS = 300;
const MAX_CONTEXT_MESSAGES = 10;

function getClientIp(req: NextApiRequest): string {
	const forwarded = req.headers["x-forwarded-for"];
	if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
	if (Array.isArray(forwarded)) return forwarded[0];
	return (req.socket as { remoteAddress?: string })?.remoteAddress ?? "unknown";
}

const HistoryMessageSchema = z.object({
	role: z.enum(["user", "assistant"]),
	content: z.string().max(4000),
});

const ChatSchema = z.object({
	message: z
		.string()
		.min(1, "Mensagem não pode ser vazia")
		.max(4000, "Mensagem muito longa"),
	model: z.string().optional(),
	maxTokens: z.number().int().min(50).max(4000).optional(),
	ollamaUrl: z.string().url("URL do Ollama inválida").optional(),
	history: z.array(HistoryMessageSchema).max(20).optional(),
});

function resolveModel(requested: string, available: string[]): string {
	const base = requested.split(":")[0];
	if (available.some((m) => m.includes(base))) return requested;
	return available[0];
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Método não permitido. Use POST." });
	}

	const rl = checkRateLimit(getClientIp(req));
	if (!rl.allowed) {
		res.setHeader("Retry-After", String(rl.retryAfter));
		return res
			.status(429)
			.json({ error: "Muitas requisições. Tente novamente em breve." });
	}

	const parsed = ChatSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({
			error:
				parsed.error.issues[0]?.message ?? "Dados inválidos na requisição.",
		});
	}

	const {
		message,
		model,
		maxTokens = DEFAULT_MAX_TOKENS,
		ollamaUrl,
		history = [],
	} = parsed.data;

	const baseUrl = validateOllamaUrl(
		ollamaUrl ?? OLLAMA_DEFAULT_URL,
		OLLAMA_DEFAULT_URL,
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

		const modelToUse = resolveModel(model ?? DEFAULT_MODEL, availableModels);

		// Build messages with conversation context (last N turns)
		const contextMessages = history
			.slice(-MAX_CONTEXT_MESSAGES)
			.map(({ role, content }) => ({ role, content }));
		contextMessages.push({ role: "user" as const, content: message });

		// Set streaming headers before writing body
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.setHeader("Cache-Control", "no-cache, no-transform");
		res.setHeader("X-Accel-Buffering", "no");

		const ollamaRes = await fetchWithTimeout(`${baseUrl}/api/chat`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: modelToUse,
				messages: contextMessages,
				stream: true,
				options: { num_predict: maxTokens },
			}),
		});

		if (!ollamaRes.ok) {
			const errData = await ollamaRes.json().catch(() => null);
			res.write(
				JSON.stringify({
					error: `Erro do Ollama: ${errData?.error ?? ollamaRes.statusText}`,
				}) + "\n",
			);
			return res.end();
		}

		const reader = ollamaRes.body!.getReader();
		const decoder = new TextDecoder();
		let buffer = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";

			for (const line of lines) {
				if (!line.trim()) continue;
				let data: Record<string, unknown>;
				try {
					data = JSON.parse(line);
				} catch {
					continue;
				}

				const msg = data.message as { content?: string } | undefined;
				if (msg?.content) {
					res.write(JSON.stringify({ token: msg.content }) + "\n");
				}

				if (data.done) {
					res.write(
						JSON.stringify({
							done: true,
							modelUsed: modelToUse,
							availableModels,
						}) + "\n",
					);
				}
			}
		}

		res.end();
	} catch (error) {
		const isConnection =
			error instanceof TypeError && error.message.includes("fetch");

		if (res.headersSent) {
			res.write(JSON.stringify({ error: "Erro durante a geração" }) + "\n");
			return res.end();
		}

		if (isConnection) {
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
