import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
	children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
	return (
		<div className="flex h-screen bg-slate-950 overflow-hidden">
			<Sidebar />
			<main className="flex-1 overflow-hidden">{children}</main>
		</div>
	);
};

export default AppLayout;
