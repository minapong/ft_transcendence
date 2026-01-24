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
	export function resetHooks(key: string, opts?: { track?: boolean }): void;
	
	// Modal functions
	export type ModalRenderer<T = unknown> = (payload: T) => HTMLElement;
	export type ModalDescriptor<T = unknown> = {
		type: string;
		payload?: T;
		render?: ModalRenderer<T>;
		label?: string;
	};
	export function openModal<T>(modal: ModalDescriptor<T>): void;
	export function closeModal(): void;
	export function registerModal<T>(type: string, renderer: ModalRenderer<T>): void;
	export function getCurrentModal(): ModalDescriptor | null;
	export function resolveModalRenderer(modal: ModalDescriptor | null): ModalRenderer<any> | null;
}

