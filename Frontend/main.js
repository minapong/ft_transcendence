// Define "views" as functions returning HTML
const routes = {
	"/": () => `<h1>🏠 Home</h1><p>Welcome to the tiny SPA!</p>`,
	"/about": () => `<h1>ℹ️ About</h1><p>This page was loaded without a full reload.</p>`,
	"/contact": () => `<h1>📬 Contact</h1><p>Drop us a message in the void.</p>`
};

// Core router: renders correct "view" into #app
function router() {
	const path = window.location.pathname;
	const view = routes[path] || (() => `<h1>404</h1><p>Page not found</p>`);
	document.querySelector("#app").innerHTML = view();
}

// Intercept clicks on internal links and use History API
document.addEventListener("click", (e) => {
	const link = e.target.closest("[data-link]");
	if (!link) return;
	e.preventDefault();
	window.history.pushState(null, "", link.href);
	router();
});

// Handle browser navigation (Back/Forward)
window.addEventListener("popstate", router);

// Initial render
router();