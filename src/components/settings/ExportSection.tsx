import { useChatStore } from "../../store/chatStore";

const ExportSection = () => {
	const { messages, sessionTitle } = useChatStore();

	const getFilename = (ext: string) => {
		const base = sessionTitle
			? sessionTitle.replace(/[^a-z0-9]/gi, "_").slice(0, 30)
			: new Intl.DateTimeFormat("pt-BR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
			  })
					.format(new Date())
					.replace(/\//g, "-");
		return `chat_${base}.${ext}`;
	};

	const downloadBlob = (content: string, type: string, filename: string) => {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const exportJSON = () => {
		downloadBlob(
			JSON.stringify(messages, null, 2),
			"application/json",
			getFilename("json")
		);
	};

	const exportTxt = () => {
		const text = messages
			.map((m) => {
				const time = new Intl.DateTimeFormat("pt-BR", {
					hour: "2-digit",
					minute: "2-digit",
				}).format(new Date(m.timestamp));
				const role = m.role === "user" ? "Usuário" : "Assistente";
				return `[${time}] ${role}:\n${m.content}`;
			})
			.join("\n\n");
		downloadBlob(text, "text/plain;charset=utf-8", getFilename("txt"));
	};

	const disabled = messages.length === 0;

	return (
		<div className="flex gap-3">
			<button
				onClick={exportJSON}
				disabled={disabled}
				className="flex-1 py-2 px-4 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-sm hover:border-violet-500/30 hover:text-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
				Exportar como JSON
			</button>
			<button
				onClick={exportTxt}
				disabled={disabled}
				className="flex-1 py-2 px-4 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-sm hover:border-violet-500/30 hover:text-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
				Exportar como .txt
			</button>
		</div>
	);
};

export default ExportSection;
