import { useChatStore } from "../store/chatStore";
import { HiPaperAirplane } from "react-icons/hi";

const ChatInput = () => {
	const { inputMessage, setInputMessage, sendMessage, isLoading } =
		useChatStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sendMessage();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<div className="px-5 py-4 bg-slate-900 border-t border-white/10 shrink-0">
			<form onSubmit={handleSubmit}>
				<div className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3 border border-white/10 focus-within:border-violet-500/50 transition-colors">
					<input
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Digite sua mensagem..."
						className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
						disabled={isLoading}
					/>
					<button
						type="submit"
						disabled={isLoading || !inputMessage.trim()}
						className="shrink-0 w-9 h-9 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30">
						{isLoading ? (
							<svg
								className="w-4 h-4 animate-spin"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								/>
							</svg>
						) : (
							<HiPaperAirplane className="w-4 h-4" />
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatInput;
