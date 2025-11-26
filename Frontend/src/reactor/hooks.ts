// ==========================================
// ⚡ Reactor Hooks — Tiny React-like system
// ==========================================
import { renderRoute } from "."
let hooks: any[] = [] // storage for all of our hooks
let hookIndex = 0; //indexing through that storage
let pendingEffects: Array<() => void> = [];

export let pendingRefSetters: Array<() => void> = [];

export function runPendingRefs() {
	const list = pendingRefSetters;
	pendingRefSetters = [];
	for (const fn of list) fn();
}

export function resetHooks() {
	hookIndex = 0; //on every rerender hooks are reset to read from begining of array
	hooks = [];
}

// -----------------------------
//  useState
// -----------------------------
export function useState(initial: any) {

	const idx = hookIndex++;    // on every useState call index is iterated to store new func

	if (hooks[idx] === undefined) hooks[idx] = initial; //checks if its first render than sets initial which is useState(initial)

	const setState = (value: any) => {
		hooks[idx] =
			typeof value === "function" ? value(hooks[idx]) : value;

		// trigger rerender
		renderRoute();
		// import("./render").then(m => m.renderRoute());
	};

	return [hooks[idx], setState];
}

// -----------------------------
//  useEffect
// -----------------------------

//cb(callback)
export function useEffect(cb: () => void, deps?: any[]) {
// [] can be optional when calling like
//  useEffect(callback func()=>{},[])
//  [] can be skipped u will do this when u need to re render effects				

	const idx = hookIndex++; // iterate hook counter
	const prev = hooks[idx]; // grab current hook
	
	// it means re render effects everytime no dependencies
	if (deps === undefined) {
		pendingEffects.push(cb);
		hooks[idx] = undefined;
		return;
	}
	// it means re render effects everytime no dependencies

	//  First execution (no prev deps)
	if (!prev) {
		pendingEffects.push(cb);
		hooks[idx] = deps;
		return;
	}
	//  Check deps changed
	const hasChanged = deps.some((d, i) => d !== prev[i]);
	if (hasChanged) pendingEffects.push(cb);
	hooks[idx] = deps;
}


export function flushEffects() {
	console.log(
		"%cFLUSH CALLED FROM:%c\n" + new Error().stack,
		"color: #ff0; font-weight:bold;",
		"color:#0af"
	);
	console.log("pendingEffects BEFORE:", pendingEffects.length);
	console.log("route: ", window.location.pathname)
	for (const fx of pendingEffects) {
		fx();
	}

	pendingEffects = [];

	console.log("pendingEffects AFTER:", pendingEffects.length);
}

// -----------------------------
//  useRef
// -----------------------------
export function useRef(initial: any) {
	const idx = hookIndex++;
	if (!hooks[idx]) hooks[idx] = { current: initial };
	return hooks[idx];
}

// -----------------------------
//  useMemo
// -----------------------------
export function useMemo(fn: () => any, deps: any[]) {
	const idx = hookIndex++;
	const prev = hooks[idx];

	if (!prev || deps.some((d, i) => d !== prev.deps[i])) {
		const value = fn();
		hooks[idx] = { value, deps };
		return value;
	}

	return prev.value;
}
