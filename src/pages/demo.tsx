import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import {
	HiSparkles,
	HiArrowLeft,
	HiPaperAirplane,
	HiArrowRight,
	HiCpuChip,
} from "react-icons/hi2";
import { HiUser } from "react-icons/hi";
import ThemeToggle from "../components/ThemeToggle";

// ─── demo scenarios ────────────────────────────────────────────────────────────

interface DemoConversation {
	id: string;
	label: string;
	model: string;
	color: string;
	messages: { role: "user" | "assistant"; text: string }[];
}

const DEMO_CONVERSATIONS: DemoConversation[] = [
	{
		id: "code",
		label: "Código",
		model: "mistral",
		color: "from-violet-600 to-indigo-600",
		messages: [
			{ role: "user", text: "Como faço um debounce em TypeScript?" },
			{
				role: "assistant",
				text: `function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Uso:
const handleSearch = debounce((q: string) => {
  console.log("Buscando:", q);
}, 300);`,
			},
		],
	},
	{
		id: "criativo",
		label: "Criativo",
		model: "llama3",
		color: "from-pink-600 to-rose-600",
		messages: [
			{ role: "user", text: "Escreva um haiku sobre inteligência artificial" },
			{
				role: "assistant",
				text: `Bits em silêncio —
a máquina aprende a ver
o que o homem sonhou.`,
			},
		],
	},
	{
		id: "analise",
		label: "Análise",
		model: "gemma",
		color: "from-sky-600 to-cyan-600",
		messages: [
			{
				role: "user",
				text: "Quais são os riscos do AI Act da União Européia?",
			},
			{
				role: "assistant",
				text: `**Principais riscos identificados:**

1. **Fragmentação regulatória** — Empresas fora da UE podem manter vantagem competitiva operando sem conformidade.

2. **Custo de compliance** — PMEs têm dificuldade em arcar com auditorias e documentação exigida para sistemas de alto risco.

3. **Definição ampla de "alto risco"** — Inclui aplicações de saúde, educação e infraestrutura crítica, criando zonas de incerteza.

4. **Velocidade de regulação vs. inovação** — O ritmo legislativo não acompanha a evolução dos modelos.`,
			},
		],
	},
];

// ─── streaming hook ────────────────────────────────────────────────────────────

function useTypingEffect(text: string, active: boolean, speed = 12) {
	const [displayed, setDisplayed] = useState("");
	const [done, setDone] = useState(false);

	useEffect(() => {
		if (!active) {
			setDisplayed(text);
			setDone(true);
			return;
		}
		setDisplayed("");
		setDone(false);
		let i = 0;
		const interval = setInterval(() => {
			i += speed;
			if (i >= text.length) {
				setDisplayed(text);
				setDone(true);
				clearInterval(interval);
			} else {
				setDisplayed(text.slice(0, i));
			}
		}, 16);
		return () => clearInterval(interval);
	}, [text, active, speed]);

	return { displayed, done };
}

// ─── sub-components ─────────────────────────────────────────────────────────

function TypingMessage({ text, animate }: { text: string; animate: boolean }) {
	const { displayed, done } = useTypingEffect(text, animate);
	return (
		<span className="whitespace-pre-wrap">
			{displayed}
			{!done && (
				<span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" />
			)}
		</span>
	);
}

interface MessageBubbleProps {
	role: "user" | "assistant";
	text: string;
	animate?: boolean;
	accentClass: string;
}

function MessageBubble({
	role,
	text,
	animate = false,
	accentClass,
}: MessageBubbleProps) {
	const isUser = role === "user";
	return (
		<div
			className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
			style={{ animation: "fadeUp 0.3s ease both" }}>
			<div
				className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
					isUser ? "bg-violet-600" : `bg-gradient-to-br ${accentClass}`
				}`}>
				{isUser ? (
					<HiUser className="w-4 h-4 text-white" />
				) : (
					<HiSparkles className="w-4 h-4 text-white" />
				)}
			</div>
			<div
				className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
					isUser
						? `bg-gradient-to-br ${accentClass} text-white rounded-tr-sm`
						: "bg-[var(--cb3)] text-[var(--ct1)] border border-[var(--cbr)] rounded-tl-sm"
				}`}>
				{isUser ? (
					text
				) : (
					<TypingMessage
						text={text}
						animate={animate}
					/>
				)}
			</div>
		</div>
	);
}

