import { HiCog } from "react-icons/hi";
import {
	HiChatBubbleLeft,
	HiClock,
	HiHome,
	HiPlayCircle,
} from "react-icons/hi2";
import NavItem from "./NavItem";
import ThemeToggle from "../ThemeToggle";

const Sidebar = () => {
	return (
		<aside className="w-16 shrink-0 flex flex-col items-center py-5 gap-2 bg-[var(--cb2)] border-r border-[var(--cbr)]">
			<div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-900/40">
				<HiChatBubbleLeft className="w-5 h-5 text-white" />
			</div>

			<nav className="flex flex-col gap-1 items-center">
				<NavItem
					href="/landing"
					icon={HiHome}
					label="Landing"
				/>
				<NavItem
					href="/"
					icon={HiChatBubbleLeft}
					label="Chat"
				/>
				<NavItem
					href="/demo"
					icon={HiPlayCircle}
					label="Demo"
				/>
				<NavItem
					href="/history"
					icon={HiClock}
					label="Histórico"
				/>
				<NavItem
					href="/settings"
					icon={HiCog}
					label="Configurações"
				/>
			</nav>

			<div className="mt-auto">
				<ThemeToggle />
			</div>
		</aside>
	);
};

export default Sidebar;
