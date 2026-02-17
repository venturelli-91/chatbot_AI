import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";

const AppWrapper = () => {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-white">
			<div className="w-full max-w-[500px] flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="flex-1 overflow-y-auto bg-gray-50">
					<ChatHistory />
				</div>
				<ChatInput />
			</div>
		</div>
	);
};

export default AppWrapper;
