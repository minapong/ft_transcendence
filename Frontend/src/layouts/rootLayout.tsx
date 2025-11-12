import { Header } from "components/layout/Header";
// import { Side } from "components/Side";

export function MainLayout({children}) {
	return(
		<div>
			<Header/>
			<main id="spa-root">{children}</main>
		</div>
	);
	
}
