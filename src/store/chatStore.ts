import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useHistoryStore } from "./historyStore";

export interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
}

export interface ChatSettings {
	model: string;
	maxTokens: number;
	ollamaUrl: string;
}

interface ChatState {
	messages: Message[];
	inputMessage: string;
	isLoading: boolean;
	error: string | null;
	activeModel: string;
	availableModels: string[];
	sessionTitle: string | null;
	settings: ChatSettings;
	streamingMessageId: string | null;

	setInputMessage: (message: string) => void;
	sendMessage: () => Promise<void>;
	cancelMessage: () => void;
	clearMessages: () => void;
	clearError: () => void;
	updateSettings: (patch: Partial<ChatSettings>) => void;
}

const DEFAULT_SETTINGS: ChatSettings = {
	model: "mistral",
	maxTokens: 300,
	ollamaUrl: "http://localhost:11434",
};

// Module-level AbortController — non-serializable, kept outside the store
let _abortController: AbortController | null = null;

export const useChatStore = create<ChatState>()(
	persist(
		(set, get) => ({
			messages: [],
			inputMessage: "",
			isLoading: false,
			error: null,
			activeModel: "mistral",
			availableModels: [],
			sessionTitle: null,
			settings: DEFAULT_SETTINGS,
			streamingMessageId: null,

			setInputMessage: (inputMessage) => set({ inputMessage }),

			clearError: () => set({ error: null }),

			cancelMessage: () => {
				_abortController?.abort();
				_abortController = null;
				const { streamingMessageId } = get();
				set((state) => ({
					isLoading: false,
					streamingMessageId: null,
					// Remove empty streaming message if cancelled before any content
					messages: streamingMessageId
						? state.messages.filter(
								(m) => m.id !== streamingMessageId || m.content.length > 0,
							)
						: state.messages,
				}));
			},

			clearMessages: () => {
				const { messages, sessionTitle, activeModel } = get();
				if (messages.length > 0) {
					const firstAssistant = messages.find((m) => m.role === "assistant");
					useHistoryStore.getState().saveSession({
						id: Date.now().toString(),
						title: sessionTitle ?? "Conversa sem título",
						preview: firstAssistant
							? firstAssistant.content.slice(0, 80)
							: messages[0].content.slice(0, 80),
						messages,
						createdAt: new Date().toISOString(),
						model: activeModel,
					});
				}
				set({ messages: [], error: null, sessionTitle: null });
			},

			updateSettings: (patch) =>
				set((state) => ({
					settings: { ...state.settings, ...patch },
					// mantém activeModel sincronizado quando model é alterado
					...(patch.model ? { activeModel: patch.model } : {}),
				})),
			sendMessage: async () => {
				const { inputMessage, messages, settings } = get();
				if (!inputMessage.trim() || get().isLoading) return;

				// Cancel any pending request before starting a new one
				_abortController?.abort();
				const controller = new AbortController();
				_abortController = controller;

				const userMsgId = `${Date.now()}-u`;
				const assistantMsgId = `${Date.now() + 1}-a`;
				const userMessage: Message = {
					id: userMsgId,
					content: inputMessage,
					role: "user",
					timestamp: new Date(),
				};

				const isFirstMessage = messages.length === 0;
				const newTitle = isFirstMessage
					? inputMessage.trim().slice(0, 40) +
						(inputMessage.trim().length > 40 ? "…" : "")
					: get().sessionTitle;

				// Build context history (last 10 messages before the current one)
				const history = messages
					.slice(-10)
					.map(({ role, content }) => ({ role, content }));

				set((state) => ({
					messages: [...state.messages, userMessage],
					inputMessage: "",
					isLoading: true,
					error: null,
					sessionTitle: newTitle,
				}));

				let streamingStarted = false;

				try {
					const response = await fetch("/api/chat", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						signal: controller.signal,
						body: JSON.stringify({
							message: userMessage.content,
							model: settings.model,
							maxTokens: settings.maxTokens,
							ollamaUrl: settings.ollamaUrl,
							history,
						}),
					});

					if (!response.ok) {
						const data = await response.json().catch(() => ({}));
						throw new Error(
							(data as { message?: string; error?: string }).message ??
								(data as { error?: string }).error ??
								"Erro ao processar solicitação",
						);
					}

					if (!response.body) throw new Error("Resposta sem corpo");

					// Add empty assistant message — will be filled token by token
					streamingStarted = true;
					set((state) => ({
						messages: [
							...state.messages,
							{
								id: assistantMsgId,
								content: "",
								role: "assistant" as const,
								timestamp: new Date(),
							},
						],
						streamingMessageId: assistantMsgId,
					}));

					const reader = response.body.getReader();
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

							if (data.error) {
								throw new Error(data.error as string);
							}

							if (data.token) {
								set((state) => ({
									messages: state.messages.map((m) =>
										m.id === assistantMsgId
											? { ...m, content: m.content + (data.token as string) }
											: m,
									),
								}));
							}

							if (data.done) {
								set({
									activeModel: (data.modelUsed as string) ?? get().activeModel,
									availableModels:
										Array.isArray(data.availableModels) &&
										(data.availableModels as string[]).length
											? (data.availableModels as string[])
											: get().availableModels,
									streamingMessageId: null,
								});
							}
						}
					}
				} catch (err) {
					if (err instanceof Error && err.name === "AbortError") {
						// User cancelled — keep partial content if any was streamed
						set({ streamingMessageId: null });
						return;
					}

					set((state) => ({
						messages: state.messages.filter((m) => {
							if (!streamingStarted) return m.id !== userMsgId;
							return m.id !== userMsgId && m.id !== assistantMsgId;
						}),
						error:
							err instanceof Error
								? err.message
								: "Ocorreu um erro desconhecido",
						inputMessage: userMessage.content,
						streamingMessageId: null,
					}));
				} finally {
					_abortController = null;
					set({ isLoading: false });
				}
			},
		}),
		{
			name: "chatbot-storage",
			partialize: (state) => ({
				messages: state.messages,
				activeModel: state.activeModel,
				sessionTitle: state.sessionTitle,
				settings: state.settings,
			}),
		},
	),
);
