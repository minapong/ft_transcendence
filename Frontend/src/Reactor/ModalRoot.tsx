import { closeModal, getCurrentModal, resolveModalRenderer } from "./modal";
import { useEffect, useRef } from "./hooks";
import type { ModalDescriptor } from "./modal";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "input:not([disabled]):not([type=\"hidden\"])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable=\"true\"]",
  "[tabindex]:not([tabindex=\"-1\"])",
].join(", ");

function getFocusableElements(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.getAttribute("aria-hidden") !== "true"
  );
}

// Renders the single global modal slot backed by Reactor's modal state.
export default function ModalRoot() {
  const modal = getCurrentModal();
  const renderer = resolveModalRenderer(modal);
  const panelRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const prevOverflowRef = useRef<string>("");

  useEffect(() => {
    if (!modal) return;
    const panel = panelRef.current;
    if (!panel) return;

    lastFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const preferred =
      panel.querySelector<HTMLElement>("[data-modal-autofocus]") ??
      getFocusableElements(panel)[0] ??
      closeRef.current ??
      panel;
    preferred?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = getFocusableElements(panel);
      if (focusables.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (!active || active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }
      if (!active || active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflowRef.current;
      lastFocusRef.current?.focus();
    };
  }, [modal]);

  const isOpen = Boolean(modal);
  const layerClass = isOpen ? "modal-layer modal-layer--open" : "modal-layer";

  if (!isOpen) {
    return <div id="modal-root" className={layerClass} aria-hidden="true" />;
  }

  const content = renderer
    ? renderer(modal!.payload ?? {})
    : renderFallback(modal!);

  return (
    <div id="modal-root" className={layerClass} role="presentation">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div
        className="modal-panel panel-surface panel-surface--heavy"
        role="dialog"
        aria-modal="true"
        aria-label={modal!.label ?? modal!.type}
        tabIndex={-1}
        ref={panelRef}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close modal"
          onClick={closeModal}
          ref={closeRef}
        >
          <span className="icon-[solar--close-circle-linear] text-lg" aria-hidden="true" />
        </button>
        {content}
      </div>
    </div>
  );
}

function renderFallback(modal: ModalDescriptor) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p className="font-semibold">Missing modal renderer</p>
      <p className="text-slate-300">Type: {modal.type}</p>
    </div>
  );
}
