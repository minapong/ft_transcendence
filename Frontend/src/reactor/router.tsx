// ==========================================
//  Reactor Router v3 — ft_transcendence 
// ==========================================

import rootLayout  from "../layouts/rootLayout";
import { withHooks } from "./hooks";

// Build routes dynamically from /src/pages
function buildRoutes() {
	const pages = import.meta.glob("/src/pages/**/*.tsx", { eager: true });
	const routes: Record<string, any> = {};

	for (const path in pages) {
		let route = path
			.replace("/src/pages", "")
			.replace(/index\.tsx$/, "")
			.replace(/\.tsx$/, "")
			.toLowerCase();
		if (route === "") route = "/";
		routes[route] = (pages[path] as any).default;
	}

	console.log("🧭 routes:", routes);
	return routes;
}

// Normalize + resolve target page
function resolvePage(routes: Record<string, any>, rawPath: string) {
	const original = rawPath;

	let path = rawPath
		.toLowerCase()
		.replace(/\/{2,}/g, "/") // collapse duplicate slashes
		// g means globally do for every patter{2,} this means search for 2 slashes
		.replace(/\/+$/, "") || "/"; // strip trailing slash, keep root
		// + means whenever u find / for trailling and $ indicates end of string

	// sync URL bar if normalized form differs
	if (original !== path) history.replaceState({}, "", path);

	// strip query/hash if present (for later enhancement)
	path = path.split(/[?#]/)[0];
	
	// unified 404 handling
	const Page = routes[path] ?? routes["/notfound"] ;
	//any logic ig u want custom behaviour of browser url when 404 occurs
	// if (!routes[path]) {
	// 	history.replaceState({}, "", "/notfound");
	// }
	//any logic ig u want custom behaviour of browser url when 404 occurs
	return Page;
}
let routesCache: Record<string,any> | null = null
const getRoutes = () => {
	if (!routesCache) routesCache = buildRoutes();
	return routesCache;
}
// Core render routine
export function renderRoute() {
	const routes = getRoutes();
	const path = window.location.pathname;
	const Page = resolvePage(routes, path);

	const root = document.getElementById("app");
	if (!root) return;

	const inner = document.getElementById("spa-root");

	try {
		const WrappedPage = withHooks(Page);
		if (inner) {
			// Layout already exists → swap only inner content
			inner.replaceChildren(WrappedPage());

		} else {
			root.replaceChildren(rootLayout({ children: WrappedPage() }));
			// First render → mount full layout
		}
	} catch (err) {
		console.error("⚠️ renderRoute error:", err);
	}
}

// Intercept in-app link clicks
document.addEventListener("click", e => {
	const link = (e.target as HTMLElement).closest("a");
	if (link && link.getAttribute("href")?.startsWith("/")) {
		e.preventDefault();
		history.pushState({}, "", link.getAttribute("href")!);
		renderRoute();
	}
});

// browser navigation (Back / Forward)
window.addEventListener("popstate", ()=> {
	renderRoute()
});

export function navigate(path: string) {
    history.pushState({}, "", path);
    renderRoute();
}