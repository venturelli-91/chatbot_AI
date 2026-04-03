import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="pt-BR">
			<Head>
				{/* Anti-FOUC: aplica a classe antes do primeiro paint */}
				<script
					dangerouslySetInnerHTML={{
						__html: `try{var t=localStorage.getItem('nebula-theme');if(t){var s=JSON.parse(t);if(s&&s.state&&s.state.theme==='light')document.documentElement.classList.add('light');}}catch(e){}`,
					}}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
