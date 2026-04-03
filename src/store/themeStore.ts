import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface ThemeState {
	theme: Theme;
	toggleTheme: () => void;
}

const applyTheme = (theme: Theme) => {
	if (typeof document === "undefined") return;
	document.documentElement.classList.toggle("light", theme === "light");
};

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			theme: "dark",
			toggleTheme: () => {
				const next = get().theme === "dark" ? "light" : "dark";
				applyTheme(next);
				set({ theme: next });
			},
		}),
		{
			name: "nebula-theme",
			onRehydrateStorage: () => (state) => {
				if (state) applyTheme(state.theme);
			},
		},
	),
);
