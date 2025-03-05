import OpenAI from "openai";

const configuration = {
	apiKey: process.env.NEXT_OPENAI_API_URL,
};

interface ChatGptResponse {
	response: string;
}

export const chatGptResponse = async (
	message: string
): Promise<ChatGptResponse> => {
	try {
		const openai = new OpenAI(configuration);
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "user",
					content: message,
				},
			],
		});
		return { response: response.choices[0].message.content || "" };
	} catch (error) {
		console.error("Erro ao chamar a API", error);
		throw error;
	}
};
