import React from "react";
import { useChatStore } from "../store/chatStore";

const MessageLayout: React.FC = () => {
	const { isLoading } = useChatStore();

	if (isLoading) {
		return (
			<div className="text-center text-sm text-gray-400 mt-2">
				Processando resposta...
			</div>
		);
	}

	return null;
};

export default MessageLayout;
