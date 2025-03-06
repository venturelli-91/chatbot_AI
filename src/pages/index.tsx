import React, { useState } from "react";
import Chat from "@/components/Chat/Chat";
import ChatInput from "@/components/Chat/ChatInput";
import { Card } from "flowbite-react";

interface MessageProps {
	author: string;
	content: string;
	timestamp: string;
}

export default function Home() {
	const [messages, setMessages] = useState<MessageProps[]>([]);

	const handleSendMessage = (message: string) => {
		setMessages([
			...messages,
			{ author: "user", content: message, timestamp: new Date().toISOString() },
		]);
	};

	return (
		<div>
			<Card className="w-64 h-24 bg-black">
				<Chat messages={messages} />
				<ChatInput onSendMessage={handleSendMessage} />
			</Card>
		</div>
	);
}
