import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Método não permitido" });
	}
	try {
		const { message } = req.body;

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [{ role: "user", content: message }],
			}),
		});

		const data = await response.json();
		return res.status(200).json(data);
	} catch (error) {
		console.error("Erro ao processar a requisição:", error);
		res.status(500).json({ error: "Erro ao processar a requisição" });
	}
}
