import { http, HttpResponse } from "msw";

const encodeNDJSON = (...lines: object[]) => {
	const encoder = new TextEncoder();
	const text = lines.map((l) => JSON.stringify(l)).join("\n") + "\n";
	return encoder.encode(text);
};

export const handlers = [
	http.post("/api/chat", () => {
		const stream = new ReadableStream({
			start(controller) {
				controller.enqueue(encodeNDJSON({ token: "Resposta" }));
				controller.enqueue(encodeNDJSON({ token: " simulada." }));
				controller.enqueue(
					encodeNDJSON({
						done: true,
						modelUsed: "mistral",
						availableModels: ["mistral"],
					}),
				);
				controller.close();
			},
		});
		return new HttpResponse(stream, {
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	}),

	http.get("/api/models", () => {
		return HttpResponse.json({ models: ["mistral", "llama3"] });
	}),
];
