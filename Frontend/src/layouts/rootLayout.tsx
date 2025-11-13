import { Header } from "components/layout/Header";
 
export default function rootLayout({ children }) {
	console.log("children on first load:", children);
	return (
		<div>
			<Header />
			<main id="spa-root">{children}</main>
		</div>
	);
}
