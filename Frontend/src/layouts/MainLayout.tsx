import { Header } from "components/Header";

export function MainLayout(Page: () => HTMLElement) {
	const wrapper = document.createElement("div");

	const header = Header();
	const main = document.createElement("main");
	main.id = "spa-root";      // 👈 persistent container
	main.append(Page());

	wrapper.append(header, main);
	return wrapper;
}
