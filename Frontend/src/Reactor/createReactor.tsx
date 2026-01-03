// ================================================================
// 🌱 createElement.ts — our own mini React-style JSX runtime
// ================================================================
//
// It lets us write JSX like:
//    <div id="box" style={{color:"red"}}>Hello</div>
// and have it become a real DOM element.
//
// ================================================================
import { pendingRefSetters } from "./hooks";

type ControlSnapshot = {
	value?: string;
	checked?: boolean;
	selectionStart?: number | null;
	selectionEnd?: number | null;
	selectionDirection?: "forward" | "backward" | "none" | null;
};

const controlStore = new Map<string, ControlSnapshot>();

// Applies properties to a DOM element, including styles, event listeners, and refs.
function applyProps(el: HTMLElement, props: any) {
	for (const [key, value] of Object.entries(props || {})) {
		if (key === "style" && typeof value === "object") {
			Object.assign(el.style, value);
		}
		else if (key === "ref") {
			if (typeof value === "function") {
				pendingRefSetters.push(() => value(el));
			} else if (value && typeof value === "object" && "current" in value) {
				pendingRefSetters.push(() => { value.current = el; });
			}
		}
		else if (key.startsWith("on") && typeof value === "function") {
			const event = key.slice(2).toLowerCase();
			el.addEventListener(event, value as EventListener); //temp fix for prod
		}
		else if (key !== "children" && value != null && value !== false) {
			if (key in el) (el as any)[key] = value;
			else el.setAttribute(key, String(value));
		}
	}
}

// Creates a custom element or component, applying props and attaching children.
export function createReactor(tag: any, props: any, ...children: any[]) {
	if (typeof tag === "function") {
		const rendered = tag({ ...(props || {}), children });
		if (rendered instanceof HTMLElement) {
			const p = props || {};
			// merge className
			if (p.className) {
				rendered.className = rendered.className
					? rendered.className + " " + p.className
					: p.className;
			}
			// apply props except className/children
			const { className, children: _c, ...rest } = p;
			applyProps(rendered, rest);
		}
		return rendered;
	}
	const el = document.createElement(tag);
	for (const child of children.flat()) attachChild(el, child);
	applyProps(el, props);
	return el;
}

// Attaches a child node to a parent DOM element, handling various child types.
function attachChild(parent: HTMLElement, child: any) {
	if (child == null || child === false) return;
	if (typeof child === "string" || typeof child === "number")
		parent.appendChild(document.createTextNode(String(child)));
	else if (child instanceof Node) parent.appendChild(child);
	else if (Array.isArray(child)) child.forEach(c => attachChild(parent, c));
}


// expose aliases so the TypeScript JSX compiler knows what to call
// attach globally for runtime use (Vite/TSX looks for this name)
(window as any).createReactor = createReactor;
