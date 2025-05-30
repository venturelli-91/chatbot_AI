import React from "react";
import ChatHistory from "../tools/ChatHistory";
import InputLayout from "./InputLayout";
import MessageLayout from "./MessageLayout";

const AppWrapper: React.FC = () => {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-white">
			<div className="w-[500px] flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="flex-1 overflow-y-auto px-4 py-4 h-[300px] bg-gray-50">
					<ChatHistory />
					<MessageLayout />
				</div>
				<InputLayout />
			</div>
		</div>
	);
};

export default AppWrapper;
