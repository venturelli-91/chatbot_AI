import { HiSun, HiMoon } from "react-icons/hi2";
import { Tooltip } from "flowbite-react";
import { useThemeStore } from "../store/themeStore";

interface ThemeToggleProps {
	variant?: "sidebar" | "navbar";
	className?: string;
}

const ThemeToggle = ({
	variant = "sidebar",
	className = "",
}: ThemeToggleProps) => {
	const { theme, toggleTheme } = useThemeStore();
	const isLight = theme === "light";
	const label = isLight ? "Modo escuro" : "Modo claro";

	if (variant === "navbar") {
		return (
			<button
				onClick={toggleTheme}
				title={label}
				className={`w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--cbr)] text-[var(--ct3)] hover:text-[var(--ct1)] hover:border-[var(--ct3)] transition-all ${className}`}>
				{isLight ? (
					<HiMoon className="w-4 h-4" />
				) : (
					<HiSun className="w-4 h-4" />
				)}
			</button>
		);
	}

	return (
		<Tooltip
			content={label}
			placement="right">
			<button
				onClick={toggleTheme}
				className={`w-10 h-10 rounded-xl flex items-center justify-center text-[var(--ct3)] hover:text-[var(--ct1)] hover:bg-[var(--cb3)] transition-all ${className}`}>
				{isLight ? (
					<HiMoon className="w-5 h-5" />
				) : (
					<HiSun className="w-5 h-5" />
				)}
			</button>
		</Tooltip>
	);
};

export default ThemeToggle;
