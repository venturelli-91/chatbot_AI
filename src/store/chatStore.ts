import { create } from "zustand";

interface Message {
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

	setInputMessage: (message: string) => void;
	addMessage: (role: "user" | "assistant", content: string) => void;
	clearMessages: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	sendMessage: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
	messages: [],
	inputMessage: "",
	isLoading: false,
	error: null,

	setInputMessage: (message) => set({ inputMessage: message }),

	addMessage: (role, content) =>
		set((state) => ({
			messages: [
				...state.messages,
				{
					id: Date.now().toString(),
					content,
					role,
					timestamp: new Date(),
				},
			],
		})),

	clearMessages: () => set({ messages: [] }),

	setLoading: (loading) => set({ isLoading: loading }),

	setError: (error) => set({ error }),

	sendMessage: async () => {
		const { inputMessage } = get();

		if (!inputMessage.trim()) return;

		get().addMessage("user", inputMessage);
		get().setLoading(true);
		get().setError(null);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: inputMessage,
					model: "gpt-3.5-turbo",
					maxTokens: 300,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.message || data.error || "Erro ao processar solicitação"
				);
			}

			get().addMessage("assistant", data.response);

			get().setInputMessage("");
		} catch (err) {
			get().setError(
				err instanceof Error ? err.message : "Ocorreu um erro desconhecido"
			);
		} finally {
			get().setLoading(false);
		}
	},
}));
