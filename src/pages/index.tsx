import React from "react";
import { useChatStore } from "../store/chatStore";
import ChatHistory from "../components/ChatHistory";
import ChatInput from "../components/ChatInput";
import { Card } from "flowbite-react";
import { HiOutlineTrash } from "react-icons/hi";

export default function Home() {
	const { clearMessages, isLoading } = useChatStore();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto md:max-w-2xl">
				<Card className="border-0 shadow-lg overflow-hidden">
					{/* Cabeçalho do chat */}
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
						<h5 className="text-xl font-bold">Assistente AI</h5>

						<button
							onClick={clearMessages}
							disabled={isLoading}
							className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
							<HiOutlineTrash className="h-5 w-5" />
						</button>
					</div>

					{/* Área do chat */}
					<div className="p-0 relative flex flex-col">
						<ChatHistory />
						<ChatInput />
					</div>
				</Card>
			</div>
		</div>
	);
}
