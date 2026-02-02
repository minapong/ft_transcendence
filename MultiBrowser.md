## Browser Compatibility

This project is designed to be fully compatible with all modern, standards-compliant browsers.

### Supported Browsers
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Brave (latest)
- Chromium-based browsers in general

### Rationale

Browser compatibility was an explicit design consideration throughout development:

- Only standardized Web APIs are used (Fetch, WebSockets, DOM, sessionStorage).
- No Chrome-specific or experimental browser APIs are relied upon.
- Reactor hooks and rendering logic were actively corrected to avoid lifecycle and re-render issues that typically surface in stricter browsers such as Firefox.
- Navigation and routing rely on SPA-safe mechanisms instead of `window`-level hacks.
- HTTPS is enforced, aligning with Firefox and Brave’s stricter security defaults.
- Rendering, resize handling, and responsiveness were repeatedly validated and fixed across different viewport and device conditions.

### Practical Validation

The application has been tested in Chrome and Firefox with equivalent behavior and performance.  
Since Brave is Chromium-based and applies stricter privacy policies rather than divergent APIs, it is also fully compatible.


## ✅ Cross-Browser Compatibility Checklist

This checklist summarizes the browser compatibility validation for Chrome, Firefox, and Brave.

| Area | Check | Status |
|------|-------|--------|
| **Rendering & Responsiveness** | All pages (Pong, Connect4, profile, dashboard, etc.) render correctly | ✅ |
|  | Layouts respond correctly to desktop, tablet, and mobile viewports | ✅ |
|  | Sidebars, headers, dropdowns collapse/expand correctly | ✅ |
|  | Animations and canvas elements render consistently | ✅ |
| **SPA Navigation & Routing** | `navigate()` replaces `window.location.href` for internal navigation | ✅ |
|  | Dynamic routes and state propagation work | ✅ |
|  | Single-page behavior confirmed (no full reloads on page transitions) | ✅ |
| **Standard Web APIs** | `fetch()` / `apiFetch()` calls work | ✅ |
|  | `WebSockets` for presence / online-offline status function correctly | ✅ |
|  | `sessionStorage` / `localStorage` used consistently | ✅ |
|  | No Chrome-only or experimental APIs used | ✅ |
| **React / Reactor Hooks & Lifecycle** | Hook count mismatch warnings resolved | ✅ |
|  | `useRef`, `useCallback`, and hooks replace direct DOM access | ✅ |
|  | Re-render issues (Connect4, Pong, single_game) fixed | ✅ |
| **Security & HTTPS** | HTTPS enforced in production and local prod | ✅ |
|  | Cookies, JWT tokens, and auth flows validated | ✅ |
|  | No mixed-content warnings | ✅ |
| **Form & Input Validation** | Input sanitization applied consistently | ✅ |
|  | Input fields behave correctly with dynamic events | ✅ |
|  | Cross-browser input events verified | ✅ |
| **Error Handling** | Console warnings/errors handled| ✅ |
|  | Active API errors handled gracefully | ✅ |
