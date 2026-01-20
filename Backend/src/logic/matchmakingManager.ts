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
} from "../repositories/match.repo.js";
import {
  updateUserGameStats
} from "../repositories/stats.repo.js"

// ─────────────────────────────────────────────
// Time constants (in seconds)
// ─────────────────────────────────────────────
const MAX_QUEUE_TIME_SECONDS = 10 * 60;        // 10 minutes in queue
const MAX_MATCHED_TIME_SECONDS = 5 * 60;       // 5 minutes waiting to start
const MAX_STARTED_TIME_SECONDS = 5 * 60;       // 5 minutes max game duration

// ─────────────────────────────────────────────
// Helper: Clean up expired matches and queue
// ─────────────────────────────────────────────
async function cleanupExpiredMatchesAndQueue() {
  // Clean expired entries from queue
  await cleanupQueue("connect4", MAX_QUEUE_TIME_SECONDS);

  // Clean expired active matches
  const expiredMatchIds = await getExpiredActiveMatches(
    MAX_MATCHED_TIME_SECONDS,
    MAX_STARTED_TIME_SECONDS
  );

  for (const matchId of expiredMatchIds) {
    await deleteActiveMatch(matchId);
  }
}

// ─────────────────────────────────────────────
// Join Queue
// ─────────────────────────────────────────────
export async function joinQueue(player: Player) {
  if (!player?.id) {
    throw new Error("joinQueue called without valid player.id");
  }
  if (!(await isUserValid(player.id))) {
    throw new Error(`User ${player.id} does not exist`);
  }

  const existing = await getActiveMatchDTO(player.id);
  if (existing) return { status: "already_active" as const, match: existing };

  if (await isUserQueued(player.id, "connect4")) return { status: "waiting" as const };

  await enqueuePlayer(player.id, "connect4");
  if (!( await isUserQueued(player.id, "connect4"))) return { status: "idle" as const };

  const pair = await dequeueTwoPlayers("connect4", MAX_QUEUE_TIME_SECONDS);
  if (!pair) return { status: "waiting" as const };

  const [p1Id, p2Id] = pair;

  if (player.id !== p1Id && player.id !== p2Id) {
    await enqueuePlayer(player.id, "connect4");
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

  await insertActiveMatch(match);

  return { status: "matched" as const, match };
}

// ─────────────────────────────────────────────
// Get Active Match for a User
// ─────────────────────────────────────────────
export async function getActiveMatchForUser(userId: number): Promise<ActiveMatchDTO | null> {
  await cleanupExpiredMatchesAndQueue();

  const match = await getActiveMatchDTO(userId);
  return match ?? null;
}

// ─────────────────────────────────────────────
// Check if user is Queued
// ─────────────────────────────────────────────
export async function isQueued(user_id: number): Promise<boolean> {
  await cleanupExpiredMatchesAndQueue();

  return await isUserQueued(user_id, "connect4");
}

// ─────────────────────────────────────────────
// Start Match
// ─────────────────────────────────────────────
export async function startMatch(matchId: string) {
  const match = await getActiveMatchFull({ matchId });
  if (!match) throw new Error("Match not found");
  if (match.status !== "matched") return match;

  match.status = "started";
  match.startedAt = Date.now();

  await updateActiveMatchStatus(matchId, "started");

  return match;
}

// ─────────────────────────────────────────────
// Finish Match (normal completion with winner)
// ─────────────────────────────────────────────
export async function finishMatch(matchId: string, winnerId: number) {
  const match = await getActiveMatchFull({ matchId });

  // If match no longer exists (e.g. timed out and cleaned up), we ignore
  if (!match) {
    return { success: true, alreadyCleaned: true };
  }

  // Record permanent game history
  await recordConnect4Game(match.p1.id, match.p2.id, winnerId);

  // UPDATE USER STATS (both winner and loser)
  const loserId = winnerId === match.p1.id ? match.p2.id : match.p1.id;

  // Winner always gets +1 win
  await updateUserGameStats(winnerId, true);

  // Loser gets +1 loss (only if valid player ID)
  if (loserId && loserId !== 0) {
    await updateUserGameStats(loserId, false);
  }

  // Clean up active match
  await deleteActiveMatch(matchId);

  return { success: true };
}