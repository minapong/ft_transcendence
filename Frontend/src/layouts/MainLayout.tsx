import { Header } from "components/Header";

export function MainLayout(Page: () => HTMLElement) {
	return(
		<div>
			<Header/>
			<main id="spa-root">{Page()}</main>
		</div>
	);
	
}
