## Custom Minor Module — Global Modal Infrastructure (1 pt)

### Module Name

**Global Modal Infrastructure (Framework-Agnostic Design)**

### Module Type

**Minor — Modules of Choice**

---

### Why This Module Was Chosen

Complex UI flows such as **confirmations, blocking dialogs, pause states, and settings panels** require guarantees that inline components cannot provide reliably.

Rather than implementing page-local dialogs, this module introduces a **standalone global modal infrastructure** designed as a **reusable UI subsystem** with clear lifecycle rules, accessibility guarantees, and rendering isolation.

Although integrated into Reactor for this project, the modal system is **architecturally independent** and could be reused in any SPA runtime with a centralized render trigger.

---

### Design Goal

The objective was to build a **library-style modal system** that provides:

* A single global modal channel
* Deterministic open / close behavior
* Accessibility correctness by default
* Clear separation between:

  * modal **state & registry**
  * modal **rendering shell**
  * application render pipeline

This prevents modal logic from leaking into feature components or routing code.

---

### Technical Challenges Addressed

#### 1. Centralized Modal State Without Application Stores

* Modal state is owned by a dedicated module (`modal.ts`)
* No reliance on:

  * Redux / global stores
  * component trees
  * route-local state
* Exposes a small, library-like API:

  * `openModal`
  * `closeModal`
  * `getCurrentModal`
  * `registerModal`
  * `resolveModalRenderer`

This keeps modal usage declarative and framework-neutral.

---

#### 2. Renderer Registry With Inline Overrides

* Modal content is resolved through a **pluggable renderer system**:

  * Registered renderers for reusable modal types
  * Inline render functions for one-off dialogs
* Resolution order is explicit and predictable:

  * inline renderer → registry → fallback UI

Modal descriptors additionally support:

* `label` for accessible naming
* `className` for layout and sizing control

This mirrors how a standalone UI library would expose extensibility.

---

#### 3. Decoupled Render Trigger Injection

* The modal system **does not import application rendering logic**
* Instead, a render callback is injected at runtime:

  * `setModalRerender(fn)`

This avoids circular dependencies and allows the module to remain isolated from:

* routing
* layouts
* framework internals

Only a render *signal* is required, not framework awareness.

---

#### 4. Dedicated Modal Root & UI Shell

* A single global modal root is always mounted
* When inactive, it is visually and semantically hidden
* When active, it renders:

  * backdrop
  * modal panel
  * close controls

The modal shell acts as a **container component**, not a feature component.

---

#### 5. Accessibility & Interaction Guarantees

The infrastructure enforces accessibility and UX correctness centrally:

* Focus trapping (Tab / Shift+Tab cycling)
* Escape-key dismissal
* Focus restoration on close
* `aria-modal="true"` semantics
* Optional close prevention (`payload.preventClose`)
* Scroll locking with restoration
* Backdrop click handling
* Explicit close button
* Deterministic autofocus priority:

  * `data-modal-autofocus`
  * first focusable element
  * close button
  * modal panel

These rules apply uniformly to **every modal consumer**.

---

#### 6. Error-Resilient Fallback Rendering

* If a modal is opened without a valid renderer:

  * A visible fallback UI is shown
  * The application does not fail silently

This makes integration mistakes immediately visible and debuggable.

---

### Value Added to the Project

This module enables:

* Safe confirmation dialogs for destructive actions
* Blocking UI states (pause overlays, critical flows)
* Clean settings panels
* Game integration via event dispatch (`pong:pause`)
* Consistent modal behavior across all routes

It removes duplicated dialog logic while improving **accessibility, predictability, and maintainability**.

---

### Why This Deserves Minor Module Status (1 pt)

This module qualifies as a **Minor custom module** because it:

* Implements a reusable UI infrastructure layer
* Solves non-trivial UI lifecycle and accessibility problems
* Is independent in responsibility and scope
* Is actively used across the application
* Adds clear value without redefining the core framework

It is intentionally **smaller and narrower** than the main rendering framework.

---

### Scope Clarification

This modal infrastructure is:

* Designed as a standalone UI subsystem
* Framework-agnostic in concept
* Not a routing or layout replacement
* Not a third-party dependency
* Focused exclusively on controlled, blocking UI flows

Its responsibility is narrow, explicit, and isolated.

---

### Conclusion

The Global Modal Infrastructure module is a focused, library-style UI system that:

* Enforces correctness and accessibility
* Simplifies application-level UI logic
* Integrates cleanly without coupling

It fully satisfies the requirements for a **Minor “Modules of Choice” implementation (1 point)** without overlapping with the Reactor major module.

---

### Why this framing works in defense

If an evaluator says:

> “Isn’t this just part of Reactor?”

Your answer becomes simple and direct:

> Reactor is the rendering runtime.
> This is a standalone UI infrastructure module that only *consumes* a render signal.
> Its responsibilities, lifecycle, and API are independent.

That ends the discussion.
