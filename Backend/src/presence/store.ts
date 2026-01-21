// src/presence/store.ts
export const onlineUsers = new Set<number>();

export function setOnline(userId: number) {
  onlineUsers.add(userId);
}

export function setOffline(userId: number) {
  onlineUsers.delete(userId);
}

export function isOnline(userId: number) {
  return onlineUsers.has(userId);
}

export function listOnline() {
  return Array.from(onlineUsers);
}
