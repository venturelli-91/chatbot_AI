import React, { useState, useEffect } from "react";
import Message from "./Message";

interface ChatProps {
	messages: {
		author: string;
		content: string;
		timestamp: string;
	}[];
}
