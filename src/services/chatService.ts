export const getMessages = async (message: string) => {
	const response = await fetch("/api/chat", {
		method: "POST",
		body: JSON.stringify({ message }),
	});
	return response.json();
};
