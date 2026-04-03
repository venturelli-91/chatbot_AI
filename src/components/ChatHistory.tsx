import { useRef, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import ChatMessage from "./ChatMessage";
import { HiSparkles } from "react-icons/hi2";
import { HiXMark } from "react-icons/hi2";

const ChatHistory = () => {
	const { messages, error, clearError } = useChatStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex flex-col min-h-full px-5 py-6">
			{messages.length === 0 ? (
				<div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400 py-16">
					<div className="w-16 h-16 rounded-full bg-linear-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
						<HiSparkles className="w-7 h-7 text-violet-400" />
					</div>
					<div className="text-center">
						<p className="font-semibold text-slate-200 mb-1">
							Como posso ajudar?
						</p>
						<p className="text-sm">Envie uma mensagem para começar</p>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-5">
					{messages.map((message) => (
						<ChatMessage key={message.id} message={message} />
					))}
				</div>
			)}

			{error && (
				<div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between gap-3">
					<span>
						<span className="font-semibold">Erro:</span> {error}
					</span>
					<button
						onClick={clearError}
						className="shrink-0 w-5 h-5 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors">
						<HiXMark className="w-4 h-4" />
					</button>
				</div>
			)}

			<div ref={messagesEndRef} />
		</div>
	);
};

export default ChatHistory;
