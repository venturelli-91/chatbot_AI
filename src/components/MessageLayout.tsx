import React from "react";
import ChatMessage from "../tools/ChatMessage";

const MessageLayout: React.FC = () => {
	return (
		<>
			<ChatMessage
				content="Olá, como posso ajudar?"
				role="assistant"
				timestamp={new Date()}
			/>
		</>
	);
};

export default MessageLayout;
