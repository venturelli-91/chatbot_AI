import { useChatStore } from "../store/chatStore";
import { HiSparkles } from "react-icons/hi2";

const SUGGESTIONS = [
	"Explique um conceito difícil de forma simples",
	"Escreva um e-mail profissional para mim",
	"Me ajude a debugar este código",
	"Crie um plano de estudos para mim",
];

const WelcomeSuggestions = () => {
	const { setInputMessage, sendMessage } = useChatStore();

	const handleSuggestion = (prompt: string) => {
		setInputMessage(prompt);
		sendMessage();
	};

	return (
		<div className="flex-1 flex flex-col items-center justify-center gap-6 py-12 px-2">
			<div className="flex flex-col items-center gap-3">
				<div className="w-16 h-16 rounded-full bg-linear-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
					<HiSparkles className="w-7 h-7 text-violet-400" />
				</div>
				<div className="text-center">
					<p className="font-semibold text-[var(--ct1)] mb-1">
						Como posso ajudar?
					</p>
					<p className="text-sm text-[var(--ct3)]">
						Envie uma mensagem ou escolha uma sugestão
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2 w-full max-w-md">
				{SUGGESTIONS.map((prompt) => (
					<button
						key={prompt}
						onClick={() => handleSuggestion(prompt)}
						className="bg-[var(--cb3)]/60 border border-[var(--cbr)] rounded-xl p-3 text-left text-sm text-[var(--ct2)] hover:bg-[var(--cb3)] hover:border-violet-500/30 hover:text-[var(--ct1)] transition-all leading-snug">
						{prompt}
					</button>
				))}
			</div>
		</div>
	);
};

export default WelcomeSuggestions;
