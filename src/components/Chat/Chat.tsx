import React from "react";
import Message from "./Message";

interface MessageProps {
	author: string;
	content: string;
	timestamp: string;
}
interface ChatProps {
	messages: MessageProps[];
}
const Chat: React.FC<ChatProps> = ({ messages }) => {
	return (
		<div>
			{messages.map((msg, index) => (
				<Message
					key={index}
					{...msg}
				/>
			))}
		</div>
	);
};

export default Chat;
