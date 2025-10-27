import { createReactor } from "reactor"

export function buildRoutes() {
  const pages = import.meta.glob("/src/pages/**/*.tsx", { eager: true })
  const routes: Record<string, any> = {}

  for (const path in pages) {
    let route = path
      .replace("/src/pages", "")
      .replace(/index\.tsx$/, "")
      .replace(/\.tsx$/, "")
      .toLowerCase()
    if (route === "") route = "/"
    routes[route] = (pages[path] as any).default
  }

  console.log("🧭 routes:", routes)
  return routes
}

export function renderRoute() {
  const routes = buildRoutes()
  const path = window.location.pathname.toLowerCase()
  const Page = routes[path]
  const root = document.getElementById("app")
  if (!root) return
  root.innerHTML = ""
  if (Page) root.append(Page())
  else root.append(notFound())
}

function notFound() {
  return createReactor("div", { style: { color: "red" } }, "404 - Not Found")
}
