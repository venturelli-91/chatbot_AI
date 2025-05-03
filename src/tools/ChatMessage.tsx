import React from "react";

interface ChatMessageProps {
	content: string;
	role: string;
	timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
	content,
	role,
	timestamp,
}) => {
	const formattedTime = new Intl.DateTimeFormat("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	}).format(typeof timestamp === "string" ? new Date(timestamp) : timestamp);

	const isUser = role === "user";

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
			<div
				className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
					isUser
						? "bg-blue-500 text-white rounded-tr-none"
						: "bg-white text-gray-800 rounded-tl-none"
				}`}>
				<div className="whitespace-pre-wrap">{content}</div>
				<div
					className={`text-xs mt-1 flex justify-end ${
						isUser ? "text-blue-100" : "text-gray-500"
					}`}>
					{formattedTime}
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
