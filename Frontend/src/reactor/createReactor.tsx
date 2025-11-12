// ================================================================
// 🌱 createElement.ts — our own mini React-style JSX runtime
// ================================================================
//
// It lets us write JSX like:
//    <div id="box" style={{color:"red"}}>Hello</div>
// and have it become a real DOM element.
//
// ================================================================


export function createReactor(tag: any, props: any, ...children: any[]) {
	if (typeof tag === "function") return tag({ ...(props || {}), children });

	const el = document.createElement(tag);
	// so it just takes all actual key values from object.entries object entries make it in an array than for loop lables them key value
	for (const [key, value] of Object.entries(props || {})) {
		if (key === "style" && typeof value === "object") {
			Object.assign(el.style, value);
		}
		else if (key === "ref" && typeof value === "function") {
			value(el);
		}
		// 🎯 ONE single event rule
		else if (key.startsWith("on") && typeof value === "function") {
			const event = key.slice(2).toLowerCase(); // onClick → "click"
			el.addEventListener(event, value);
		}
		else if (key !== "children" && value != null && value !== false) {
			// Known DOM property → assign directly
			if (key in el) (el as any)[key] = value;
			// Otherwise treat as attribute
			else el.setAttribute(key, String(value));
		}
	}

	for (const child of children.flat()) attachChild(el, child);
	return el;
}

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

// ================================================================
// JSX Runtime hooks for TypeScript "react-jsx" mode (added for dev mode
// ================================================================
export function jsx(type: any, props: any, key?: any) {
	return createReactor(type, { ...props, key });
  }
  
  export const jsxs = jsx;
  
  export const Fragment = (props: any) => props.children;
  
  export function jsxDEV(type: any, props: any, key?: any, isStatic?: any, source?: any, self?: any) {
	return createReactor(type, { ...props, key });
  }
  


