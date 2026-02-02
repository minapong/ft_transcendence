// ==========================================
// hooks.ts — React-like hooks system
// ==========================================
// Each page gets isolated hook storage to prevent state collision.
// ==========================================

// Import renderRoute directly to avoid circular dependency through index
// Import renderRoute directly to avoid circular dependency through index
import { renderRoute } from "./render";

// Hook entry types
type StateEntry = { kind: "state"; value: any };
type MemoEntry = { kind: "memo"; value: any; deps: any[] };
type RefEntry = { kind: "ref"; current: any };
type CallbackEntry = { kind: "callback"; fn: any; deps: any[] };

type HookEntry = StateEntry | MemoEntry | RefEntry | CallbackEntry;

export function cleanupContext(key: string) {
	const ctx = contextMap.get(key);
	if (ctx) {
		cleanupEffects(ctx);
		ctx.effects.length = 0;
		ctx.pendingEffects.length = 0;
	}
}

// unique storage for only useEffects
type EffectEntry = { deps?: any[]; cleanup: (() => void) | null };
// unique storage for only useEffects


type HookContext = {
	hooks: HookEntry[];
	effects: EffectEntry[];
	pendingEffects: Array<() => void>;
	hookCount: number | null;
};

const contextMap = new Map<string, HookContext>();
const DEFAULT_KEY = "__default__";
let activeHookKey = DEFAULT_KEY;

function getContext(key: string): HookContext {
	let ctx = contextMap.get(key);
	if (!ctx) {
		ctx = { hooks: [], effects: [], pendingEffects: [], hookCount: null };
		contextMap.set(key, ctx);
	}
	return ctx;
}

let hooks = getContext(DEFAULT_KEY).hooks;
let effects = getContext(DEFAULT_KEY).effects;
let pendingEffects = getContext(DEFAULT_KEY).pendingEffects;
let hookIndex = 0;
let trackedKey: string | null = null;
let isCleaningUp = false;

export let pendingRefSetters: Array<() => void> = [];

export function runPendingRefs() {
	const list = pendingRefSetters;
	pendingRefSetters = [];
	for (const fn of list) fn();
}

// Reset index for a render; optionally track a key to clean up when that keyed view is replaced.
export function resetHooks(pageKey?: string, opts?: { track?: boolean }) {
	const nextKey = pageKey ?? DEFAULT_KEY;
	const shouldTrack = opts?.track !== false;
	const prevKey = shouldTrack ? (trackedKey ?? DEFAULT_KEY) : null;

	// Save the hook count for the PREVIOUS render BEFORE switching contexts
	if (activeHookKey !== DEFAULT_KEY) {
		const prevCtx = getContext(activeHookKey);
		if (prevCtx.hookCount !== null && hookIndex !== prevCtx.hookCount) {
			// console.warn(`Reactor: Hook count mismatch for key "${activeHookKey}". Expected ${prevCtx.hookCount}, got ${hookIndex}. This indicates hooks were called conditionally.`);
		}
		prevCtx.hookCount = hookIndex;
	}

	if (shouldTrack && prevKey && nextKey !== prevKey) {
		const prevCtx = getContext(prevKey);
		cleanupEffects(prevCtx);
		prevCtx.pendingEffects.length = 0;
		prevCtx.effects.length = 0; // make sure effects rerun on remount
	}

	const ctx = getContext(nextKey);
	hooks = ctx.hooks;
	effects = ctx.effects;
	pendingEffects = ctx.pendingEffects;
	activeHookKey = nextKey;
	if (shouldTrack) trackedKey = nextKey;
	hookIndex = 0;
}

// -----------------------------
//  useState
// -----------------------------
export function useState<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void] {
	const idx = hookIndex++;
	let entry = hooks[idx] as StateEntry | undefined;
	if (!entry || entry.kind !== "state") {
		entry = { kind: "state", value: initial };
		hooks[idx] = entry;
	}

	const stateKey = activeHookKey;
	const setState = (newValue: T | ((v: T) => T)) => {
		if (isCleaningUp) {
			// console.warn("Reactor: setState ignored during cleanup to prevent re-entry loops.");
			return;
		}
		const next = typeof newValue === "function"
			? (newValue as (v: T) => T)(entry!.value)
			: newValue;

		// Optimization: Don't re-render if state hasn't changed
		if (next === entry!.value) return;

		entry!.value = next;
		renderRoute(stateKey);
	};

	return [entry.value as T, setState];
}

