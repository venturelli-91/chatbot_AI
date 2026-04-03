import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import {
	HiSparkles,
	HiArrowRight,
	HiCpuChip,
	HiShieldCheck,
	HiRocketLaunch,
	HiBolt,
} from "react-icons/hi2";
import ThemeToggle from "../components/ThemeToggle";

// ─── data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
	{
		icon: HiCpuChip,
		title: "Modelos locais",
		body: "Roda 100 % no seu hardware via Ollama. Seus dados jamais saem da sua máquina.",
	},
	{
		icon: HiShieldCheck,
		title: "Privacidade total",
		body: "Zero telemetria, zero nuvem. Controle completo sobre cada token processado.",
	},
	{
		icon: HiRocketLaunch,
		title: "Troca de modelo",
		body: "Alterne entre Mistral, LLaMA, Gemma e qualquer modelo disponível no Ollama.",
	},
	{
		icon: HiBolt,
		title: "Streaming em tempo real",
		body: "Respostas palavra a palavra com latência mínima, diretamente da API local.",
	},
];

const DEMO_MESSAGES = [
	{ role: "user", text: "Explique quantum computing em 2 frases" },
	{
		role: "assistant",
		text: "Quantum computing usa qubits para processar múltiplos estados simultaneamente através de superposição. Isso permite resolver certos problemas exponencialmente mais rápido do que computadores clássicos.",
	},
];

// ─── hook: intersection observer ──────────────────────────────────────────────

function useInView(threshold = 0.15) {
	const ref = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					obs.disconnect();
				}
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);

	return { ref, inView };
}

// ─── sub-components ─────────────────────────────────────────────────────────

function GradientMesh() {
	return (
		<div
			aria-hidden
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-violet-700/20 blur-[140px]" />
			<div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
			<div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-800/10 blur-[100px]" />
			<svg
				className="absolute inset-0 w-full h-full opacity-[0.03]"
				xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern
						id="dot-grid"
						x="0"
						y="0"
						width="28"
						height="28"
						patternUnits="userSpaceOnUse">
						<circle
							cx="1"
							cy="1"
							r="1"
							fill="currentColor"
						/>
					</pattern>
				</defs>
				<rect
					width="100%"
					height="100%"
					fill="url(#dot-grid)"
				/>
			</svg>
		</div>
	);
}

function Navbar() {
	return (
		<header className="fixed top-0 inset-x-0 z-50 border-b border-[var(--cbr)] bg-[var(--cb1)]/80 backdrop-blur-md">
			<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-900/40">
						<HiSparkles className="w-4 h-4 text-white" />
					</div>
					<span
						style={{ fontFamily: "'Jost', sans-serif" }}
						className="font-bold text-[var(--ct1)] tracking-tight text-lg">
						NebulAI
					</span>
				</div>

				<nav className="hidden md:flex items-center gap-7 text-sm text-[var(--ct3)] font-medium">
					<a
						href="#features"
						className="hover:text-[var(--ct1)] transition-colors">
						Features
					</a>
					<a
						href="#demo"
						className="hover:text-[var(--ct1)] transition-colors">
						Demo
					</a>
					<a
						href="#como-funciona"
						className="hover:text-[var(--ct1)] transition-colors">
						Como funciona
					</a>
				</nav>

				<div className="flex items-center gap-3">
					<Link
						href="/demo"
						className="hidden sm:inline-flex items-center gap-2 text-sm text-[var(--ct2)] hover:text-[var(--ct1)] transition-colors font-medium">
						Ver demo
					</Link>
					<ThemeToggle variant="navbar" />
					<Link
						href="/"
						className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30">
						Usar grátis
						<HiArrowRight className="w-3.5 h-3.5" />
					</Link>
				</div>
			</div>
		</header>
	);
}

