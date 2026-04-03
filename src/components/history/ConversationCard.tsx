import { useRouter } from "next/router";
import { HiTrash } from "react-icons/hi";
import { Tooltip } from "flowbite-react";
import { useChatStore } from "../../store/chatStore";
import { useHistoryStore, type Session } from "../../store/historyStore";

interface ConversationCardProps {
	session: Session;
}

const ConversationCard = ({ session }: ConversationCardProps) => {
	const router = useRouter();
	const { deleteSession } = useHistoryStore();

	const loadSession = () => {
		useChatStore.setState({
			messages: session.messages,
			sessionTitle: session.title,
			activeModel: session.model,
			inputMessage: "",
			isLoading: false,
			error: null,
		});
		router.push("/");
	};

	const formattedDate = new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(session.createdAt));

	const modelName = session.model.split(":")[0];

	return (
		<div className="bg-[var(--cb2)] border border-[var(--cbr)] rounded-2xl p-5 flex flex-col gap-3 hover:border-[var(--ct4)] transition-colors">
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-[var(--ct1)] text-sm truncate">
						{session.title}
					</h3>
					<p className="text-xs text-[var(--ct4)] mt-0.5">{formattedDate}</p>
				</div>
				<Tooltip
					content="Excluir"
					placement="left">
					<button
						onClick={() => deleteSession(session.id)}
						className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--ct4)] hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
						<HiTrash className="w-4 h-4" />
					</button>
				</Tooltip>
			</div>

			<p className="text-sm text-[var(--ct3)] leading-relaxed line-clamp-2">
				{session.preview}
			</p>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-xs px-2 py-0.5 rounded-full bg-[var(--cb3)] text-[var(--ct3)] border border-[var(--cbr)]">
						{session.messages.length} mensagens
					</span>
					<span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
						{modelName}
					</span>
				</div>
				<button
					onClick={loadSession}
					className="text-xs py-1.5 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors font-medium">
					Restaurar
				</button>
			</div>
		</div>
	);
};

export default ConversationCard;
