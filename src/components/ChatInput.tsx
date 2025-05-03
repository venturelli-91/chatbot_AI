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
		<div className="sticky bottom-0 bg-white border-t border-blue-100 p-3">
			<form onSubmit={handleSubmit}>
				<div className="flex items-center gap-2">
					<div className="relative flex-grow">
						<input
							type="text"
							value={inputMessage}
							onChange={(e) => setInputMessage(e.target.value)}
							placeholder="Digite sua mensagem..."
							className="w-full rounded-full border-blue-200 bg-blue-50/30 pl-4 pr-12 py-2.5 focus:border-blue-500 focus:ring-blue-400"
							disabled={isLoading}
						/>
					</div>
					<Button
						type="submit"
						disabled={isLoading || !inputMessage.trim()}
						color="blue"
						pill
						size="sm"
						className="flex items-center justify-center p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
						<HiPaperAirplane
							className={`h-5 w-5 ${isLoading ? "animate-pulse" : ""}`}
						/>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ChatInput;
