import rootLayout from "@/components/layout/RootLayout";
import { resetHooks, flushEffects, runPendingRefs } from "./hooks";
import { getRoutes, resolvePage } from "./router/routes";

const LAYOUT_KEY = "__layout__";

// Renders the current route by resolving the page component and updating the DOM.
export function renderRoute(triggerKey?: string) {
	const rawPath = window.location.pathname;
	const normalizedPath = normalizePath(rawPath);
  //normalize cuurent page url points to

	const routes = getRoutes();
  const Page = resolvePage(routes, rawPath);

  const root = document.getElementById("app");
  if (!root) return;
  try {
    // get current page
    const pageKey = `page:${normalizedPath}`;
    let inner = document.getElementById("spa-root");
    
    // if page is not loaded or someone ordered layout re render through passing triggerKey props
    if (!inner || triggerKey === LAYOUT_KEY) {
      renderSubtree(
      () => rootLayout({ children: null }), //build the outer shell first
      root, // mount at root
      LAYOUT_KEY, // track layout's its state independently
      { track: false } // dont check layouts children at all
    );
      inner = document.getElementById("spa-root");
      if (!inner) throw new Error("spa-root not found after rendering RootLayout");
    }

    renderSubtree(Page, inner, pageKey); //after grabing actual page now render that
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

function normalizePath(rawPath: string) {
	let path = rawPath.toLowerCase().replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
	return path.split(/[?#]/)[0];
}

function renderSubtree(renderFn: () => HTMLElement, container: HTMLElement, key: string, opts?: { track?: boolean }) {
  resetHooks(key, opts); //reset context on every page switch
  const el = renderFn(); //call the components funcs to make tree
  container.replaceChildren(el); //replace the content of page and add new
  runPendingRefs(); // after all dom is made now run ref.current = elemtent for every queued ref
  flushEffects(); // at last after ref flush all the effects execute all effect callback
}

// Programmatic navigation helper so any code can trigger a route change.
export function navigate(path: string, opts?: { replace?: boolean; triggerLayout?: boolean }) {
  const target = normalizePath(path.startsWith("/") ? path : `/${path}`);
  const current = normalizePath(window.location.pathname);

  const shouldUpdateHistory = opts?.replace || target !== current;

  if (shouldUpdateHistory) {
    const method = opts?.replace ? "replaceState" : "pushState";
    history[method]({}, "", target);
  }

  renderRoute(opts?.triggerLayout ? LAYOUT_KEY : undefined);
}
