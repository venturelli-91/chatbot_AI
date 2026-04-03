import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
}

interface ChatState {
	messages: Message[];
	inputMessage: string;
	isLoading: boolean;
	error: string | null;
	activeModel: string;
	availableModels: string[];
	sessionTitle: string | null;

	setInputMessage: (message: string) => void;
	sendMessage: () => Promise<void>;
	clearMessages: () => void;
	clearError: () => void;
}

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

			setInputMessage: (inputMessage) => set({ inputMessage }),

			clearError: () => set({ error: null }),

			clearMessages: () =>
				set({ messages: [], error: null, sessionTitle: null }),

			sendMessage: async () => {
				const { inputMessage, messages } = get();
				if (!inputMessage.trim()) return;

				const userMessage: Message = {
					id: Date.now().toString(),
					content: inputMessage,
					role: "user",
					timestamp: new Date(),
				};

				const isFirstMessage = messages.length === 0;
				const newTitle = isFirstMessage
					? inputMessage.trim().slice(0, 40) +
					  (inputMessage.trim().length > 40 ? "…" : "")
					: get().sessionTitle;

				set((state) => ({
					messages: [...state.messages, userMessage],
					inputMessage: "",
					isLoading: true,
					error: null,
					sessionTitle: newTitle,
				}));

				try {
					const response = await fetch("/api/chat", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							message: userMessage.content,
							model: "mistral",
							maxTokens: 300,
						}),
					});

					const data = await response.json();

					if (!response.ok) {
						throw new Error(
							data.message || data.error || "Erro ao processar solicitação"
						);
					}

					set({
						activeModel: data.modelUsed ?? get().activeModel,
						availableModels: data.availableModels?.length
							? data.availableModels
							: get().availableModels,
					});

					const assistantMessage: Message = {
						id: (Date.now() + 1).toString(),
						content: data.response,
						role: "assistant",
						timestamp: new Date(),
					};

					set((state) => ({
						messages: [...state.messages, assistantMessage],
					}));
				} catch (err) {
					set({
						error:
							err instanceof Error
								? err.message
								: "Ocorreu um erro desconhecido",
					});
				} finally {
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
			}),
		}
	)
);
