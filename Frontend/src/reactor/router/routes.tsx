const pages = import.meta.glob("/src/pages/**/*.tsx", { eager: true });
type RouteMap = Record<string, any>;
let cache: RouteMap | null = null;

// Retrieves all routes by dynamically importing page components.
export function getRoutes(): RouteMap {
  if (cache) return cache;
  const routes: RouteMap = {};
  for (const path in pages) {
    let route = path
      .replace("/src/pages", "")
      .replace(/index\.tsx$/, "")
      .replace(/\.tsx$/, "")
      .toLowerCase();
    if (route === "") route = "/";
    routes[route] = (pages[path] as any).default;
  }
  cache = routes;
  console.log("🧭 routes:", routes);
  return routes;
}

// Resolves the page component for a given path, normalizing the path and handling not found cases.
export function resolvePage(routes: RouteMap, rawPath: string) {
  const original = rawPath;
  let path = rawPath.toLowerCase().replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
  if (original !== path) history.replaceState({}, "", path);
  path = path.split(/[?#]/)[0];
  return routes[path] ?? routes["/notfound"];
}
