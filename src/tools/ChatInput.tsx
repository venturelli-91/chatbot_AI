import React from "react";
import { useChatStore } from "../store/chatStore";
import { Button } from "flowbite-react";
import { HiPaperAirplane } from "react-icons/hi";

const ChatInput: React.FC = () => {
	const { inputMessage, setInputMessage, sendMessage, isLoading } =
		useChatStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sendMessage();
	};

	return (
		<div className="sticky bottom-0 p-3 bg-white dark:bg-gray-800">
			<form onSubmit={handleSubmit}>
				<div className="flex items-center gap-2">
					<div className="relative flex-grow">
						<input
							type="text"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							placeholder="Digite sua mensagem..."
							className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
							disabled={isLoading}
						/>
					</div>
					<Button
						type="submit"
						disabled={isLoading}
						className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
						<HiPaperAirplane className="h-5 w-5" />
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ChatInput;
