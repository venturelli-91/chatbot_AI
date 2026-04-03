import { HiSparkles } from "react-icons/hi2";
import { HiTrash } from "react-icons/hi";
import { Tooltip } from "flowbite-react";
import { useChatStore } from "../store/chatStore";

const ChatHeader = () => {
	const { messages, clearMessages, activeModel } = useChatStore();
	const hasMessages = messages.length > 0;

	return (
		<div className="flex items-center justify-between px-5 py-4 bg-[var(--cb2)] border-b border-[var(--cbr)] shrink-0">
			<div className="flex items-center gap-3">
				<div className="relative">
					<div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
						<HiSparkles className="w-5 h-5 text-white" />
					</div>
					<span
						className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"
						aria-hidden="true"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<span className="font-semibold text-[var(--ct1)] text-sm leading-tight">
						AI Assistant
					</span>
					<div className="flex items-center gap-2">
						<span className="text-xs text-emerald-400 font-medium">Online</span>
					<span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">
						{activeModel.split(":")[0]}
					</span>
					</div>
				</div>
			</div>

			<Tooltip
				content="Limpar conversa"
				placement="left">
				<button
					onClick={clearMessages}
					disabled={!hasMessages}
					aria-label="Limpar conversa"
					className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--ct3)] hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[var(--ct3)] disabled:hover:bg-transparent">
					<HiTrash className="w-4 h-4" />
				</button>
			</Tooltip>
		</div>
	);
};

export default ChatHeader;
