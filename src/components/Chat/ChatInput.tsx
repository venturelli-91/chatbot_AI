import React, { useState } from "react";
import { Button } from "flowbite-react";

const ChatInput = () => {
	const [message, setMessage] = useState("");

	return (
		<div className="flex items-center justify-center h-screen">
			<input
				type="text"
				value={message}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setMessage(e.target.value)
				}
				className="border rounded p-2"
			/>
			<Button
				type="submit"
				onClick={() => {}}>
				Enviar
			</Button>
		</div>
	);
};

export default ChatInput;