export function getActiveHookKey() {
	return activeHookKey;
}
// -----------------------------
//  useEffect
// -----------------------------
export function useEffect(cb: () => void | (() => void), deps?: any[]) {
	const idx = hookIndex++;
	const prev = effects[idx];

	const queue = () => {
		// Record the effect before running it so rerenders triggered inside the cb
		// see a stable entry instead of thinking it's a brand-new effect.
		const prevCleanup = prev?.cleanup;
		const entry = { deps, cleanup: null as (() => void) | null };
		effects[idx] = entry;
		if (prevCleanup) prevCleanup();
		const cleanup = cb() || null;
		entry.cleanup = cleanup;
	};

	if (deps === undefined) {
		pendingEffects.push(queue);
		return;
	}

	if (!prev || depsChanged(prev.deps, deps)) {
		pendingEffects.push(queue);
		return;
	}

	effects[idx] = prev;
}

export { useEffect as useLayoutEffect };


export function flushEffects() {
	const list = [...pendingEffects];
	pendingEffects.length = 0;
	for (const fx of list) fx();
}

// -----------------------------
//  useRef
// -----------------------------
export function useRef<T>(initial: T): { current: T } {
	const idx = hookIndex++;
	let entry = hooks[idx] as RefEntry | undefined;
	if (!entry || entry.kind !== "ref") {
		entry = { kind: "ref", current: initial };
		hooks[idx] = entry;
	}
	return entry as { current: T };
}

// -----------------------------
//  useMemo
// -----------------------------
export function useMemo<T>(fn: () => T, deps: any[]): T {
	const idx = hookIndex++;
	const prev = hooks[idx] as MemoEntry | undefined;
	if (!prev || prev.kind !== "memo" || depsChanged(prev.deps, deps)) {
		const value = fn();
		hooks[idx] = { kind: "memo", value, deps };
		return value;
	}
	return prev.value;
}

// -----------------------------
//  useCallback
// -----------------------------
export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T {
	const idx = hookIndex++;
	const prev = hooks[idx] as CallbackEntry | undefined;
	if (!prev || prev.kind !== "callback" || depsChanged(prev.deps, deps)) {
		hooks[idx] = { kind: "callback", fn, deps };
		return fn;
	}
	return prev.fn;
}

// -----------------------------
//  useEventListener 
// -----------------------------
export function useEventListener<T extends Event>(
	eventName: string,
	handler: (event: T) => void,
	element: EventTarget | { current: any } = window
) {
	// Create a ref that stores handler
	const savedHandler = useRef(handler);

	// Update ref.current value if handler changes.
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	const elementKey = (element && typeof element === "object" && "current" in element)
		? (element as { current: any }).current
		: element;

	useEffect(() => {
		// Define the listening target
		const targetElement: EventTarget | null = (element && typeof element === "object" && "current" in element)
			? (element as { current: any }).current
			: (element as EventTarget);

		if (!(targetElement && targetElement.addEventListener)) {
			return;
		}

		// Create event listener that calls handler function stored in ref
		const eventListener: EventListener = (event: Event) => {
			if (savedHandler.current) {
				(savedHandler.current as (event: Event) => void)(event);
			}
		};

		targetElement.addEventListener(eventName, eventListener);

		// Remove event listener on cleanup
		return () => {
			targetElement.removeEventListener(eventName, eventListener);
		};
	}, [eventName, elementKey]); // Rebind if event name or resolved element changes.
}

function depsChanged(prev: any[] | undefined, next: any[]) {
	if (!prev || prev.length !== next.length) return true;
	for (let i = 0; i < next.length; i++) {
		if (next[i] !== prev[i]) return true;
	}
	return false;
}

function cleanupEffects(ctx: HookContext) {
	isCleaningUp = true;
	try {
		for (const entry of ctx.effects) {
			if (entry?.cleanup) entry.cleanup();
		}
	} finally {
		isCleaningUp = false;
	}
}
