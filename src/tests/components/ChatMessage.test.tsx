import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatMessage from "../../components/ChatMessage";
import type { Message } from "../../store/chatStore";

// Tooltip do flowbite precisa de mock pois depende de DOM avançado
vi.mock("flowbite-react", () => ({
	Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
	id: "1",
	content: "Olá, mundo!",
	role: "user",
	timestamp: new Date("2024-01-01T10:30:00").toISOString(),
	...overrides,
});

describe("ChatMessage", () => {
	it("renderiza conteúdo da mensagem do usuário", () => {
		render(<ChatMessage message={makeMessage()} />);
		expect(screen.getByText("Olá, mundo!")).toBeInTheDocument();
	});

	it("renderiza conteúdo da mensagem do assistente", () => {
		render(
			<ChatMessage
				message={makeMessage({
					role: "assistant",
					content: "Como posso ajudar?",
				})}
			/>,
		);
		expect(screen.getByText("Como posso ajudar?")).toBeInTheDocument();
	});

	it("tem aria-label correto para mensagem do usuário", () => {
		render(<ChatMessage message={makeMessage({ role: "user" })} />);
		const article = screen.getByRole("article");
		expect(article).toHaveAttribute(
			"aria-label",
			expect.stringContaining("você"),
		);
	});

	it("tem aria-label correto para mensagem do assistente", () => {
		render(<ChatMessage message={makeMessage({ role: "assistant" })} />);
		const article = screen.getByRole("article");
		expect(article).toHaveAttribute(
			"aria-label",
			expect.stringContaining("assistente"),
		);
	});

	it("mostra botão de copiar apenas para mensagens do assistente", () => {
		const { rerender } = render(
			<ChatMessage message={makeMessage({ role: "user" })} />,
		);
		expect(
			screen.queryByRole("button", { name: /copiar/i }),
		).not.toBeInTheDocument();

		rerender(<ChatMessage message={makeMessage({ role: "assistant" })} />);
		expect(
			screen.getByRole("button", { name: /copiar mensagem/i }),
		).toBeInTheDocument();
	});

	it("copia conteúdo ao clicar no botão copiar", async () => {
		const user = userEvent.setup();
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

		render(
			<ChatMessage
				message={makeMessage({ role: "assistant", content: "Texto a copiar" })}
			/>,
		);

		await user.click(screen.getByRole("button", { name: /copiar mensagem/i }));

		expect(writeText).toHaveBeenCalledWith("Texto a copiar");
		expect(
			await screen.findByRole("button", { name: /mensagem copiada/i }),
		).toBeInTheDocument();
	});

	it("aceita timestamp como string ISO", () => {
		render(
			<ChatMessage
				message={makeMessage({
					timestamp: "2024-01-01T14:00:00",
				})}
			/>,
		);
		// não deve lançar erro e deve renderizar o conteúdo
		expect(screen.getByText("Olá, mundo!")).toBeInTheDocument();
	});
});
