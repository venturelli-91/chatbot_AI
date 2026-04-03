import { useState } from "react";
import { Modal } from "flowbite-react";
import { useChatStore } from "../store/chatStore";
import SettingsSection from "../components/settings/SettingsSection";
import ModelSelector from "../components/settings/ModelSelector";
import TokenSlider from "../components/settings/TokenSlider";
import ExportSection from "../components/settings/ExportSection";

export default function SettingsPage() {
	const { settings, updateSettings, clearMessages, messages } = useChatStore();
	const [ollamaStatus, setOllamaStatus] = useState<
		"idle" | "ok" | "error" | "loading"
	>("idle");
	const [showClearModal, setShowClearModal] = useState(false);

	const testConnection = async () => {
		setOllamaStatus("loading");
		try {
			const res = await fetch(
				`/api/models?ollamaUrl=${encodeURIComponent(settings.ollamaUrl)}`,
			);
			setOllamaStatus(res.ok ? "ok" : "error");
		} catch {
			setOllamaStatus("error");
		}
	};

	const handleClear = () => {
		clearMessages();
		setShowClearModal(false);
	};

	return (
		<div className="h-full overflow-y-auto bg-[var(--cb1)]">
			<div className="max-w-2xl mx-auto py-8 px-6 flex flex-col gap-5">
				<div>
					<h1 className="text-xl font-bold text-[var(--ct1)]">Configurações</h1>
					<p className="text-sm text-[var(--ct3)] mt-1">
						Personalize o comportamento do assistente
					</p>
				</div>

				<SettingsSection
					title="Modelo de IA"
					description="Selecione o modelo Ollama que será usado nas respostas">
					<ModelSelector />
				</SettingsSection>

				<SettingsSection
					title="Tokens"
					description="Controla o tamanho máximo das respostas geradas">
					<TokenSlider />
				</SettingsSection>

				<SettingsSection
					title="Servidor Ollama"
					description="Endereço do servidor local do Ollama">
					<div className="flex flex-col gap-3">
						<input
							type="url"
							value={settings.ollamaUrl}
							onChange={(e) => updateSettings({ ollamaUrl: e.target.value })}
							placeholder="http://localhost:11434"
							className="bg-[var(--cb3)] border border-[var(--cbr)] text-[var(--ct1)] text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500/50 transition-colors placeholder-[var(--ct4)]"
						/>
						<div className="flex items-center gap-3">
							<button
								onClick={testConnection}
								disabled={ollamaStatus === "loading"}
								className="py-2 px-4 rounded-xl bg-[var(--cb3)] border border-[var(--cbr)] text-[var(--ct2)] text-sm hover:border-violet-500/30 hover:text-[var(--ct1)] transition-all disabled:opacity-40">
								{ollamaStatus === "loading" ? "Testando..." : "Testar conexão"}
							</button>
							{ollamaStatus === "ok" && (
								<span className="text-sm text-emerald-400 font-medium">
									✓ Conectado
								</span>
							)}
							{ollamaStatus === "error" && (
								<span className="text-sm text-red-400 font-medium">
									✗ Sem conexão
								</span>
							)}
						</div>
					</div>
				</SettingsSection>

				<SettingsSection
					title="Exportar conversa"
					description="Baixe o histórico da conversa atual">
					<ExportSection />
				</SettingsSection>

				<SettingsSection
					title="Dados"
					description="Ações permanentes sobre o histórico">
					<button
						onClick={() => setShowClearModal(true)}
						disabled={messages.length === 0}
						className="py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
						Limpar histórico de conversa
					</button>
				</SettingsSection>
			</div>

			<Modal
				show={showClearModal}
				size="md"
				onClose={() => setShowClearModal(false)}>
				<Modal.Header>Limpar histórico</Modal.Header>
				<Modal.Body>
					<p className="text-slate-400 text-sm">
						Essa ação apagará todas as mensagens permanentemente. Deseja
						continuar?
					</p>
				</Modal.Body>
				<Modal.Footer>
					<button
						onClick={handleClear}
						className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors">
						Limpar
					</button>
					<button
						onClick={() => setShowClearModal(false)}
						className="py-2 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm transition-colors">
						Cancelar
					</button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
