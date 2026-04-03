import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "../../components/ChatInput";

// Mock do store para controlar o estado nos testes
const mockSendMessage = vi.fn();
const mockSetInputMessage = vi.fn();

let mockInputMessage = "";
let mockIsLoading = false;

vi.mock("../../store/chatStore", () => ({
	useChatStore: () => ({
		inputMessage: mockInputMessage,
		setInputMessage: mockSetInputMessage,
		sendMessage: mockSendMessage,
		isLoading: mockIsLoading,
	}),
}));

describe("ChatInput", () => {
	beforeEach(() => {
		mockInputMessage = "";
		mockIsLoading = false;
		mockSendMessage.mockReset();
		mockSetInputMessage.mockReset();
	});

	it("renderiza o textarea com placeholder correto", () => {
		render(<ChatInput />);
		expect(
			screen.getByPlaceholderText("Digite sua mensagem..."),
		).toBeInTheDocument();
	});

	it("textarea tem aria-label para acessibilidade", () => {
		render(<ChatInput />);
		expect(
			screen.getByRole("textbox", { name: /mensagem para o assistente/i }),
		).toBeInTheDocument();
	});

	it("botão de envio está desabilitado quando mensagem está vazia", () => {
		mockInputMessage = "";
		render(<ChatInput />);
		expect(
			screen.getByRole("button", { name: /enviar mensagem/i }),
		).toBeDisabled();
	});

	it("botão de envio está desabilitado durante carregamento", () => {
		mockInputMessage = "Olá";
		mockIsLoading = true;
		render(<ChatInput />);
		expect(
			screen.getByRole("button", { name: /enviando mensagem/i }),
		).toBeDisabled();
	});

	it("textarea está desabilitado durante carregamento", () => {
		mockIsLoading = true;
		render(<ChatInput />);
		expect(screen.getByRole("textbox")).toBeDisabled();
	});

	it("chama setInputMessage ao digitar", async () => {
		const user = userEvent.setup();
		render(<ChatInput />);
		const textarea = screen.getByRole("textbox");
		await user.type(textarea, "a");
		expect(mockSetInputMessage).toHaveBeenCalled();
	});

	it("chama sendMessage ao submeter o formulário", async () => {
		mockInputMessage = "Olá assistente";
		const user = userEvent.setup();
		render(<ChatInput />);
		await user.click(screen.getByRole("button", { name: /enviar mensagem/i }));
		expect(mockSendMessage).toHaveBeenCalledTimes(1);
	});

	it("não exibe contador de caracteres quando campo está vazio", () => {
		mockInputMessage = "";
		render(<ChatInput />);
		expect(screen.queryByText(/\//)).not.toBeInTheDocument();
	});

	it("exibe contador de caracteres quando há texto", () => {
		mockInputMessage = "abc";
		render(<ChatInput />);
		expect(screen.getByText("3/500")).toBeInTheDocument();
	});

	it("botão desabilitado quando ultrapassa limite de 500 chars", () => {
		mockInputMessage = "a".repeat(501);
		render(<ChatInput />);
		expect(
			screen.getByRole("button", { name: /enviar mensagem/i }),
		).toBeDisabled();
	});
});
