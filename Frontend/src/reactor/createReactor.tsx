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
	// if the tag is a component function, just call it
	if (typeof tag === "function") {
		return tag({ ...(props || {}), children });
	}

	// otherwise it's a native HTML tag
	const element = document.createElement(tag);

	// loop over every prop and apply it
	for (const [key, value] of Object.entries(props || {})) {
		if (key === "style" && typeof value === "object") {
			// handle style objects like { background:"red" }
			Object.assign(element.style, value);
		} else if (key === "ref" && typeof value === "function") {
			// handle ref callback -> gives back the DOM node
			value(element);
		} else if (key !== "children") {
			// assign everything else (id, onclick, textContent, etc.)
			(element as any)[key] = value;
		}
	}

	// now attach all children (text, numbers, or elements)
	for (const child of children.flat()) {
		attachChild(element, child);
	}

	return element;
}

// helper that actually appends a child to a parent element
function attachChild(parent: HTMLElement, child: any) {
	if (child == null) return;
	if (typeof child === "string" || typeof child === "number") {
		parent.append(document.createTextNode(String(child)));
	} else if (child instanceof Node) {
		parent.append(child);
	}
}

// expose aliases so the TypeScript JSX compiler knows what to call
// attach globally for runtime use (Vite/TSX looks for this name)
(window as any).createReactor = createReactor;
