import OpenAI from "openai";

const configuration = {
	apiKey: process.env.NEXT_OPENAI_API_URL,
};

const openai = new OpenAI(configuration);

async function testOpenAI() {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: "Hello!" }],
		});
		console.log(response);
	} catch (error) {
		console.error("Erro ao chamar a API:", error);
	}
}

testOpenAI();
