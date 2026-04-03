import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AppLayout from "../components/layout/AppLayout";
import ErrorBoundary from "../components/ErrorBoundary";

const FULLSCREEN_ROUTES = ["/landing", "/demo"];

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const isFullscreen = FULLSCREEN_ROUTES.includes(router.pathname);

	if (isFullscreen) {
		return (
			<ErrorBoundary>
				<Component {...pageProps} />
			</ErrorBoundary>
		);
	}

	return (
		<ErrorBoundary>
			<AppLayout>
				<Component {...pageProps} />
			</AppLayout>
		</ErrorBoundary>
	);
}
