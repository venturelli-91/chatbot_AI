import { HiSparkles } from "react-icons/hi2";
import { HiTrash } from "react-icons/hi";
import { Tooltip } from "flowbite-react";
import { useChatStore } from "../store/chatStore";

const ChatHeader = () => {
	const { messages, clearMessages } = useChatStore();
	const hasMessages = messages.length > 0;

	return (
		<div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-white/10 shrink-0">
			<div className="flex items-center gap-3">
				<div className="relative">
					<div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
						<HiSparkles className="w-5 h-5 text-white" />
					</div>
					<span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
				</div>
				<div className="flex flex-col">
					<span className="font-semibold text-slate-100 text-sm leading-tight">
						AI Assistant
					</span>
					<span className="text-xs text-emerald-400 font-medium">Online</span>
				</div>
			</div>

			<Tooltip content="Limpar conversa" placement="left">
				<button
					onClick={clearMessages}
					disabled={!hasMessages}
					className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-400 disabled:hover:bg-transparent">
					<HiTrash className="w-4 h-4" />
				</button>
			</Tooltip>
		</div>
	);
};

export default ChatHeader;
