import crypto from "crypto";
import {
  insertActiveMatch,
  updateActiveMatchStatus,
  deleteActiveMatch,
  getActiveMatchDTO,
  getActiveMatchFull,
  recordConnect4Game,
  enqueuePlayer,
  dequeueTwoPlayers,
  isUserQueued,
  isUserValid,
  ActiveMatchDTO,
  Player,
  cleanupQueue,
  getExpiredActiveMatches,
} from "./matchmakingRepo";

// ─────────────────────────────────────────────
// Time constants (in seconds)
// ─────────────────────────────────────────────
const MAX_QUEUE_TIME_SECONDS = 10 * 60;        // 10 minutes in queue
const MAX_MATCHED_TIME_SECONDS = 5 * 60;       // 5 minutes waiting to start
const MAX_STARTED_TIME_SECONDS = 5 * 60;       // 5 minutes max game duration

// ─────────────────────────────────────────────
// Helper: Clean up expired matches and queue
// ─────────────────────────────────────────────
function cleanupExpiredMatchesAndQueue() {
  // Clean expired entries from queue
  cleanupQueue("connect4", MAX_QUEUE_TIME_SECONDS);

  // Clean expired active matches
  const expiredMatchIds = getExpiredActiveMatches(
    MAX_MATCHED_TIME_SECONDS,
    MAX_STARTED_TIME_SECONDS
  );

  for (const matchId of expiredMatchIds) {
    deleteActiveMatch(matchId);
  }
}

// ─────────────────────────────────────────────
// Join Queue
// ─────────────────────────────────────────────
export function joinQueue(player: Player) {
  if (!player?.id) {
    throw new Error("joinQueue called without valid player.id");
  }
  if (!isUserValid(player.id)) {
    throw new Error(`User ${player.id} does not exist`);
  }

  const existing = getActiveMatchDTO(player.id);
  if (existing) return { status: "already_active" as const, match: existing };

  if (isUserQueued(player.id, "connect4")) return { status: "waiting" as const };

  enqueuePlayer(player.id, "connect4");
  if (!isUserQueued(player.id, "connect4")) return { status: "idle" as const };

  const pair = dequeueTwoPlayers("connect4", MAX_QUEUE_TIME_SECONDS);
  if (!pair) return { status: "waiting" as const };

  const [p1Id, p2Id] = pair;

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
    createdAt: Date.now(),
    status: "matched",
  };

  insertActiveMatch(match);

  return { status: "matched" as const, match };
}

// ─────────────────────────────────────────────
// Get Active Match for a User
// ─────────────────────────────────────────────
export function getActiveMatchForUser(userId: number): ActiveMatchDTO | null {
  cleanupExpiredMatchesAndQueue();

  const match = getActiveMatchDTO(userId);
  return match ?? null;
}

// ─────────────────────────────────────────────
// Check if user is Queued
// ─────────────────────────────────────────────
export function isQueued(user_id: number): boolean {
  cleanupExpiredMatchesAndQueue();

  return isUserQueued(user_id, "connect4");
}

// ─────────────────────────────────────────────
// Start Match
// ─────────────────────────────────────────────
export function startMatch(matchId: string) {
  const match = getActiveMatchFull({ matchId });
  if (!match) throw new Error("Match not found");
  if (match.status !== "matched") return match;

  match.status = "started";
  match.startedAt = Date.now();

  updateActiveMatchStatus(matchId, "started");

  return match;
}

// ─────────────────────────────────────────────
// Finish Match (normal completion with winner)
// ─────────────────────────────────────────────
export function finishMatch(matchId: string, winnerId: number) {
  const match = getActiveMatchFull({ matchId });
// If match no longer exists (e.g. timed out and cleaned up), we ignore
  if (!match) {
    return { success: true, alreadyCleaned: true };
  }

  recordConnect4Game(match.p1.id, match.p2.id, winnerId);

  deleteActiveMatch(matchId);

  return { success: true };
}