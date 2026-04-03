import { http, HttpResponse } from "msw";

export const handlers = [
	http.post("/api/chat", () => {
		return HttpResponse.json({
			response: "Resposta simulada do assistente.",
			model: "mistral",
			availableModels: ["mistral"],
		});
	}),

	http.get("/api/models", () => {
		return HttpResponse.json({ models: ["mistral", "llama3"] });
	}),
];
