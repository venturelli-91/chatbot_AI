import { HiSparkles } from "react-icons/hi2";
import { HiUser } from "react-icons/hi";
import type { Message } from "../store/chatStore";

interface ChatMessageProps {
	message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
	const formattedTime = new Intl.DateTimeFormat("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	}).format(
		typeof message.timestamp === "string"
			? new Date(message.timestamp)
			: message.timestamp
	);

	const isUser = message.role === "user";

	return (
		<div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
			<div
				className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
					isUser
						? "bg-violet-600"
						: "bg-linear-to-br from-violet-600 to-indigo-600"
				} shadow-md`}>
				{isUser ? (
					<HiUser className="w-4 h-4 text-white" />
				) : (
					<HiSparkles className="w-4 h-4 text-white" />
				)}
			</div>

			<div
				className={`max-w-[75%] flex flex-col gap-1 ${
					isUser ? "items-end" : "items-start"
				}`}>
				<div
					className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
						isUser
							? "bg-linear-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm"
							: "bg-slate-800 text-slate-100 border border-white/10 rounded-tl-sm"
					}`}>
					<p className="whitespace-pre-wrap">{message.content}</p>
				</div>
				<span className="text-xs text-slate-500 px-1">{formattedTime}</span>
			</div>
		</div>
	);
};

export default ChatMessage;
