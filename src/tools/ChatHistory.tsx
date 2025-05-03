import React, { useRef, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import ChatMessage from "../tools/ChatMessage";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

const ChatHistory: React.FC = () => {
	const { messages, error } = useChatStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex-1 overflow-y-auto px-4 py-4 h-[400px]">
			{messages.length === 0 ? (
				<div className="h-full flex flex-col items-center justify-center text-gray-500">
					<p className="text-center font-medium">
						Envie uma mensagem para começar a conversa
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{messages.map((message) => (
						<ChatMessage
							key={message.id}
							content={message.content}
							role={message.role}
							timestamp={message.timestamp}
						/>
					))}
				</div>
			)}

			{error && (
				<Alert
					color="failure"
					icon={HiInformationCircle}
					className="mt-4">
					<span className="font-medium">Erro!</span> {error}
				</Alert>
			)}

			<div ref={messagesEndRef} />
		</div>
	);
};

export default ChatHistory;
