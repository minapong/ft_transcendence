// ================================================================
// 🌱 createElement.ts — our own mini React-style JSX runtime
// ================================================================
//
// It lets us write JSX like:
//    <div id="box" style={{color:"red"}}>Hello</div>
// and have it become a real DOM element.
//
// ================================================================


function applyProps(el: HTMLElement, props: any) {
	for (const [key, value] of Object.entries(props || {})) {
		if (key === "style" && typeof value === "object") {
			Object.assign(el.style, value);
		}
		else if (key === "ref") {
			if (typeof value === "function") {
				value(el);
			} else if (value && typeof value === "object" && "current" in value) {
				(value as { current: any }).current = el;
			}
		}
		else if (key.startsWith("on") && typeof value === "function") {
			const event = key.slice(2).toLowerCase();
			el.addEventListener(event, value);
		}
		else if (key !== "children" && value != null && value !== false) {
			if (key in el) (el as any)[key] = value;
			else el.setAttribute(key, String(value));
		}
	}
}

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
	applyProps(el, props);

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
