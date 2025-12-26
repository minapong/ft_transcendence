import { LAYOUT_KEY, renderRoute } from "./render";

export type ModalDescriptor = {
  type: string;
  payload?: any;
  render?: ModalRenderer;
};

export type ModalRenderer = (payload: any) => HTMLElement;

let currentModal: ModalDescriptor | null = null;
const registry = new Map<string, ModalRenderer>();
let requestRerender: (triggerKey?: string) => void = (key?: string) => renderRoute(key ?? LAYOUT_KEY);

export function getCurrentModal() {
  return currentModal;
}

export function openModal(modal: ModalDescriptor) {
  if (!modal || !modal.type) return;
  currentModal = modal;
  requestRerender(LAYOUT_KEY);
}

export function closeModal() {
  if (!currentModal) return;
  currentModal = null;
  requestRerender(LAYOUT_KEY);
}

export function registerModal(type: string, renderer: ModalRenderer) {
  registry.set(type, renderer);
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
