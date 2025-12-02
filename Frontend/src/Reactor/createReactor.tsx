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
			el.addEventListener(event, value);
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
	applyProps(el, props);
	maybeRegisterPersistentControl(el, props);
	for (const child of children.flat()) attachChild(el, child);
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


function maybeRegisterPersistentControl(el: HTMLElement, props: any) {
	if (!isFormControl(el)) return;
	pendingRefSetters.push(() => {
		if (!el.isConnected) return;
		const root = el.closest('[data-reactor-root]') as HTMLElement | null;
		const rootKey = root?.getAttribute('data-reactor-root');
		if (!root || !rootKey) return;
		const key = buildPersistKey(root, rootKey, el, props);
		if (!key) return;
		const current = controlStore.get(key);
		if (current) applyControlSnapshot(el, current);
		const update = () => controlStore.set(key, captureControlSnapshot(el));
		el.addEventListener('input', update);
		el.addEventListener('change', update);
		update();
	});
}

function buildPersistKey(root: HTMLElement, rootKey: string, el: HTMLElement, props: any) {
	let explicit = props?.['data-persist'] || el.getAttribute('data-persist') || el.id;
	if (!explicit && 'name' in el) {
		const named = (el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).name;
		if (named) explicit = named;
	}
	const path = getElementPath(root, el);
	if (!explicit && !path) return null;
	return `${rootKey}:${explicit ?? path}`;
}

function getElementPath(root: HTMLElement, el: Element) {
	const parts: string[] = [];
	let current: Element | null = el;
	while (current && current !== root) {
		const parent = current.parentElement;
		if (!parent) return null;
		const index = Array.prototype.indexOf.call(parent.children, current);
		parts.push(`${current.tagName}:${index}`);
		current = parent;
	}
	if (current !== root) return null;
	parts.reverse();
	return parts.join('/');
}

function isFormControl(el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
	if (el instanceof HTMLInputElement) {
		return el.type !== "file";
	}
	return el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
}

function captureControlSnapshot(el: HTMLElement): ControlSnapshot {
	const snap: ControlSnapshot = {};
	if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
		snap.value = el.value;
	}
	if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
		snap.checked = el.checked;
	}
	if ('selectionStart' in el && 'selectionEnd' in el) {
		snap.selectionStart = (el as HTMLInputElement | HTMLTextAreaElement).selectionStart;
		snap.selectionEnd = (el as HTMLInputElement | HTMLTextAreaElement).selectionEnd;
		snap.selectionDirection = (el as HTMLInputElement | HTMLTextAreaElement).selectionDirection;
	}
	return snap;
}

function applyControlSnapshot(el: HTMLElement, snap: ControlSnapshot) {
	if (!snap) return;
	if (snap.value !== undefined && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) {
		el.value = snap.value;
	}
	if (snap.checked !== undefined && el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
		el.checked = snap.checked;
	}
	if (snap.selectionStart != null && snap.selectionEnd != null && 'setSelectionRange' in el) {
		(el as HTMLInputElement | HTMLTextAreaElement).setSelectionRange(
			snap.selectionStart,
			snap.selectionEnd,
			snap.selectionDirection ?? undefined
		);
	}
}


// expose aliases so the TypeScript JSX compiler knows what to call
// attach globally for runtime use (Vite/TSX looks for this name)
(window as any).createReactor = createReactor;
