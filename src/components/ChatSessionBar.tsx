import { useChatStore } from "../store/chatStore";

const ChatSessionBar = () => {
	const { sessionTitle } = useChatStore();

	if (!sessionTitle) return null;

	return (
		<div className="h-8 px-5 flex items-center border-b border-[var(--cbr)] bg-[var(--cb2)]/50 shrink-0">
			<span className="text-xs text-[var(--ct4)] truncate">{sessionTitle}</span>
		</div>
	);
};

export default ChatSessionBar;
