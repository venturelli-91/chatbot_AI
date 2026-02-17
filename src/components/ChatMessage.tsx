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
		<div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
			<div
				className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
					isUser
						? "bg-blue-500 text-white rounded-tr-none"
						: "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-tl-none"
				}`}>
				<div className="whitespace-pre-wrap">{message.content}</div>
				<div
					className={`text-xs mt-1 flex justify-end ${
						isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-300"
					}`}>
					{formattedTime}
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
