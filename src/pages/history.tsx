import { HiClockRotateLeft } from "react-icons/hi2";
import { useHistoryStore } from "../store/historyStore";
import ConversationCard from "../components/history/ConversationCard";

export default function HistoryPage() {
	const { sessions } = useHistoryStore();

	return (
		<div className="h-full overflow-y-auto bg-slate-950">
			<div className="max-w-2xl mx-auto py-8 px-6 flex flex-col gap-5">
				<div>
					<h1 className="text-xl font-bold text-slate-100">Histórico</h1>
					<p className="text-sm text-slate-400 mt-1">
						Conversas salvas automaticamente ao limpar o chat
					</p>
				</div>

				{sessions.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-500">
						<div className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
							<HiClockRotateLeft className="w-7 h-7" />
						</div>
						<div className="text-center">
							<p className="font-semibold text-slate-300 mb-1">
								Nenhuma conversa salva
							</p>
							<p className="text-sm">
								As conversas são salvas ao clicar em &quot;Limpar conversa&quot;
							</p>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{sessions.map((session) => (
							<ConversationCard key={session.id} session={session} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
