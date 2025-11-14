import { Header } from "components/layout/Header";
 
export default function rootLayout({ children }) {
	console.log("children on first load:", children);
	return (
		<div>
			<Header />
			<main className="w-screen h-screen bg-linear-to-br from-blue-950 via-blue-900 to-cyan-900 overflow-hidden" id="spa-root">{children}</main>
		</div>
	);
}
