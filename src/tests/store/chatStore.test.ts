import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useChatStore } from "../../store/chatStore";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

beforeEach(() => {
	act(() => {
		useChatStore.setState({
			messages: [],
			inputMessage: "",
			isLoading: false,
			error: null,
			sessionTitle: null,
			activeModel: "mistral",
			availableModels: [],
		});
	});
});

describe("chatStore", () => {
	describe("setInputMessage", () => {
		it("atualiza inputMessage", () => {
			act(() => useChatStore.getState().setInputMessage("Olá"));
			expect(useChatStore.getState().inputMessage).toBe("Olá");
		});
	});

	describe("clearError", () => {
		it("limpa o erro", () => {
			act(() => useChatStore.setState({ error: "Algo deu errado" }));
			act(() => useChatStore.getState().clearError());
			expect(useChatStore.getState().error).toBeNull();
		});
	});

	describe("clearMessages", () => {
		it("esvazia a lista de mensagens", () => {
			act(() =>
				useChatStore.setState({
					messages: [
						{
							id: "1",
							content: "Oi",
							role: "user",
							timestamp: new Date().toISOString(),
						},
					],
				}),
			);
			act(() => useChatStore.getState().clearMessages());
			expect(useChatStore.getState().messages).toHaveLength(0);
		});

		it("reseta o sessionTitle", () => {
			act(() => useChatStore.setState({ sessionTitle: "Minha sessão" }));
			act(() => useChatStore.getState().clearMessages());
			expect(useChatStore.getState().sessionTitle).toBeNull();
		});
	});

	describe("updateSettings", () => {
		it("atualiza settings parcialmente", () => {
			act(() => useChatStore.getState().updateSettings({ maxTokens: 500 }));
			expect(useChatStore.getState().settings.maxTokens).toBe(500);
			// outros campos não foram afetados
			expect(useChatStore.getState().settings.model).toBe("mistral");
		});
	});

	describe("sendMessage", () => {
		it("não envia se inputMessage está vazio", async () => {
			act(() => useChatStore.setState({ inputMessage: "" }));
			await act(async () => useChatStore.getState().sendMessage());
			expect(useChatStore.getState().messages).toHaveLength(0);
		});

		it("não envia se inputMessage é apenas espaços", async () => {
			act(() => useChatStore.setState({ inputMessage: "   " }));
			await act(async () => useChatStore.getState().sendMessage());
			expect(useChatStore.getState().messages).toHaveLength(0);
		});

		it("adiciona mensagem do usuário e resposta do assistente", async () => {
			act(() => useChatStore.setState({ inputMessage: "Oi!" }));
			await act(async () => useChatStore.getState().sendMessage());

			const messages = useChatStore.getState().messages;
			expect(messages).toHaveLength(2);
			expect(messages[0].role).toBe("user");
			expect(messages[0].content).toBe("Oi!");
			expect(messages[1].role).toBe("assistant");
			expect(messages[1].content).toBe("Resposta simulada.");
		});

		it("limpa inputMessage após envio", async () => {
			act(() => useChatStore.setState({ inputMessage: "Oi!" }));
			await act(async () => useChatStore.getState().sendMessage());
			expect(useChatStore.getState().inputMessage).toBe("");
		});

		it("define sessionTitle com o início do primeiro input", async () => {
			act(() =>
				useChatStore.setState({ inputMessage: "Primeira mensagem da sessão" }),
			);
			await act(async () => useChatStore.getState().sendMessage());
			expect(useChatStore.getState().sessionTitle).toBe(
				"Primeira mensagem da sessão",
			);
		});

		it("registra erro quando API falha", async () => {
			server.use(
				http.post("/api/chat", () =>
					HttpResponse.json({ error: "Ollama offline" }, { status: 503 }),
				),
			);

			act(() => useChatStore.setState({ inputMessage: "Oi!" }));
			await act(async () => useChatStore.getState().sendMessage());

			expect(useChatStore.getState().error).not.toBeNull();
			expect(useChatStore.getState().isLoading).toBe(false);
		});

		it("isLoading é false após a resposta", async () => {
			act(() => useChatStore.setState({ inputMessage: "Oi!" }));
			await act(async () => useChatStore.getState().sendMessage());
			expect(useChatStore.getState().isLoading).toBe(false);
		});
	});
});
