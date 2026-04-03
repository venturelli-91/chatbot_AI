import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";

const AppWrapper = () => {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">
			<div className="w-full max-w-2xl h-[calc(100vh-2rem)] max-h-[820px] flex flex-col bg-slate-900 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden border border-white/10">
				<ChatHeader />
				<div className="flex-1 overflow-y-auto">
					<ChatHistory />
				</div>
				<ChatInput />
			</div>
		</div>
	);
};

export default AppWrapper;
