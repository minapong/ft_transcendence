// ==========================================
// ⚡ Reactor Hooks — Tiny React-like system
// ==========================================
import { renderRoute } from "."

let hooks: any[] = [] // storage for all of our hooks
let hookIndex = 0; //indexing through that storage

export let pendingRefSetters: Array<() => void> = [];

export function runPendingRefs() {
	const list = pendingRefSetters;
	pendingRefSetters = [];
	for (const fn of list) fn();
}

export function resetHooks() {
	hookIndex = 0; //on every rerender hooks are reset to read from begining of array
}

// -----------------------------
//  useState
// -----------------------------
export function useStatse(initial: any) {
	const idx = hookIndex++;    // on every useState call index is iterated to store new func
	if (hooks[idx] === undefined) hooks[idx] = initial; //checks if its first render than sets initial which is useState(initial)
	const setState = (value: any) => {
		hooks[idx] = typeof value === "function" ? value(hooks[idx]) : value;
			// trigger rerender
		renderRoute();
		console.log("triggered");
	};
	return [hooks[idx], setState];
}
type StateEntry = { value: any };

export function useState(initial: any) {
	const idx = hookIndex++;
	if (!hooks[idx]) {
	  hooks[idx] = { value: initial } as StateEntry;
	}
	const setState = (newValue: any) => {
	  const entry = hooks[idx] as StateEntry;
  
	  entry.value =
		typeof newValue === "function"
		  ? newValue(entry.value)
		  : newValue;
  
	  renderRoute(); // your rerender trigger
	};
  
	return [(hooks[idx] as StateEntry).value, setState];
  }
// -----------------------------
//  useEffect
// -----------------------------

let pendingEffects: Array<() => void> = []; // for useeffect, callback storage

type Effects = {
	deps?:any;
	cleanup?:(()=>void) | null;
}
//cb(callback)
export function useEffect(cb: () => void | (()=> void), deps?: any[]) {
	const idx = hookIndex++; // iterate hook counter
	const prev:Effects | undefined = hooks[idx]; // grab current hook
	
	// it means re render effects everytime no dependencies
	if (deps === undefined) {
		pendingEffects.push(()=> {
			if(prev?.cleanup)prev.cleanup(); //if cleanup exists run()
			const clean = cb() || null; //if the user returns it becomes cleanup for next iteration
			hooks[idx]= {deps:undefined,clean}; //erase the old dep and write new instructions
		});
		return;
	}
	//  First execution (no prev deps)
	if (!prev) {
		pendingEffects.push(()=>{
			const cleanup = cb() || null;
			hooks[idx] = {deps:deps,cleanup};
		});
		return;
	}
	//  Check all deps changed or not
	const hasChanged = deps.some((d, i) => d !== prev.deps?.[i]);
	if (hasChanged) pendingEffects.push(()=>{
		if(prev?.cleanup) prev.cleanup();
		const cleanup = cb() || null;
		hooks[idx]  = {deps:deps,cleanup};
	});
}


export function flushEffects() {
	const list = [...pendingEffects];
	pendingEffects.length = 0;
	for (const fx of list) fx();
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
