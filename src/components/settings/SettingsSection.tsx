import type { ReactNode } from "react";

interface SettingsSectionProps {
	title: string;
	description?: string;
	children: ReactNode;
}

const SettingsSection = ({
	title,
	description,
	children,
}: SettingsSectionProps) => {
	return (
		<div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
			<div className="mb-5">
				<h2 className="font-semibold text-slate-100 text-base">{title}</h2>
				{description && (
					<p className="text-sm text-slate-400 mt-1">{description}</p>
				)}
			</div>
			<div className="space-y-4">{children}</div>
		</div>
	);
};

export default SettingsSection;
