import rootLayout from "@/app/components/layout/RootLayout";
import { resetHooks, flushEffects, runPendingRefs, cleanupContext } from "./hooks";
import { getRoutes, resolvePage, isSpecialLayout } from "./router/routes";
import { startTransition, endTransition } from "./router/transition";

// Shared key so layout-level state (including modals) can trigger a shell re-render.
export const LAYOUT_KEY = "__layout__";

// Track navigation state globally
let transitioningTarget: string | null = null;
let isTransitioning = false;
let routerInitialized = false;

// Track the last known path for layout swap detection
let lastKnownPath = "";


// Renders the current route by resolving the page component and updating the DOM.
export function renderRoute(triggerKey?: string) {
  const rawPath = window.location.pathname;
  const normalizedPath = normalizePath(rawPath);
  console.log("🎨 renderRoute:", normalizedPath, triggerKey ? `(trigger: ${triggerKey})` : "");

  // Detect layout swap BEFORE updating lastKnownPath
  const prevIsSpecial = lastKnownPath ? isSpecialLayout(lastKnownPath) : null;
  const nextIsSpecial = isSpecialLayout(normalizedPath);
  const layoutNeedsUpdate = prevIsSpecial !== null && prevIsSpecial !== nextIsSpecial;

  lastKnownPath = normalizedPath;
  document.title = getPageTitle(normalizedPath);

  const { component, params } = resolvePage(getRoutes(), rawPath);
  const root = document.getElementById("app");
  if (!root) return;

  try {
    const layoutKey = nextIsSpecial ? "__layout__:special" : "__layout__:normal";
    let inner = document.getElementById("spa-root");

    // Re-render layout if type changed, if missing, or if explicitly requested (including via hooks)
    if (!inner || layoutNeedsUpdate || triggerKey?.startsWith(LAYOUT_KEY)) {
      if (layoutNeedsUpdate) {
        cleanupContext(prevIsSpecial ? "__layout__:special" : "__layout__:normal");
      }
      renderSubtree(() => rootLayout({ children: null }), root, layoutKey, { track: false });
      inner = document.getElementById("spa-root");
    }

    if (!component) {
      console.error("🧭 Route resolved to null component for path:", normalizedPath);
      return;
    }

    if (inner) {
      renderSubtree(() => {
        try {
          return component(params);
        } catch (err) {
          console.error("🧭 Page render error:", err);
          const errorBox = document.createElement("div");
          errorBox.innerHTML = `<div style="padding: 2rem; color: #f87171; background: #7f1d1d22; border: 1px solid #7f1d1d44; border-radius: 0.5rem; margin: 2rem;">
                    <h2 style="font-weight: bold; margin-bottom: 0.5rem;">Render Error</h2>
                    <p style="font-family: monospace; font-size: 0.875rem;">${(err as Error).message}</p>
                    <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">Reload System</button>
                </div>`;
          return errorBox;
        }
      }, inner, `page:${normalizedPath}`);
    }
  } catch (err) {
    console.error("⚠️ renderRoute error:", err);
  }
}

// Initializes the router
export function initRouter() {
  if (routerInitialized) return;
  routerInitialized = true;

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    const link = (e.target as HTMLElement).closest("a");
    if (link && link.getAttribute("href")?.startsWith("/") && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      navigate(link.getAttribute("href")!);
    }
  });

  window.addEventListener("popstate", async () => {
    // Browser has already changed URL. Sync app state.
    const target = normalizePath(window.location.pathname);
    console.log("🔄 popstate event:", target);

    // Notify reactive components (sidebar, header) that URL changed
    window.dispatchEvent(new Event("routechange"));

    transitioningTarget = target;
    isTransitioning = true;

    try {
      await startTransition({
        direction: "backward",
        weight: isHeavyRoute(target) ? "heavy" : "normal"
      });

      renderRoute();
      await endTransition();
    } catch (err) {
      renderRoute();
    } finally {
      isTransitioning = false;
      if (transitioningTarget === target) transitioningTarget = null;
    }
  });

  renderRoute();
}

function normalizePath(rawPath: string) {
  let path = rawPath.toLowerCase().replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
  return path.split(/[?#]/)[0];
}

// Generates a human-readable page title from the route path
function getPageTitle(path: string): string {
  const normalized = normalizePath(path);

  // Handle homepage
  if (normalized === "/") return "Mina - Home";

  // Split path into segments and capitalize each
  const segments = normalized.split("/").filter(Boolean);

  // Convert segments to title case and join
  const title = segments
    .map(segment => {
      // Handle common abbreviations
      if (segment === "4p") return "4P";

      // Replace underscores with spaces and capitalize
      return segment
        .replace(/_/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    })
    .join(" - ");

  return `Mina - ${title}`;
}

function renderSubtree(renderFn: () => HTMLElement, container: HTMLElement, key: string, opts?: { track?: boolean }) {
  resetHooks(key, opts); //reset context on every page switch
  const el = renderFn(); //call the components funcs to make tree
  container.replaceChildren(el); //replace the content of page and add new
  runPendingRefs(); // after all dom is made now run ref.current = elemtent for every queued ref
  flushEffects(); // at last after ref flush all the effects execute all effect callback
}

/**
 * Programmatic navigation helper.
 * De-duplicates overlapping transitions and prevents history state clutter.
 */
export async function navigate(path: string, opts?: { replace?: boolean; triggerLayout?: boolean; state?: any }) {
  const target = normalizePath(path);
  const current = normalizePath(window.location.pathname);
  console.log("🚀 navigate start:", target, opts?.replace ? "(replace)" : "");

  // Debounce: If already navigating to this exact destination, ignore.
  if (isTransitioning && target === transitioningTarget) {
    console.log("🛑 navigate blocked (already transitioning to target):", target);
    return;
  }

  // Optimization: If already there and not forcing, just re-sync UI.
  if (!opts?.replace && target === current && !isTransitioning) {
    console.log("⏭️ navigate skip (already at target):", target);
    renderRoute(opts?.triggerLayout ? LAYOUT_KEY : undefined);
    return;
  }

  isTransitioning = true;
  transitioningTarget = target;

  try {
    // Spatial animation
    await startTransition({
      direction: "forward",
      weight: isHeavyRoute(target) ? "heavy" : "normal"
    });

    // 3. Final atomic history check
    const finalCurrent = normalizePath(window.location.pathname);
    if (opts?.replace) {
      console.log("📌 history.replaceState:", target);
      history.replaceState(opts?.state ?? {}, "", target);
      window.dispatchEvent(new Event("routechange"));
    } else if (target !== finalCurrent) {
      console.log("📌 history.pushState:", target);
      history.pushState(opts?.state ?? {}, "", target);
      window.dispatchEvent(new Event("routechange"));
    } else {
      console.log("⏭️ navigate skip push (already at target):", target);
    }

    renderRoute(opts?.triggerLayout ? LAYOUT_KEY : undefined);
    await endTransition();
  } catch (err) {
    console.error("🧭 Navigation failed:", err);
    renderRoute();
  } finally {
    isTransitioning = false;
    if (transitioningTarget === target) transitioningTarget = null;
    console.log("🏁 navigate finished:", target);
  }
}

/**
 * Determines if a route is "heavy" (e.g. game or tournament)
 * to trigger a more deliberate signature move.
 */
function isHeavyRoute(path: string): boolean {
  const p = normalizePath(path);
  return p.startsWith("/game") || p.startsWith("/tournament");
}
