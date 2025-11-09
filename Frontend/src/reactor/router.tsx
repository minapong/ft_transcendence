// ==========================================
// 🔥 Reactor Router v3 — ft_transcendence 
// ==========================================

import { MainLayout } from "layouts/MainLayout";
import notfound from "pages/notFound";
import Home from "pages/Home";

// 1️⃣ Build routes dynamically from /src/pages
function buildRoutes() {
	const pages = import.meta.glob("/src/pages/**/*.tsx", { eager: true });
	const routes: Record<string, any> = {};

	for (const path in pages) {
		let route = path
			.replace("/src/pages", "")
			.replace(/index\.tsx$/, "")
			.replace(/\.tsx$/, "")
			.toLowerCase();
		// if (route === "") route = "/";
		route = route.replace(/\/+$/, "") || "/";
		routes[route] = (pages[path] as any).default;
	}
    if (routes["/home"]) routes["/"] = routes["/home"];

	console.log("🧭 routes:", routes);
	return routes;
}

// 2️⃣ Normalize + resolve target page
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
	
	// ✅ unified 404 handling
	const Page = routes[path] ?? routes["/notfound"] ?? notfound;
	if (!routes[path]) {
		history.replaceState({}, "", "/notfound");
	}
	return Page;
}

// 3️⃣ Core render routine
export function renderRoute() {
	const routes = buildRoutes();
	const path = window.location.pathname;
	const Page = resolvePage(routes, path);

	const root = document.getElementById("app");
	if (!root) return;

	const inner = document.getElementById("spa-root");

	try {
		if (inner) {
			// Layout already exists → swap only inner content
			inner.replaceChildren(Page());
		} else {
			// First render → mount full layout
			root.replaceChildren(MainLayout(Page));
		}
	} catch (err) {
		console.error("⚠️ renderRoute error:", err);
		const fallback = notfound();
		(inner || root)?.replaceChildren(fallback);
	}
}

// 4️⃣ Intercept in-app link clicks
document.addEventListener("click", e => {
	const link = (e.target as HTMLElement).closest("a");
	if (link && link.getAttribute("href")?.startsWith("/")) {
		e.preventDefault();
		history.pushState({}, "", link.getAttribute("href")!);
		renderRoute();
	}
});

// 5️⃣ Handle browser navigation (Back / Forward)
window.addEventListener("popstate", ()=> {
	renderRoute()
});
