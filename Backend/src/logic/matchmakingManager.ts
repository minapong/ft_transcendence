import crypto from "crypto";
import {
  insertActiveMatch,
  updateActiveMatchStatus,
  deleteActiveMatch,
  getActiveMatchDTO,
  getActiveMatchById,
  recordConnect4Game,
  enqueuePlayer,
  dequeueTwoPlayers,
  isUserQueued,
  removeFromQueue,
  ActiveMatchDTO,
  MatchStatus,
  Player,
} from "./matchmakingRepo";

// ─────────────────────────────────────────────
// In-memory state for auto-abandon timeouts only
// ─────────────────────────────────────────────
const activeMatchTimeouts = new Map<string, NodeJS.Timeout>();
const MATCH_START_TIMEOUT = 2 * 60 * 1000; // 2 minutes

// ─────────────────────────────────────────────
// Join Queue
// ─────────────────────────────────────────────
export function joinQueue(player: Player) {
  // 1 Check if player already has an active match (DB-backed)
  const existing = getActiveMatchDTO(player.id);
  if (existing) return { status: "already_active" as const, match: existing };

  // 2 Check if player is already queued
  if (isUserQueued(player.id, "connect4")) return { status: "waiting" as const };

  // 3 Enqueue player
  enqueuePlayer(player.id, "connect4");

  // 4 Attempt to match two players
  const pair = dequeueTwoPlayers("connect4");
  if (!pair) return { status: "waiting" as const };

  const [p1Id, p2Id] = pair;

  // Ensure this request is one of the matched
  if (player.id !== p1Id && player.id !== p2Id) {
    enqueuePlayer(player.id, "connect4");
    return { status: "waiting" as const };
  }

  const p1: Player = p1Id === player.id ? player : { id: p1Id, name: "Player" };
  const p2: Player = p2Id === player.id ? player : { id: p2Id, name: "Player" };

  const match: ActiveMatchDTO = {
    id: crypto.randomUUID(),
    game: "connect4",
    p1,
    p2,
    createdAt: Date.now(), // number
    status: "matched",
  };

  // Persist match in DB
  insertActiveMatch(match);

  // Set up auto-abandon timeout
  const timeout = setTimeout(() => {
    abandonMatch(match.id, null);
  }, MATCH_START_TIMEOUT);
  activeMatchTimeouts.set(match.id, timeout);

  return { status: "matched" as const, match };
}

// ─────────────────────────────────────────────
// Get Active Match for a User
// ─────────────────────────────────────────────
export function getActiveMatchForUser(userId: number): ActiveMatchDTO | null {
  const match = getActiveMatchDTO(userId);
  if (!match) return null;

  // Ensure timeout exists if match is still waiting
  if (!activeMatchTimeouts.has(match.id) && match.status === "matched") {
    const timeout = setTimeout(() => {
      abandonMatch(match.id, null);
    }, MATCH_START_TIMEOUT);
    activeMatchTimeouts.set(match.id, timeout);
  }

  return match;
}

// ─────────────────────────────────────────────
// Start Match
// ─────────────────────────────────────────────
export function startMatch(matchId: string) {
  const match = getActiveMatchById(matchId);
  if (!match) throw new Error("Match not found");
  if (match.status !== "matched") return match;

  // Clear timeout
  const timeout = activeMatchTimeouts.get(match.id);
  if (timeout) {
    clearTimeout(timeout);
    activeMatchTimeouts.delete(match.id);
  }

  match.status = "started";
  match.startedAt = Date.now(); // number

  updateActiveMatchStatus(match.id, "started");

  return match;
}

// ─────────────────────────────────────────────
// Finish Match
// ─────────────────────────────────────────────
export function finishMatch(matchId: string, winnerId: number) {
  const match = getActiveMatchById(matchId);
  if (!match) throw new Error("Match not found");

  match.status = "finished";
  recordConnect4Game(match.p1.id, match.p2.id, winnerId);

  cleanupMatch(match.id);

  return { success: true };
}

// ─────────────────────────────────────────────
// Abandon Match
// ─────────────────────────────────────────────
export function abandonMatch(matchId: string, leaverId: number | null) {
  const match = getActiveMatchById(matchId);
  if (!match) return;

  match.status = "abandoned";

  let winnerId: number | null = null;
  if (leaverId !== null) {
    winnerId = leaverId === match.p1.id ? match.p2.id : match.p1.id;
  }

  if (winnerId !== null) {
    recordConnect4Game(match.p1.id, match.p2.id, winnerId);
  }

  cleanupMatch(match.id);
}

// ─────────────────────────────────────────────
// Cleanup helper
// ─────────────────────────────────────────────
function cleanupMatch(matchId: string) {
  // Clear timeout
  const timeout = activeMatchTimeouts.get(matchId);
  if (timeout) clearTimeout(timeout);
  activeMatchTimeouts.delete(matchId);

  // Remove from DB
  deleteActiveMatch(matchId);
}
