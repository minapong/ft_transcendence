# core/lib

Shared utilities used across the frontend for authentication, API communication, input validation, and presence.

## Files

### api.ts

Authenticated `fetch` wrapper.

**Exports:**
- `apiFetch(path: string, options?: RequestInit)`

**Behavior:**
- Adds `Authorization: Bearer <token>` if available
- Sets `Content-Type: application/json` when sending JSON
- Uses `VITE_API_BASE` as a prefix when `path` is relative
- Auto-logout on `401`

---

### auth.ts

Authentication state and logout flow.

**Exports:**
- `getAuth()`
- `setAuth(data)`
- `clearAuth()`
- `logout()` (redirects to `/auth/login` and clears presence + auth state)

---

### presence.ts

Presence WebSocket helper.

**Exports:**
- `connectPresenceWS()`
- `disconnectPresenceWS()`
- `onPresenceMessage(handler)`

**Behavior:**
- Connects to `VITE_WS_BASE` if set, otherwise uses current host
- Emits `presence:msg` events with parsed payloads

---

### useAuth.ts

Reactive auth hook.

**Exports:**
- `useAuth()`

**Behavior:**
- Syncs with `localStorage` and `auth:changed` events
- Updates on cross-tab changes via `storage` event

---

### input/

Validation helpers:
- `validators.ts`
- `sanitize.ts`
- `unwrap.ts`

## Usage Examples

```ts
import { apiFetch } from "@/core/lib/api";

const res = await apiFetch("/api/users/me");
```

```ts
import { useAuth } from "@/core/lib/useAuth";

const auth = useAuth();
```
