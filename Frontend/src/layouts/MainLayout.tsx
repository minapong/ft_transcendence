import { Header } from "components/layout/Header";
// import { Side } from "components/Side";

export function MainLayout(Page: () => HTMLElement) {
	return(
		<div>
			<Header/>
			{/* <Side/> */}
			<main id="spa-root">{Page()}</main>
		</div>
	);
	
}
