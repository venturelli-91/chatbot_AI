import { HiSparkles } from "react-icons/hi2";

const ChatHeader = () => {
	return (
		<div className="flex items-center gap-3 px-5 py-4 bg-slate-900 border-b border-white/10 shrink-0">
			<div className="relative">
				<div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
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
	);
};

export default ChatHeader;
