import { useChatStore } from "../store/chatStore";

const ChatSessionBar = () => {
	const { sessionTitle } = useChatStore();

	if (!sessionTitle) return null;

	return (
		<div className="h-8 px-5 flex items-center border-b border-white/5 bg-slate-900/50 shrink-0">
			<span className="text-xs text-slate-500 truncate">{sessionTitle}</span>
		</div>
	);
};

export default ChatSessionBar;