function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
			<div className="max-w-4xl mx-auto text-center">
				<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-8">
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
					Ollama · Mistral · Local
				</div>

				<h1
					style={{ fontFamily: "'Jost', sans-serif" }}
					className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[var(--ct1)] leading-[1.08] tracking-tight mb-6">
					Seu assistente AI,{" "}
					<span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
						inteiramente seu
					</span>
				</h1>

				<p className="text-base sm:text-lg text-[var(--ct3)] max-w-2xl mx-auto leading-relaxed mb-10">
					Conversas inteligentes com modelos de linguagem rodando 100% local.
					<br className="hidden sm:block" />
					Sem nuvem, sem coleta de dados, sem limites de uso.
				</p>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link
						href="/"
						className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all shadow-2xl shadow-violet-900/40">
						Abrir o chat
						<HiArrowRight className="w-4 h-4" />
					</Link>
					<Link
						href="/demo"
						className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--cbr)] bg-[var(--cb3)]/40 text-[var(--ct2)] font-semibold text-sm hover:bg-[var(--cb3)]/70 transition-all backdrop-blur-sm">
						Ver demonstração
					</Link>
				</div>

				{/* preview card */}
				<div className="mt-20 relative mx-auto max-w-2xl">
					<div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-600/20 to-indigo-600/10 blur-xl -z-10" />
					<div className="rounded-2xl border border-[var(--cbr)] bg-[var(--cb2)]/80 backdrop-blur-md overflow-hidden shadow-2xl">
						<div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--cbr)] bg-[var(--cb2)]">
							<span className="w-3 h-3 rounded-full bg-red-500/70" />
							<span className="w-3 h-3 rounded-full bg-yellow-500/70" />
							<span className="w-3 h-3 rounded-full bg-emerald-500/70" />
							<span className="ml-3 text-xs text-[var(--ct4)] font-mono">
								NebulAI — localhost:3000
							</span>
						</div>
						<div className="px-5 py-5 flex flex-col gap-4">
							{DEMO_MESSAGES.map((m, i) => (
								<div
									key={i}
									className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
									<div
										className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
											m.role === "user"
												? "bg-violet-600"
												: "bg-gradient-to-br from-violet-600 to-indigo-600"
										}`}>
										{m.role === "user" ? "U" : "AI"}
									</div>
									<div
										className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed max-w-[78%] ${
											m.role === "user"
												? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm"
												: "bg-[var(--cb3)] text-[var(--ct1)] border border-[var(--cbr)] rounded-tl-sm"
										}`}>
										{m.text}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function FeaturesSection() {
	const { ref, inView } = useInView();

	return (
		<section
			id="features"
			className="py-32 px-6">
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">
						Capacidades
					</p>
					<h2
						style={{ fontFamily: "'Jost', sans-serif" }}
						className="text-3xl sm:text-4xl font-extrabold text-[var(--ct1)] tracking-tight">
						Projetado para quem leva a sério
					</h2>
				</div>

				<div
					ref={ref}
					className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{FEATURES.map((feat, i) => (
						<div
							key={i}
							className="group relative p-6 rounded-2xl border border-[var(--cbr)] bg-[var(--cb2)]/60 backdrop-blur-sm hover:border-violet-500/30 hover:bg-[var(--cb2)] transition-all duration-300"
							style={{
								opacity: inView ? 1 : 0,
								transform: inView ? "translateY(0)" : "translateY(24px)",
								transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms, background 0.2s, border 0.2s`,
							}}>
							<div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
								<feat.icon className="w-5 h-5 text-violet-400" />
							</div>
							<h3 className="font-bold text-[var(--ct1)] mb-2">{feat.title}</h3>
							<p className="text-sm text-[var(--ct3)] leading-relaxed">
								{feat.body}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function HowItWorksSection() {
	const { ref, inView } = useInView(0.1);

	const STEPS = [
		{
			num: "01",
			title: "Instale o Ollama",
			body: "Baixe o Ollama e rode qualquer modelo localmente com um comando.",
			code: "ollama pull mistral",
		},
		{
			num: "02",
			title: "Abra o NebulAI",
			body: "Inicie o servidor de desenvolvimento e acesse o chat no browser.",
			code: "npm run dev",
		},
		{
			num: "03",
			title: "Converse livremente",
			body: "Digite sua mensagem e receba respostas em tempo real, 100% local.",
			code: "localhost:3000",
		},
	];

	return (
		<section
			id="como-funciona"
			className="py-32 px-6">
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-16">
					<p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">
						Setup
					</p>
					<h2
						style={{ fontFamily: "'Jost', sans-serif" }}
						className="text-3xl sm:text-4xl font-extrabold text-[var(--ct1)] tracking-tight">
						Em funcionamento em 3 passos
					</h2>
				</div>

				<div
					ref={ref}
					className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{STEPS.map((step, i) => (
						<div
							key={i}
							style={{
								opacity: inView ? 1 : 0,
								transform: inView ? "translateY(0)" : "translateY(32px)",
								transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
							}}
							className="relative p-6 rounded-2xl border border-[var(--cbr)] bg-[var(--cb2)]/60">
							<span
								style={{ fontFamily: "'Jost', sans-serif" }}
								className="text-5xl font-extrabold text-[var(--ct1)]/5 select-none absolute top-4 right-5">
								{step.num}
							</span>
							<h3 className="font-bold text-[var(--ct1)] mb-2">{step.title}</h3>
							<p className="text-sm text-[var(--ct3)] leading-relaxed mb-4">
								{step.body}
							</p>
							<pre className="text-xs font-mono bg-[var(--cb1)] border border-[var(--cbr)] text-violet-300 px-3 py-2 rounded-lg overflow-x-auto">
								{step.code}
							</pre>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function CTASection() {
	const { ref, inView } = useInView(0.2);

	return (
		<section className="py-32 px-6">
			<div
				ref={ref}
				style={{
					opacity: inView ? 1 : 0,
					transform: inView ? "scale(1)" : "scale(0.97)",
					transition: "opacity 0.6s ease, transform 0.6s ease",
				}}
				className="max-w-3xl mx-auto text-center relative">
				<div
					aria-hidden
					className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 blur-2xl -z-10"
				/>

				<div className="rounded-3xl border border-[var(--cbr)] bg-[var(--cb2)]/80 backdrop-blur-md px-10 py-16">
					<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-900/40">
						<HiSparkles className="w-7 h-7 text-white" />
					</div>
					<h2
						style={{ fontFamily: "'Jost', sans-serif" }}
						className="text-3xl sm:text-4xl font-extrabold text-[var(--ct1)] tracking-tight mb-4">
						Comece agora, é gratuito
					</h2>
					<p className="text-[var(--ct3)] text-sm leading-relaxed mb-8 max-w-lg mx-auto">
						Open source, sem cadastro, sem cartão de crédito. Só você e o seu
						modelo de linguagem.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link
							href="/"
							className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/40">
							Ir para o chat
							<HiArrowRight className="w-4 h-4" />
						</Link>
						<Link
							href="/demo"
							className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--cbr)] bg-[var(--cb3)]/40 text-[var(--ct2)] font-semibold text-sm hover:bg-[var(--cb3)]/70 transition-all">
							Ver demo interativo
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

function Footer() {
	return (
		<footer className="border-t border-[var(--cbr)] py-10 px-6">
			<div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ct4)]">
				<div className="flex items-center gap-2">
					<div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
						<HiSparkles className="w-2.5 h-2.5 text-white" />
					</div>
					<span>NebulAI — Powered by Ollama</span>
				</div>
				<div className="flex items-center gap-5">
					<Link
						href="/"
						className="hover:text-[var(--ct2)] transition-colors">
						Chat
					</Link>
					<Link
						href="/demo"
						className="hover:text-[var(--ct2)] transition-colors">
						Demo
					</Link>
					<Link
						href="/settings"
						className="hover:text-[var(--ct2)] transition-colors">
						Configurações
					</Link>
				</div>
			</div>
		</footer>
	);
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
	return (
		<>
			<Head>
				<title>NebulAI — Assistente AI local e privado</title>
				<meta
					name="description"
					content="Converse com modelos de linguagem rodando 100% no seu hardware. Privacidade total, sem nuvem."
				/>
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
			</Head>

			<div className="min-h-screen bg-[var(--cb1)] text-[var(--ct1)]">
				<GradientMesh />
				<Navbar />
				<HeroSection />
				<FeaturesSection />
				<HowItWorksSection />
				<CTASection />
				<Footer />
			</div>
		</>
	);
}
