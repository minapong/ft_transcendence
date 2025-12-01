// ==========================================
// ⚡ Reactor Hooks — Tiny React-like system
// ==========================================
import { renderRoute } from ".";

type StateEntry = { kind: "state"; value: any };
type MemoEntry = { kind: "memo"; value: any; deps: any[] };
type RefEntry = { kind: "ref"; current: any };

type HookEntry = StateEntry | MemoEntry | RefEntry;

type EffectEntry = { deps?: any[]; cleanup: (() => void) | null };
type HookContext = {
	hooks: HookEntry[];
	effects: EffectEntry[];
	pendingEffects: Array<() => void>;
};

const contextMap = new Map<string, HookContext>();
const DEFAULT_KEY = "__default__";

function getContext(key: string): HookContext {
	let ctx = contextMap.get(key);
	if (!ctx) {
		ctx = { hooks: [], effects: [], pendingEffects: [] };
		contextMap.set(key, ctx);
	}
	return ctx;
}

let hooks = getContext(DEFAULT_KEY).hooks;
let effects = getContext(DEFAULT_KEY).effects;
let pendingEffects = getContext(DEFAULT_KEY).pendingEffects;
let hookIndex = 0;
let lastPageKey: string | null = null;

export let pendingRefSetters: Array<() => void> = [];

export function runPendingRefs() {
	const list = pendingRefSetters;
	pendingRefSetters = [];
	for (const fn of list) fn();
}

// Reset index for a render; swap to page-specific hook store and cleanup old effects when navigating.
export function resetHooks(pageKey?: string) {
	const nextKey = pageKey ?? DEFAULT_KEY;
	const prevKey = lastPageKey ?? DEFAULT_KEY;

	if (nextKey !== prevKey) {
		const prevCtx = getContext(prevKey);
		cleanupEffects(prevCtx);
		prevCtx.pendingEffects.length = 0;
		prevCtx.effects.length = 0; // make sure effects rerun on remount
	}

	const ctx = getContext(nextKey);
	hooks = ctx.hooks;
	effects = ctx.effects;
	pendingEffects = ctx.pendingEffects;
	lastPageKey = nextKey;
	hookIndex = 0;
}

// -----------------------------
//  useState
// -----------------------------
export function useState(initial: any) {
	const idx = hookIndex++;
	let entry = hooks[idx] as StateEntry | undefined;
	if (!entry || entry.kind !== "state") {
		entry = { kind: "state", value: initial };
		hooks[idx] = entry;
	}

	const setState = (newValue: any) => {
		entry!.value = typeof newValue === "function" ? newValue(entry!.value) : newValue;
		renderRoute();
	};

	return [entry.value, setState];
}
// -----------------------------
//  useEffect
// -----------------------------
export function useEffect(cb: () => void | (() => void), deps?: any[]) {
	const idx = hookIndex++;
	const prev = effects[idx];

	const queue = () => {
		if (prev?.cleanup) prev.cleanup();
		const cleanup = cb() || null;
		effects[idx] = { deps, cleanup };
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
	let entry = hooks[idx] as RefEntry | undefined;
	if (!entry || entry.kind !== "ref") {
		entry = { kind: "ref", current: initial };
		hooks[idx] = entry;
	}
	return entry;
}
// -----------------------------
//  useMemo
// -----------------------------
export function useMemo(fn: () => any, deps: any[]) {
	const idx = hookIndex++;
	const prev = hooks[idx] as MemoEntry | undefined;
	if (!prev || prev.kind !== "memo" || depsChanged(prev.deps, deps)) {
		const value = fn();
		hooks[idx] = { kind: "memo", value, deps };
		return value;
	}
	return prev.value;
}

function depsChanged(prev: any[] | undefined, next: any[]) {
	if (!prev || prev.length !== next.length) return true;
	for (let i = 0; i < next.length; i++) {
		if (next[i] !== prev[i]) return true;
	}
	return false;
}

function cleanupEffects(ctx: HookContext) {
	for (const entry of ctx.effects) {
		if (entry?.cleanup) entry.cleanup();
	}
}
