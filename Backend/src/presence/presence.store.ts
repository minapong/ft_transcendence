// src/presence/presence.store.ts
import type { SocketStream } from "@fastify/websocket";

// userId -> set of active websocket connections
const online = new Map<number, Set<SocketStream>>();

export function addOnline(userId: number, conn: SocketStream) {
  let set = online.get(userId);
  if (!set) {
    set = new Set();
    online.set(userId, set);
  }
  set.add(conn);
}

export function removeOnline(userId: number, conn: SocketStream) {
  const set = online.get(userId);
  if (!set) return;

  set.delete(conn);
  if (set.size === 0) online.delete(userId);
}

export function isOnline(userId: number) {
  return online.has(userId);
}

export function onlineUserIds() {
  return Array.from(online.keys());
}
