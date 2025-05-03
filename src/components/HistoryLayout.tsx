import ChatHistory from "../tools/ChatHistory";
const HistoryLayout: React.FC = () => {
	return (
		<>
			<div className="flex flex-col h-full">
				<div className="flex-1 overflow-y-auto px-4 py-4 h-[400px] bg-blue-50/50">
					<ChatHistory />
				</div>
			</div>
		</>
	);
};
export default HistoryLayout;
