import { create } from "zustand";

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

	setInputMessage: (message: string) => void;
	sendMessage: () => Promise<void>;
	clearMessages: () => void;
	clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
	messages: [],
	inputMessage: "",
	isLoading: false,
	error: null,
	activeModel: "mistral",
	availableModels: [],

	setInputMessage: (inputMessage) => set({ inputMessage }),

	clearError: () => set({ error: null }),

	clearMessages: () => set({ messages: [], error: null }),

	sendMessage: async () => {
		const { inputMessage } = get();
		if (!inputMessage.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputMessage,
			role: "user",
			timestamp: new Date(),
		};

		set((state) => ({
			messages: [...state.messages, userMessage],
			inputMessage: "",
			isLoading: true,
			error: null,
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
}));
