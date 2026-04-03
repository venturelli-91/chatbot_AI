import ChatHeader from "./ChatHeader";
import ChatSessionBar from "./ChatSessionBar";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";

const AppWrapper = () => {
	return (
		<div className="w-full h-full flex flex-col bg-[var(--cb2)] overflow-hidden">
			<ChatHeader />
			<ChatSessionBar />
			<div className="flex-1 overflow-y-auto">
				<ChatHistory />
			</div>
			<ChatInput />
		</div>
	);
};

export default AppWrapper;
