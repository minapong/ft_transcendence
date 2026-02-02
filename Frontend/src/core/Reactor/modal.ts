import { LAYOUT_KEY, renderRoute } from "./render";

export type ModalDescriptor<T = unknown> = {
  type: string;
  payload?: T;
  render?: ModalRenderer<T>;
  label?: string;
  className?: string;
};

export type ModalRenderer<T = unknown> = (payload: T) => HTMLElement;

let currentModal: ModalDescriptor | null = null;
const registry = new Map<string, ModalRenderer<any>>();
let requestRerender: (triggerKey?: string) => void = (key?: string) => renderRoute(key ?? LAYOUT_KEY);

export function getCurrentModal() {
  return currentModal;
}

export function openModal<T>(modal: ModalDescriptor<T>) {
  if (!modal || !modal.type) return;
  currentModal = modal;
  if (!modal.render && !registry.has(modal.type)) {
    console.warn(`[modal] Missing renderer for type "${modal.type}"`);
  }
  requestRerender(LAYOUT_KEY);
  window.dispatchEvent(new Event("pong:pause"));
}

export function closeModal() {
  if (!currentModal) return;
  currentModal = null;
  requestRerender(LAYOUT_KEY);
}

export function registerModal<T>(type: string, renderer: ModalRenderer<T>) {
  registry.set(type, renderer as ModalRenderer<any>);
}

export function resolveModalRenderer(modal: ModalDescriptor | null) {
  if (!modal) return null;
  if (typeof modal.render === "function") return modal.render;
  return registry.get(modal.type) ?? null;
}

// Allow tests (or advanced hosts) to control how a re-render is requested.
export function setModalRerender(fn: (triggerKey?: string) => void) {
  requestRerender = fn;
}
