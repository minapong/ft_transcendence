## Custom Major Module — Reactor Framework (2 pts)

### Module Name
**Reactor — Custom JSX Framework & Rendering Engine**

### Module Type
**Major — Modules of Choice**

---

### Why This Module Was Chosen

This project required deep control over rendering, routing, and lifecycle behavior due to its **real-time games** and **dynamic layouts**.  
Existing frameworks abstract these mechanisms behind complex internals, making them difficult to reason about during evaluation.

Reactor was built to:
- Expose the **full SPA rendering pipeline**
- Eliminate hidden behavior (Virtual DOM, Fiber, schedulers)
- Guarantee **deterministic lifecycle execution**
- Ensure every line of frontend logic is fully understood and explainable

This aligns directly with the ft_transcendence objective of **mastery over tooling, not dependency usage**.

---

### Technical Challenges Addressed

Reactor solves several non-trivial frontend problems from first principles:

#### 1. JSX Without React
- Implemented a **custom JSX runtime** (`createReactor`)
- Handles:
	- Native DOM creation
	- Function components
	- Props, events, refs, fragments
- Zero third-party dependencies

#### 2. Deterministic Hooks System
- Built `useState`, `useEffect`, `useRef`, `useMemo` from scratch
- **Indexed hook storage**
- **Strict dependency comparison**
- Correct cleanup ordering
- Effects executed **after DOM commit**, not during render

#### 3. Route-Scoped State Isolation
- Each route owns an isolated hook context
- Navigation:
	- Cleans effects
	- Preserves state per page
	- Prevents cross-page state leakage by design
- Solves a common SPA issue without global stores

#### 4. File-Based Routing Engine
- Routes derived from filesystem via `import.meta.glob`
- Supports:
	- Static routes
	- Dynamic params (`/user/:id`)
	- Pattern matching with regex
- No external router library

#### 5. Explicit Rendering Pipeline
```

resetHooks
→ render component
→ write DOM
→ assign refs
→ flush effects

```
- Fully predictable lifecycle
- Whiteboard-explainable
- No hidden scheduling or reconciliation

#### 6. Runtime Completeness & Safety
- Fragment support (`Fragment` + `<>...</>`) and `forwardRef` for DOM access
- Automatic JSX runtime entry (`jsx-runtime.ts` with `jsx/jsxs`)
- Ref assignment queue (`pendingRefSetters` + `runPendingRefs`) to attach refs after DOM commit
- Hook-count tracking to detect conditional hook usage

#### 7. Navigation & UX Depth
- Animated route transitions (direction-aware, “heavy” route timing)
- Debounced navigation when transitioning to the same target
- Route normalization (slashes, lowercase, strip query/hash)
- `routechange` custom event for reactive components
- Internal link interception with modifier-key safety + opt-out attribute
- Document title generation from route segments
- `/notfound` fallback if a NotFound page is missing
- Route map caching to avoid re-scanning on every render
---

### Value Added to the Project

Reactor is not an academic exercise — it directly enables project features:

- **Real-time game UIs** without reconciliation overhead
- **Instant route transitions** with controlled layout persistence
- **Minimal bundle size (~3kb)** for fast loads
- Zero framework lock-in or black-box behavior

Every UI behavior in the project is **traceable, debuggable, and defensible**.

---

### Why This Deserves Major Module Status (2 pts)

This module qualifies as **Major** because it:

- Introduces a **complete frontend framework**, not a helper library
- Replaces multiple subsystems normally provided by React + Router + Modal libs
- Demonstrates advanced understanding of:
	- JSX compilation
	- DOM rendering
	- Hooks architecture
	- SPA routing
	- Lifecycle management
- Is fully integrated into the application (not experimental or unused)
- Contains thousands of lines of original logic with no shortcuts

This is **infrastructure**, not a feature toggle.

---

### Scope & Intent Clarification

Reactor is **not intended to replace React**.

Tradeoffs are explicit:
- Optimized for **clarity, control, and learning**
- Not designed for massive apps or concurrent rendering
- Purpose-built for this project’s constraints

This deliberate choice prioritizes **architectural understanding over abstraction**, which is the core goal of ft_transcendence.

---

### Conclusion

Reactor is a substantial, original, and technically complex module that:
- Adds real value to the project
- Solves meaningful architectural problems
- Demonstrates deep frontend systems knowledge

It fully satisfies the requirements for a **Major custom module (2 points)**.
