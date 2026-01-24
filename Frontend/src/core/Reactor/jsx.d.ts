// JSX namespace for TypeScript JSX support
declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
	interface Element extends HTMLElement {}
}

// Module declarations for Reactor imports
declare module "Reactor" {
	export function createReactor(type: any, props: any, ...children: any[]): HTMLElement;
	export function Fragment(props: { children?: any }): DocumentFragment;
	export function useState<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void];
	export function useEffect(cb: () => void | (() => void), deps?: any[]): void;
	export function useRef<T>(initial: T): { current: T };
	export function useMemo<T>(fn: () => T, deps: any[]): T;
	export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
	export function navigate(path: string, opts?: { replace?: boolean; triggerLayout?: boolean; state?: any }): void;
	export function initRouter(): void;
	export function renderRoute(triggerKey?: string): void;
	export function openModal<T>(modal: { type: string; payload?: T; render?: (p: T) => HTMLElement; label?: string }): void;
	export function closeModal(): void;
}

