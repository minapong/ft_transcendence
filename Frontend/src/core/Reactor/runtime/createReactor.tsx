// ================================================================
// createReactor.tsx — Custom JSX runtime
// ================================================================
// Transforms JSX into real DOM elements:
//   <div id="box" style={{color:"red"}}>Hello</div>
// ================================================================

import { pendingRefSetters } from "../core/hooks";

// Applies properties to a DOM element (styles, events, refs, attributes)
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
			el.addEventListener(event, value as EventListener);
		}
		else if (key !== "children" && value != null && value !== false) {
			if (key in el) (el as any)[key] = value;
			else el.setAttribute(key, String(value));
		}
	}
}

// Creates a custom element or component, applying props and attaching children.
export function createReactor(tag: any, props: any, ...children: any[]) {
	const p = props || {};

	// Handle forwardRef objects
	if (tag && typeof tag === "object" && tag.$$typeof === Symbol.for('reactor.forward_ref')) {
		const { ref, ...restProps } = p;
		return tag.render({ ...restProps, children }, ref);
	}

	if (typeof tag === "function") {
		const rendered = tag({ ...p, children });
		if (rendered instanceof HTMLElement) {
			// merge className
			if (p.className) {
				rendered.className = rendered.className
					? rendered.className + " " + p.className
					: p.className;
			}
			// apply props except className/children/ref
			// We exclude 'ref' here because it should be handled inside the component 
			// if it's a component, or handled by forwardRef above.
			const { className, children: _c, ref, ...rest } = p;
			applyProps(rendered, rest);
		}
		return rendered;
	}
	const el = document.createElement(tag);
	// Append children before applying props so form controls (like <select>)
	// can correctly pick up their value/selection after options exist.
	for (const child of children.flat()) attachChild(el, child);
	applyProps(el, p);
	return el;
}

/**
 * forwardRef helper
 * Usage: const MyComp = forwardRef((props, ref) => <div ref={ref} />)
 */
export function forwardRef(render: any) {
	return {
		$$typeof: Symbol.for('reactor.forward_ref'),
		render
	};
}

// Attaches a child node to a parent DOM element, handling various child types.
function attachChild(parent: HTMLElement, child: any) {
	if (child == null || child === false) return;
	if (typeof child === "string" || typeof child === "number")
		parent.appendChild(document.createTextNode(String(child)));
	else if (child instanceof Node) parent.appendChild(child);
	else if (Array.isArray(child)) child.forEach(c => attachChild(parent, c));
}

// Fragment support - returns children without a wrapper element
// Usage: <Fragment>...</Fragment> or <>...</>
export function Fragment({ children }: { children?: any }): DocumentFragment {
	const fragment = document.createDocumentFragment();
	const childArray = Array.isArray(children) ? children.flat() : [children];
	for (const child of childArray) {
		if (child == null || child === false) continue;
		if (typeof child === "string" || typeof child === "number") {
			fragment.appendChild(document.createTextNode(String(child)));
		} else if (child instanceof Node) {
			fragment.appendChild(child);
		} else if (Array.isArray(child)) {
			child.forEach(c => {
				if (c == null || c === false) return;
				if (typeof c === "string" || typeof c === "number") {
					fragment.appendChild(document.createTextNode(String(c)));
				} else if (c instanceof Node) {
					fragment.appendChild(c);
				}
			});
		}
	}
	return fragment;
}

// expose aliases so the TypeScript JSX compiler knows what to call
// attach globally for runtime use (Vite/TSX looks for this name)
(window as any).createReactor = createReactor;
(window as any).Fragment = Fragment;
