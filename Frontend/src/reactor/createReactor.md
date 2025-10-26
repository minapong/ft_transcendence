

````markdown
# ⚛️ createReactor — Your Custom JSX Runtime

This file is the **core engine** of your project.  
It’s your hand-rolled version of React’s JSX runtime — minimal, transparent, and written entirely in TypeScript.  
Every visual element, component, and UI update ultimately flows through this function.

---

## 🧩 What It Does

- Converts JSX like:

  ```tsx
  <div id="hero" style={{ color: "red" }}>Hello</div>
````

into:

```ts
createReactor("div", { id: "hero", style: { color: "red" } }, "Hello");
```

* Handles both **components** (function tags) and **native HTML tags**.
* Applies inline styles, refs, and regular attributes.
* Appends text and child elements to parents.
* Exposes itself globally so compiled JSX can find it at runtime.

---

## 🧱 Why It Matters

Everything rendered in your SPA — buttons, game paddles, menus, etc. —
is ultimately created through this runtime.
Think of it as the **foundation layer** for the entire front-end.

---

## 🔍 Key Concepts

### JSX

HTML-like syntax inside TypeScript.
It compiles to plain function calls such as:

```ts
createReactor("div", {...}, children)
```

---

### tag

What’s inside the JSX brackets (`<div>` or `<Greeting />`).
It can be:

* a **string** → native HTML element
* a **function** → custom component

---

### props

Short for **properties**.
These are attributes passed into a tag.

Example:

```tsx
<div id="hero" style={{ color: "red" }} />
```

becomes:

```ts
{ id: "hero", style: { color: "red" } }
```

---

### children

Whatever you place inside a tag.

```tsx
<div>Hello <b>world</b></div>
```

produces:

```ts
children = ["Hello ", <b>world</b>]
```

---

### ref

Special prop used to access the real DOM node once it’s created:

```tsx
<div ref={el => console.log(el)} />
```

---

### document.createElement(tag)

Browser API that creates a new DOM element, e.g.:

```ts
document.createElement("div")
```

---

### element.append()

Adds a child node inside a parent:

```ts
div.append(span)
// <div><span></span></div>
```

---

### window

The browser’s global object.
When we do:

```ts
(window as any).createReactor = createElement
```

we expose the function globally so compiled JSX
(which calls `createReactor(...)`) can actually find it during runtime.

---

## 💡 TypeScript Notes

| Syntax                  | Meaning                                                   |
| ----------------------- | --------------------------------------------------------- |
| `any`                   | Accepts any type — used here for flexibility.             |
| `HTMLElement`           | Type definition for browser elements.                     |
| `(element as any)[key]` | Bypasses TypeScript checks (“trust me, this key exists”). |

---

## ⚙️ Why Attach to `window`?

Your bundler (Vite/TSX) expects a global function called `createReactor`.
Without it, compiled JSX like:

```ts
createReactor("div", { children: "Hello" })
```

throws **`createReactor is not defined`**.

Attaching it to `window` ensures that your JSX runtime is globally accessible inside the browser.

---

## 🧠 TL;DR

`createReactor` = your own JSX engine.
It builds real DOM nodes directly — no virtual DOM, no magic.
Everything else (hooks, state, routing, rendering) will build on top of this.

```

 