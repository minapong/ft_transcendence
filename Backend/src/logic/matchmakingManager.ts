import crypto from "crypto";
import { recordConnect4Game } from "./matchmakingRepo";

export interface Player {
  id: number;
  name: string;
}

export type MatchStatus = "matched" | "started" | "finished" | "abandoned";

export interface ActiveMatch {
  id: string;
  game: "connect4";
  p1: Player;
  p2: Player;
  createdAt: number;
  status: MatchStatus;
  startedAt?: number;
  timeout?: NodeJS.Timeout;
}

const queue: Player[] = [];
const activeMatches = new Map<string, ActiveMatch>();
const activeGameByUser = new Map<number, string>();

const MATCH_START_TIMEOUT = 2 * 60 * 1000; // 2 minutes

// ─────────────────────────────────────────────
// Queue
// ─────────────────────────────────────────────

export function joinQueue(player: Player) {
  if (activeGameByUser.has(player.id)) {
    return { status: "already_active" as const };
  }

  if (queue.find(p => p.id === player.id)) {
    return { status: "waiting" as const };
  }

  queue.push(player);

  if (queue.length < 2) {
    return { status: "waiting" as const };
  }

  const p1 = queue.shift()!;
  const p2 = queue.shift()!;

  const match: ActiveMatch = {
    id: crypto.randomUUID(),
    game: "connect4",
    p1,
    p2,
    createdAt: Date.now(),
    status: "matched",
  };

  // Timeout if not started
  match.timeout = setTimeout(() => {
    abandonMatch(match.id, null);
  }, MATCH_START_TIMEOUT);

  activeMatches.set(match.id, match);
  activeGameByUser.set(p1.id, match.id);
  activeGameByUser.set(p2.id, match.id);

  return {
    status: "matched" as const,
    match,
  };
}

// ─────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────

export function getActiveMatchForUser(userId: number) {
  const matchId = activeGameByUser.get(userId);
  if (!matchId) return null;
  return activeMatches.get(matchId) || null;
}

export function getActiveMatches() {
  return Array.from(activeMatches.values());
}

export function getQueue() {
  return queue;
}

// ─────────────────────────────────────────────
// Start match
// ─────────────────────────────────────────────

export function startMatch(matchId: string) {
  const match = activeMatches.get(matchId);
  if (!match) throw new Error("Match not found");
  if (match.status !== "matched") return match;

  if (match.timeout) {
    clearTimeout(match.timeout);
    match.timeout = undefined;
  }

  match.status = "started";
  match.startedAt = Date.now();

  return match;
}

// ─────────────────────────────────────────────
// Finish match
// ─────────────────────────────────────────────

export function finishMatch(matchId: string, winnerId: number) {
  const match = activeMatches.get(matchId);
  if (!match) throw new Error("Match not found");

  match.status = "finished";

  recordConnect4Game(
    match.p1.id,
    match.p2.id,
    winnerId
  );

  cleanupMatch(matchId);
  return { success: true };
}

// ─────────────────────────────────────────────
// Abandon
// ─────────────────────────────────────────────

export function abandonMatch(matchId: string, leaverId: number | null) {
  const match = activeMatches.get(matchId);
  if (!match) return;

  match.status = "abandoned";

  let winnerId: number | null = null;

  if (leaverId !== null) {
    winnerId = leaverId === match.p1.id ? match.p2.id : match.p1.id;
  }

  if (winnerId !== null) {
    recordConnect4Game(
      match.p1.id,
      match.p2.id,
      winnerId
    );
  }

  cleanupMatch(matchId);
}

function cleanupMatch(matchId: string) {
  const match = activeMatches.get(matchId);
  if (!match) return;

  if (match.timeout) clearTimeout(match.timeout);

  activeGameByUser.delete(match.p1.id);
  activeGameByUser.delete(match.p2.id);

  activeMatches.delete(matchId);
}
