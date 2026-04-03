import { useRef, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { HiPaperAirplane } from "react-icons/hi";
import { HiStopCircle } from "react-icons/hi2";

const MAX_CHARS = 500;

const ChatInput = () => {
	const { inputMessage, setInputMessage, sendMessage, cancelMessage, isLoading } =
		useChatStore();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const charCount = inputMessage.length;
	const overLimit = charCount > MAX_CHARS;

	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, [inputMessage]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (overLimit) return;
		sendMessage();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (overLimit) return;
			sendMessage();
		}
	};

	const counterColor =
		charCount >= 490
			? "text-red-400"
			: charCount >= 400
				? "text-amber-400"
				: "text-[var(--ct4)]";

	return (
		<div className="px-5 py-4 bg-[var(--cb2)] border-t border-[var(--cbr)] shrink-0">
			<form onSubmit={handleSubmit}>
				<div className="flex items-end gap-3 bg-[var(--cb3)] rounded-xl px-4 py-3 border border-[var(--cbr)] focus-within:border-violet-500/50 transition-colors">
					<textarea
						ref={textareaRef}
						rows={1}
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Digite sua mensagem..."
						aria-label="Mensagem para o assistente"
						aria-describedby="char-counter"
						className="flex-1 bg-transparent text-[var(--ct1)] placeholder-[var(--ct4)] text-sm focus:outline-none resize-none overflow-y-auto max-h-32 leading-relaxed"
						disabled={isLoading}
					/>
					<div className="flex items-center gap-2 shrink-0 pb-0.5">
						{charCount > 0 && (
							<span
								id="char-counter"
								aria-live="polite"
								aria-label={`${charCount} de ${MAX_CHARS} caracteres`}
								className={`text-xs tabular-nums ${counterColor}`}>
								{charCount}/{MAX_CHARS}
							</span>
						)}
					{isLoading ? (
						<button
							type="button"
							onClick={cancelMessage}
							aria-label="Cancelar resposta"
							className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all">
							<HiStopCircle className="w-4 h-4" />
						</button>
					) : (
						<button
							type="submit"
							disabled={!inputMessage.trim() || overLimit}
							aria-label="Enviar mensagem"
							className="w-9 h-9 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30">
							<HiPaperAirplane className="w-4 h-4" />
						</button>
					)}
					</div>
				</div>
			</form>
		</div>
	);
};

export default ChatInput;
