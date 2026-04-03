import ChatHeader from "../components/ChatHeader";
import ChatHistory from "../components/ChatHistory";
import ChatInput from "../components/ChatInput";
import { useChatStore } from "../store/chatStore";

export default function Home() {
	const { sessionTitle } = useChatStore();
	return (
		<div className="w-full h-full flex flex-col bg-[var(--cb2)] overflow-hidden">
			<ChatHeader />
			{sessionTitle && (
				<div className="h-8 px-5 flex items-center border-b border-[var(--cbr)] bg-[var(--cb2)]/50 shrink-0">
					<span className="text-xs text-[var(--ct4)] truncate">{sessionTitle}</span>
				</div>
			)}
			<div className="flex-1 overflow-y-auto">
				<ChatHistory />
			</div>
			<ChatInput />
		</div>
	);
}
