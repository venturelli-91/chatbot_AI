import { useChatStore } from "../../store/chatStore";

const ModelSelector = () => {
	const { availableModels, settings, updateSettings } = useChatStore();

	return (
		<div className="flex flex-col gap-2">
			<label className="text-sm text-[var(--ct2)] font-medium">
				Modelo ativo
			</label>
			<select
				value={settings.model}
				onChange={(e) => updateSettings({ model: e.target.value })}
				className="bg-[var(--cb3)] border border-[var(--cbr)] text-[var(--ct1)] text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500/50 transition-colors">
				{availableModels.length > 0 ? (
					availableModels.map((m) => (
						<option
							key={m}
							value={m}>
							{m}
						</option>
					))
				) : (
					<option value={settings.model}>{settings.model}</option>
				)}
			</select>
			<p className="text-xs text-[var(--ct4)]">
				Modelos disponíveis no Ollama. Envie uma mensagem para atualizar a
				lista.
			</p>
		</div>
	);
};

export default ModelSelector;
