import rootLayout from "../layouts/rootLayout";
import { resetHooks, flushEffects } from "./hooks";
import { getRoutes, resolvePage } from "./router/routes";

export function renderRoute() {
  resetHooks();
  const routes = getRoutes();
  const Page = resolvePage(routes, window.location.pathname);

  const root = document.getElementById("app");
  if (!root) return;

  const inner = document.getElementById("spa-root");
  try {
    if (inner) inner.replaceChildren(Page());
    else root.replaceChildren(rootLayout({ children: Page() }));
  } catch (err) {
    console.error("⚠️ renderRoute error:", err);
  } finally {
    flushEffects();
  }
}

export function initRouter() {
  document.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest("a");
    if (link && link.getAttribute("href")?.startsWith("/")) {
      e.preventDefault();
      history.pushState({}, "", link.getAttribute("href")!);
      renderRoute();
    }
  });
  window.addEventListener("popstate", renderRoute);
}
