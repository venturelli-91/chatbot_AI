import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("[ErrorBoundary]", error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
					<div className="max-w-md w-full text-center">
						<div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">
							⚠️
						</div>
						<h1 className="text-xl font-bold text-slate-100 mb-2">
							Algo deu errado
						</h1>
						<p className="text-slate-400 text-sm mb-6">
							{this.state.error?.message ?? "Erro inesperado na aplicação."}
						</p>
						<button
							onClick={() => {
								this.setState({ hasError: false, error: null });
								window.location.reload();
							}}
							className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors">
							Recarregar
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
