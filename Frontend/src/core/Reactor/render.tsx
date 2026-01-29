import rootLayout from "@/app/components/layout/RootLayout";
import { resetHooks, flushEffects, runPendingRefs } from "./hooks";
import { getRoutes, resolvePage } from "./router/routes";

// Shared key so layout-level state (including modals) can trigger a shell re-render.
export const LAYOUT_KEY = "__layout__";

// Track the last known path for layout swap detection
let lastKnownPath = "";

// Define which paths require a different layout look
const isSpecial = (p: string) => p.startsWith("/game") || p.startsWith("/auth") || p === "/login";

// Renders the current route by resolving the page component and updating the DOM.
export function renderRoute(triggerKey?: string) {
  const rawPath = window.location.pathname;
  const normalizedPath = normalizePath(rawPath);
  //normalize cuurent page url points to

  // Check if layout needs to swap (from normal to special or vice versa)
  const layoutNeedsUpdate = lastKnownPath && isSpecial(normalizedPath) !== isSpecial(lastKnownPath);

  // Update last known path
  lastKnownPath = normalizedPath;

  const routes = getRoutes();
  const { component, params } = resolvePage(routes, rawPath);

  const root = document.getElementById("app");
  if (!root) return;
  try {
    // get current page
    const pageKey = `page:${normalizedPath}`;
    // Use different layout keys for normal vs special layouts
    const layoutKey = isSpecial(normalizedPath) ? "__layout__:special" : "__layout__:normal";
    let inner = document.getElementById("spa-root");

    // if page is not loaded or someone ordered layout re render through passing triggerKey props
    if (!inner || triggerKey?.startsWith(LAYOUT_KEY) || layoutNeedsUpdate) {
      renderSubtree(
        () => rootLayout({ children: null }), //build the outer shell first
        root, // mount at root
        layoutKey, // track layout's its state independently with separate keys per type
        { track: false } // dont check layouts children at all
      );
      inner = document.getElementById("spa-root");
      if (!inner) throw new Error("spa-root not found after rendering RootLayout");
    }

    renderSubtree(() => component(params), inner, pageKey); //after grabing actual page now render that
  } catch (err) {
    console.error("⚠️ renderRoute error:", err);
  }
}

// Initializes the router by setting up event listeners for navigation and rendering the initial route.
export function initRouter() {
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;

    const link = (e.target as HTMLElement).closest("a");
    // Ensure it's a left click and not opening in new tab
    if (link && link.getAttribute("href")?.startsWith("/") && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      navigate(link.getAttribute("href")!);
    }
  });

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("routechange"));
    renderRoute();
  });

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
export function navigate(
  path: string,
  opts?: {
    replace?: boolean; // you can ask forcefull replacement of current url
    triggerLayout?: boolean; // you can ask forcefull replacement of layout
    state?: any; // you can pass state to the route
  }
) {
  const target = normalizePath(path.startsWith("/") ? path : `/${path}`); //appends if there is no slash at start
  const current = normalizePath(window.location.pathname); //get current url

  const shouldUpdateHistory = opts?.replace || target !== current; // check if user asked replacement 

  if (shouldUpdateHistory) {
    const method = opts?.replace ? "replaceState" : "pushState";
    history[method](opts?.state ?? {}, "", target);
    window.dispatchEvent(new Event("routechange"));
  }

  // Always render to ensure UI matches current state, 
  // unless it's a redundant push that wouldn't change anything.
  // BUT we render anyway because state might have changed.
  renderRoute(opts?.triggerLayout ? LAYOUT_KEY : undefined);
}




