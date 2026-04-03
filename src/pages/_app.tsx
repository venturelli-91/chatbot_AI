import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AppLayout from "../components/layout/AppLayout";

const FULLSCREEN_ROUTES = ["/landing", "/demo"];

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const isFullscreen = FULLSCREEN_ROUTES.includes(router.pathname);

	if (isFullscreen) {
		return <Component {...pageProps} />;
	}

	return (
		<AppLayout>
			<Component {...pageProps} />
		</AppLayout>
	);
}
