import { useRef, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import ChatMessage from "./ChatMessage";
import WelcomeSuggestions from "./WelcomeSuggestions";
import { HiSparkles, HiXMark } from "react-icons/hi2";

const ChatHistory = () => {
	const { messages, isLoading, error, clearError } = useChatStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex flex-col min-h-full px-5 py-6">
			{messages.length === 0 ? (
				<WelcomeSuggestions />
			) : (
				<div
					className="flex flex-col gap-5"
					role="log"
					aria-live="polite"
					aria-label="Histórico de mensagens"
					aria-relevant="additions">
					{messages.map((message) => (
						<ChatMessage
							key={message.id}
							message={message}
						/>
					))}
					{isLoading && (
						<div className="flex gap-3">
							<div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
								<HiSparkles className="w-4 h-4 text-white" />
							</div>
							<div className="px-4 py-3 bg-[var(--cb3)] border border-[var(--cbr)] rounded-2xl rounded-tl-sm flex items-center gap-1.5">
								{[0, 150, 300].map((delay) => (
									<span
										key={delay}
										className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
										style={{ animationDelay: `${delay}ms` }}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{error && (
				<div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between gap-3">
					<span>
						<span className="font-semibold">Erro:</span> {error}
					</span>
					<button
						onClick={clearError}					aria-label="Fechar mensagem de erro"						className="shrink-0 w-5 h-5 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors">
						<HiXMark className="w-4 h-4" />
					</button>
				</div>
			)}

			<div ref={messagesEndRef} />
		</div>
	);
};

export default ChatHistory;
