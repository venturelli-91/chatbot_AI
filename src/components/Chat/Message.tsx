import React from "react";

interface MessageProps {
	author: string;
	content: string;
	timestamp: string;
}

const Message: React.FC<MessageProps> = ({ author, content, timestamp }) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<h3 className="text-sm text-gray-500">{author}</h3>
				<h4 className="text-sm text-gray-500">{timestamp}</h4>
			</div>
			<div className="bg-gray-100 p-2 rounded-md">{content}</div>
		</div>
	);
};

export default Message;
