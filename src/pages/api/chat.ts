import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAIClient() {
	if (openai === null) {
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			throw new Error(
				"OPENAI_API_KEY não configurada nas variáveis de ambiente"
			);
		}
		openai = new OpenAI({ apiKey });
	}
	return openai;
}

interface ChatRequestBody {
	message: string;
	model?: string;
	maxTokens?: number;
}

async function getOpenAIResponse(requestBody: ChatRequestBody) {
	try {
		const { message, model = "gpt-3.5-turbo", maxTokens = 300 } = requestBody;

		const client = getOpenAIClient();
		const completion = await client.chat.completions.create({
			model,
			messages: [{ role: "user", content: message }],
			max_tokens: maxTokens,
		});
		return completion.choices[0].message.content;
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

		const response = await getOpenAIResponse({
			message,
			model,
			maxTokens: maxTokens ? Number(maxTokens) : undefined,
		});

		return res.status(200).json({ response });
	} catch (error) {
		return res.status(500).json({
			error: "Erro ao processar a requisição",
			message: error instanceof Error ? error.message : "Erro desconhecido",
		});
	}
}
