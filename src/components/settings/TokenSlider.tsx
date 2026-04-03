import { useChatStore } from "../../store/chatStore";

const TokenSlider = () => {
	const { settings, updateSettings } = useChatStore();

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<label className="text-sm text-[var(--ct2)] font-medium">
					Máximo de tokens
				</label>
				<span className="text-sm font-mono text-violet-400">
					{settings.maxTokens}
				</span>
			</div>
			<input
				type="range"
				min={50}
				max={2000}
				step={50}
				value={settings.maxTokens}
				onChange={(e) => updateSettings({ maxTokens: Number(e.target.value) })}
				className="w-full accent-violet-600"
			/>
			<div className="flex justify-between text-xs text-[var(--ct4)]">
				<span>50</span>
				<span>2000</span>
			</div>
		</div>
	);
};

export default TokenSlider;
