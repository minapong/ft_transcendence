// ==========================================
// ⚡ Reactor Hooks — Tiny React-like system
// ==========================================
import {renderRoute} from "."
let hooks:any[]=[] // storage for all of our hooks
let hookIndex = 0; //indexing through that storage
let pendingEffects: Array<() => void> = [];

export function resetHooks() {
    hookIndex = 0; //on every rerender hooks are reset to read from begining of array
}

// -----------------------------
//  useState
// -----------------------------
export function useState(initial: any) {

	const idx = hookIndex++;    // on every useState call index is iterated to store new func

    if (hooks[idx] === undefined) hooks[idx] = initial; //checks if its first render than sets initial which is useState(initial)
 	
    const setState = (value:any) => {
        hooks[idx] =
        typeof value  === "function" ? value(hooks[idx]) : value;

		// trigger rerender
		renderRoute();
		// import("./render").then(m => m.renderRoute());
	};

	return [hooks[idx], setState];
}

// -----------------------------
//  useEffect
// -----------------------------
export function useEffect(cb: () => void, deps: any[]) {
	const idx = hookIndex++;
	const prev = hooks[idx];

	const hasChanged =
		!prev || deps.some((d, i) => d !== prev[i]);

	if (hasChanged) pendingEffects.push(cb);

	hooks[idx] = deps;
}

export function flushEffects() {
	const effects = pendingEffects;
	pendingEffects = [];
	for (const fn of effects) fn();
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
