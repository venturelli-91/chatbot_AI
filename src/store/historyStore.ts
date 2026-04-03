import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "./chatStore";

export interface Session {
	id: string;
	title: string;
	preview: string;
	messages: Message[];
	createdAt: string;
	model: string;
}

interface HistoryState {
	sessions: Session[];
	saveSession: (session: Session) => void;
	deleteSession: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
	persist(
		(set) => ({
			sessions: [],

			saveSession: (session) =>
				set((state) => ({
					sessions: [session, ...state.sessions].slice(0, 50),
				})),

			deleteSession: (id) =>
				set((state) => ({
					sessions: state.sessions.filter((s) => s.id !== id),
				})),
		}),
		{ name: "chatbot-history" }
	)
);