function ScenarioTab({
	conv,
	active,
	onClick,
}: {
	conv: DemoConversation;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
				active
					? "bg-[var(--cb3)] text-[var(--ct1)] border border-[var(--cbr)]"
					: "text-[var(--ct4)] hover:text-[var(--ct2)]"
			}`}>
			<span className={`w-2 h-2 rounded-full bg-gradient-to-r ${conv.color}`} />
			{conv.label}
		</button>
	);
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
	const [activeId, setActiveId] = useState(DEMO_CONVERSATIONS[0].id);
	const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
	const [inputDraft, setInputDraft] = useState("");
	const [demoMessages, setDemoMessages] = useState<
		{ role: "user" | "assistant"; text: string }[]
	>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [animatingIdx, setAnimatingIdx] = useState<number | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const conv = DEMO_CONVERSATIONS.find((c) => c.id === activeId)!;

	useEffect(() => {
		const isNew = !playedIds.has(activeId);
		setDemoMessages(conv.messages);
		if (isNew) {
			setAnimatingIdx(conv.messages.length - 1);
			setPlayedIds((prev) => new Set([...prev, activeId]));
		} else {
			setAnimatingIdx(null);
		}
	}, [activeId]);

	useEffect(() => {
		setTimeout(
			() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
			50,
		);
	}, [demoMessages]);

	const handleSend = () => {
		const trimmed = inputDraft.trim();
		if (!trimmed || isTyping) return;
		setInputDraft("");
		setDemoMessages((prev) => [
			...prev,
			{ role: "user" as const, text: trimmed },
		]);
		setIsTyping(true);
		setTimeout(() => {
			const replyText =
				"Ótima pergunta! No modo de demonstração estou exibindo respostas pré-definidas. No chat real, o modelo " +
				conv.model +
				" responderia diretamente em tempo real via Ollama.";
			setDemoMessages((prev) => {
				const next = [...prev, { role: "assistant" as const, text: replyText }];
				setAnimatingIdx(next.length - 1);
				return next;
			});
			setIsTyping(false);
		}, 1200);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<>
			<Head>
				<title>Demo — NebulAI</title>
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Jost:wght@700;800&display=swap"
					rel="stylesheet"
				/>
				<style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
			</Head>

			<div className="min-h-screen bg-[var(--cb1)] text-[var(--ct1)] flex flex-col">
				{/* bg blobs */}
				<div
					aria-hidden
					className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
					<div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-violet-700/15 blur-[130px]" />
					<div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
				</div>

				{/* header */}
				<header className="border-b border-[var(--cbr)] bg-[var(--cb1)]/80 backdrop-blur-md sticky top-0 z-50">
					<div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
						<Link
							href="/landing"
							className="flex items-center gap-2 text-[var(--ct3)] hover:text-[var(--ct1)] text-sm font-medium transition-colors">
							<HiArrowLeft className="w-4 h-4" />
							Voltar
						</Link>

						<div className="flex items-center gap-2">
							<div
								className={`w-7 h-7 rounded-lg bg-gradient-to-br ${conv.color} flex items-center justify-center shadow-md`}>
								<HiSparkles className="w-3.5 h-3.5 text-white" />
							</div>
							<span
								style={{ fontFamily: "'Jost', sans-serif" }}
								className="font-bold text-[var(--ct1)] text-base">
								Demo Interativo
							</span>
						</div>

						<div className="flex items-center gap-2">
							<ThemeToggle variant="navbar" />
							<Link
								href="/"
								className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30">
								Usar agora
								<HiArrowRight className="w-3.5 h-3.5" />
							</Link>
						</div>
					</div>
				</header>

				{/* main */}
				<main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 flex flex-col gap-6">
					{/* intro */}
					<div className="text-center max-w-xl mx-auto">
						<p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-2">
							Demonstração
						</p>
						<h1
							style={{ fontFamily: "'Jost', sans-serif" }}
							className="text-2xl sm:text-3xl font-extrabold text-[var(--ct1)] mb-3">
							Veja o NebulAI em ação
						</h1>
						<p className="text-sm text-[var(--ct3)] leading-relaxed">
							Escolha um cenário, observe o streaming de texto e interaja com o
							chat.
						</p>
					</div>

					{/* scenario tabs */}
					<div className="flex items-center gap-2 justify-center flex-wrap">
						{DEMO_CONVERSATIONS.map((c) => (
							<ScenarioTab
								key={c.id}
								conv={c}
								active={c.id === activeId}
								onClick={() => setActiveId(c.id)}
							/>
						))}
					</div>

					{/* chat window */}
					<div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
						{/* messages panel */}
						<div className="flex flex-col rounded-2xl border border-[var(--cbr)] bg-[var(--cb2)]/70 backdrop-blur-sm overflow-hidden">
							{/* window chrome */}
							<div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--cbr)] bg-[var(--cb2)] shrink-0">
								<div className="flex items-center gap-1.5">
									<span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
									<span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
									<span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
								</div>
								<div className="flex-1 flex items-center gap-2">
									<span className="text-xs text-[var(--ct4)] font-mono">
										NebulAI — {conv.model}
									</span>
								</div>
								<span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
									Online
								</span>
							</div>

							{/* messages */}
							<div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 min-h-[320px] max-h-[480px]">
								{demoMessages.map((m, i) => (
									<MessageBubble
										key={i}
										role={m.role}
										text={m.text}
										animate={i === animatingIdx}
										accentClass={conv.color}
									/>
								))}

								{isTyping && (
									<div className="flex gap-3">
										<div
											className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${conv.color} flex items-center justify-center shadow-md`}>
											<HiSparkles className="w-4 h-4 text-white" />
										</div>
										<div className="px-4 py-3 bg-[var(--cb3)] border border-[var(--cbr)] rounded-2xl rounded-tl-sm flex items-center gap-1.5">
											{[0, 150, 300].map((delay) => (
												<span
													key={delay}
													className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
													style={{ animationDelay: `${delay}ms` }}
												/>
											))}
										</div>
									</div>
								)}

								<div ref={messagesEndRef} />
							</div>

							{/* input */}
							<div className="px-4 py-4 border-t border-[var(--cbr)] bg-[var(--cb2)] shrink-0">
								<div className="flex items-end gap-3 bg-[var(--cb3)] rounded-xl px-4 py-3 border border-[var(--cbr)] focus-within:border-violet-500/50 transition-colors">
									<textarea
										rows={1}
										value={inputDraft}
										onChange={(e) => setInputDraft(e.target.value)}
										onKeyDown={handleKeyDown}
										placeholder="Envie uma mensagem de teste..."
										disabled={isTyping}
										className="flex-1 bg-transparent text-[var(--ct1)] placeholder-[var(--ct4)] text-sm focus:outline-none resize-none max-h-32 leading-relaxed"
									/>
									<button
										onClick={handleSend}
										disabled={isTyping || !inputDraft.trim()}
										className={`w-9 h-9 rounded-lg bg-gradient-to-br ${conv.color} flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-lg`}>
										<HiPaperAirplane className="w-4 h-4" />
									</button>
								</div>
								<p className="text-center text-xs text-[var(--ct4)] mt-2">
									Demonstração — respostas simuladas
								</p>
							</div>
						</div>

						{/* info panel */}
						<aside className="flex flex-col gap-4">
							{/* model card */}
							<div className="rounded-2xl border border-[var(--cbr)] bg-[var(--cb2)]/70 p-5 backdrop-blur-sm">
								<p className="text-xs font-semibold uppercase tracking-widest text-[var(--ct4)] mb-3">
									Modelo ativo
								</p>
								<div
									className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${conv.color} mb-3`}>
									<HiCpuChip className="w-4 h-4 text-white" />
									<span className="font-mono text-sm text-white font-semibold">
										{conv.model}
									</span>
								</div>
								<p className="text-xs text-[var(--ct3)] leading-relaxed">
									Rodando localmente via Ollama. Troque de modelo a qualquer
									momento nas configurações.
								</p>
							</div>

							{/* stats */}
							<div className="rounded-2xl border border-[var(--cbr)] bg-[var(--cb2)]/70 p-5 backdrop-blur-sm">
								<p className="text-xs font-semibold uppercase tracking-widest text-[var(--ct4)] mb-3">
									Sessão atual
								</p>
								<div className="flex flex-col gap-3">
									{[
										{ label: "Mensagens", value: demoMessages.length },
										{
											label: "Tokens est.",
											value: demoMessages.reduce(
												(a, m) => a + Math.ceil(m.text.length / 4),
												0,
											),
										},
										{ label: "Modo", value: "Demo" },
									].map((stat) => (
										<div
											key={stat.label}
											className="flex items-center justify-between">
											<span className="text-xs text-[var(--ct4)]">
												{stat.label}
											</span>
											<span className="text-sm font-semibold text-[var(--ct1)]">
												{stat.value}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* CTA */}
							<Link
								href="/"
								className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r ${conv.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg`}>
								Usar o chat real
								<HiArrowRight className="w-4 h-4" />
							</Link>
						</aside>
					</div>
				</main>
			</div>
		</>
	);
}
