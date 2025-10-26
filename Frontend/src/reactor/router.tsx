import {createReactor} from "reactor"
export function createRouter(routes: Record<string, any>) {
	return function renderRoute() {
		const path = window.location.pathname.toLowerCase()
		const Page = routes[path]
		const root = document.getElementById("app")
		if (!root) return
		root.innerHTML = ""
		root.append(Page ? Page() : notFound())
	}
}

function notFound() {
	return createReactor("div", { style: { color: "red" } }, "404 - Not Found")
}
