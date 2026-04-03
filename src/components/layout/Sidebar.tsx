import { HiCog } from "react-icons/hi";
import { HiChatBubbleLeft, HiClock } from "react-icons/hi2";
import NavItem from "./NavItem";

const Sidebar = () => {
	return (
		<aside className="w-16 shrink-0 flex flex-col items-center py-5 gap-2 bg-slate-900 border-r border-white/10">
			<div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-900/40">
				<HiChatBubbleLeft className="w-5 h-5 text-white" />
			</div>

			<nav className="flex flex-col gap-1 items-center">
				<NavItem href="/" icon={HiChatBubbleLeft} label="Chat" />
				<NavItem href="/history" icon={HiClock} label="Histórico" />
				<NavItem href="/settings" icon={HiCog} label="Configurações" />
			</nav>
		</aside>
	);
};

export default Sidebar;
