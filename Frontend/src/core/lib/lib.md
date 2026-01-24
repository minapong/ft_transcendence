# lib Folder

The `lib` folder contains shared utility functions used across the frontend application for authentication, API communication, and real-time presence tracking.

## Files

### api.ts

A wrapper around the native `fetch` API for making authenticated HTTP requests.

**Exports:**
- `apiFetch(url: string, options?: RequestInit)` - Authenticated fetch wrapper

**Features:**
- Automatically attaches JWT token from localStorage via `Authorization: Bearer` header
- Sets `Content-Type: application/json` when a request body is present
- Auto-logout on 401 responses (token expired/invalid)

**Dependencies:**
- `@/lib/auth` - Uses `getAuth()` and `logout()`

---

### auth.ts

Manages authentication state in localStorage and provides login/logout functionality.

**Exports:**
- `getAuth()` - Retrieves and parses auth data from localStorage (returns `null` if not found/invalid)
- `setAuth(data: any)` - Saves auth data to localStorage and dispatches `auth:changed` event
- `clearAuth()` - Removes auth data from localStorage and dispatches `auth:changed` event
- `logout()` - Full logout flow: disconnects WebSocket, clears auth, redirects to `/login`

**Constants:**
- `AUTH_KEY = "auth"` - localStorage key for auth data
- `AUTH_EVENT = "auth:changed"` - Custom event name for auth state changes

**Dependencies:**
- `@/lib/presence` - Uses `disconnectPresenceWS()` for cleanup on logout
- `Reactor` - Uses `navigate()` for redirect

---

### presence.ts

Manages WebSocket connection for real-time user presence tracking.

**Exports:**
- `connectPresenceWS()` - Establishes WebSocket connection to `/ws/presence` endpoint with JWT token
- `disconnectPresenceWS()` - Closes the WebSocket connection and cleans up

**Features:**
- Prevents duplicate connections (checks if already open/connecting)
- Requires valid auth token to connect
- Logs connection status (open, closed, error) to console
- Connects to `ws://localhost:3000/ws/presence?token={token}`

**Dependencies:**
- `@/lib/auth` - Uses `getAuth()` to retrieve token

---

### useAuth.ts

React hook for reactive authentication state management.

**Exports:**
- `useAuth()` - Hook that returns current auth state and auto-updates on changes

**Features:**
- Syncs with localStorage changes (same tab via custom event, cross-tab via `storage` event)
- Re-syncs on component mount to catch changes while route was inactive
- Cleans up event listeners on unmount

**Dependencies:**
- `Reactor` - Uses `useEffect` and `useState` hooks
- `@/lib/auth` - Uses `getAuth()` and `setAuth()`

---

## Usage Examples

```typescript
// Making an authenticated API call
import { apiFetch } from "@/lib/api";

const response = await apiFetch("/api/users/me");
const userData = await response.json();
```

```typescript
// Using auth hook in a component
import { useAuth } from "@/lib/useAuth";

function Profile() {
  const auth = useAuth();
  if (!auth) return <Redirect to="/login" />;
  return <div>Welcome, {auth.user.username}</div>;
}
```

```typescript
// Managing presence connection
import { connectPresenceWS, disconnectPresenceWS } from "@/lib/presence";

// On login success
connectPresenceWS();

// On logout (handled automatically by auth.ts logout())
disconnectPresenceWS();
```

## Summary

| File | Purpose |
|------|---------|
| `api.ts` | Authenticated HTTP requests with auto-logout on 401 |
| `auth.ts` | Auth state management (localStorage + events) |
| `presence.ts` | WebSocket connection for real-time presence |
| `useAuth.ts` | React hook for reactive auth state |

The `lib` folder serves as the foundation for authentication flow, API communication, and real-time features throughout the frontend application.
