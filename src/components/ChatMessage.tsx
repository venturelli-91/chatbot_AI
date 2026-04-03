import { memo, useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { HiUser, HiClipboard, HiCheck } from "react-icons/hi";
import { Tooltip } from "flowbite-react";
import type { Message } from "../store/chatStore";

interface ChatMessageProps {
	message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
	const [copied, setCopied] = useState(false);

	const formattedTime = new Intl.DateTimeFormat("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	}).format(
		typeof message.timestamp === "string"
			? new Date(message.timestamp)
			: message.timestamp,
	);

	const isUser = message.role === "user";

	const handleCopy = () => {
		navigator.clipboard.writeText(message.content);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className={`flex gap-3 message-enter ${isUser ? "flex-row-reverse" : "flex-row"}`}
			role="article"
			aria-label={`Mensagem de ${isUser ? "você" : "assistente"} às ${formattedTime}`}>
			<div
				className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
					isUser
						? "bg-violet-600"
						: "bg-linear-to-br from-violet-600 to-indigo-600"
				} shadow-md`}>
				{isUser ? (
					<HiUser className="w-4 h-4 text-white" />
				) : (
					<HiSparkles className="w-4 h-4 text-white" />
				)}
			</div>

			<div
				className={`max-w-[75%] flex flex-col gap-1 ${
					isUser ? "items-end" : "items-start"
				}`}>
				<div className="relative group">
					<div
						className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
							isUser
								? "bg-linear-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm"
								: "bg-[var(--cb3)] text-[var(--ct1)] border border-[var(--cbr)] rounded-tl-sm"
						}`}>
						<p className="whitespace-pre-wrap">{message.content}</p>
					</div>

					{!isUser && (
						<Tooltip
							content={copied ? "Copiado!" : "Copiar"}
							placement="top">
							<button
								onClick={handleCopy}
								aria-label={copied ? "Mensagem copiada" : "Copiar mensagem"}
								className="absolute -top-2 -right-2 w-6 h-6 rounded-md bg-[var(--cb3)] border border-[var(--cbr)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
								{copied ? (
									<HiCheck className="w-3 h-3 text-emerald-400" />
								) : (
									<HiClipboard className="w-3 h-3 text-slate-300" />
								)}
							</button>
						</Tooltip>
					)}
				</div>

				<span className="text-xs text-[var(--ct4)] px-1">{formattedTime}</span>
			</div>
		</div>
	);
};

export default memo(ChatMessage);
