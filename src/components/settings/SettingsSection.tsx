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
		<div className="bg-[var(--cb2)] border border-[var(--cbr)] rounded-2xl p-6">
			<div className="mb-5">
				<h2 className="font-semibold text-[var(--ct1)] text-base">{title}</h2>
				{description && (
					<p className="text-sm text-[var(--ct3)] mt-1">{description}</p>
				)}
			</div>
			<div className="space-y-4">{children}</div>
		</div>
	);
};

export default SettingsSection;
