import rootLayout from "@/components/layout/RootLayout";
import { resetHooks, flushEffects, runPendingRefs } from "./hooks";
import { getRoutes, resolvePage } from "./router/routes";

// Renders the current route by resolving the page component and updating the DOM.
export function renderRoute() {
  resetHooks();

  const routes = getRoutes();
  const Page = resolvePage(routes, window.location.pathname);
  const root = document.getElementById("app");
  if (!root) return;
  const inner = document.getElementById("spa-root");
  try {
    const pageEl = Page();
    if (inner) inner.replaceChildren(pageEl);
    else root.replaceChildren(rootLayout({ children: pageEl }));

    runPendingRefs();
    console.log("flushing before")
    flushEffects();
    console.log("flushing åfter")
  } catch (err) {
    console.error("⚠️ renderRoute error:", err);
  }
}

// Initializes the router by setting up event listeners for navigation and rendering the initial route.
export function initRouter() {
  document.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest("a");
    if (link && link.getAttribute("href")?.startsWith("/")) {
      e.preventDefault();
      history.pushState({}, "", link.getAttribute("href")!);
      renderRoute();
    }
  });

  // back/forward
  window.addEventListener("popstate", renderRoute);
  renderRoute();
}
