import Link from "next/link";
import { useRouter } from "next/router";
import { Tooltip } from "flowbite-react";
import type { IconType } from "react-icons";

interface NavItemProps {
	href: string;
	icon: IconType;
	label: string;
}

const NavItem = ({ href, icon: Icon, label }: NavItemProps) => {
	const { pathname } = useRouter();
	const isActive = pathname === href;

	return (
		<Tooltip
			content={label}
			placement="right">
			<Link
				href={href}
				className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
					isActive
						? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
						: "text-[var(--ct3)] hover:text-[var(--ct1)] hover:bg-[var(--cb3)]"
				}`}>
				<Icon className="w-5 h-5" />
			</Link>
		</Tooltip>
	);
};

export default NavItem;
