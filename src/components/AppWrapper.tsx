import React from "react";
import ChatHistory from "../tools/ChatHistory";
import InputLayout from "./InputLayout";
import MessageLayout from "./MessageLayout";

const AppWrapper: React.FC = () => {
	return (
		<>
			<div className="flex flex-col h-full">
				<div className="flex-1 overflow-y-auto px-4 py-4 h-[400px] bg-blue-50/50">
					<ChatHistory />
					<MessageLayout />
				</div>
				<InputLayout />
			</div>
		</>
	);
};

export default AppWrapper;
