import { prisma } from "../db/prisma.js";
import type { Prisma } from "@prisma/client";

export type MatchStatus = "matched" | "started" | "finished" | "abandoned";

export interface ActiveMatchDTO {
  id: string;
  game: "connect4";
  p1: { id: number; name: string };
  p2: { id: number; name: string };
  status: MatchStatus;
  createdAt: number;        // epoch ms
  startedAt?: number;       // epoch ms
  timeout?: NodeJS.Timeout; // in-memory only
}

export interface Player {
  id: number;
  name: string;
}

// ------------------------------
// Queue persistence (MatchmakingQueue)
// ------------------------------

export async function cleanupQueue(game: string, timeoutSeconds: number): Promise<void> {
  const cutoff = new Date(Date.now() - timeoutSeconds * 1000);

  await prisma.matchmakingQueue.deleteMany({
    where: {
      game_name: game,
      joined_at: { lt: cutoff },
    },
  });
}

export async function enqueuePlayer(userId: number, game: string): Promise<void> {
  // @@unique([user_id, game_name]) -> Prisma creates a compound unique selector
  await prisma.matchmakingQueue.upsert({
    where: {
      user_id_game_name: { user_id: userId, game_name: game },
    },
    create: {
      user_id: userId,
      game_name: game,
    },
    update: {
      // refresh timestamp like your INSERT OR REPLACE
      joined_at: new Date(),
    },
  });
}

export async function dequeueTwoPlayers(
  game: string,
  queueTimeoutSeconds: number
): Promise<[number, number] | null> {
  await cleanupQueue(game, queueTimeoutSeconds);

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const rows = await tx.matchmakingQueue.findMany({
      where: { game_name: game },
      orderBy: { joined_at: "asc" },
      take: 2,
      select: { id: true, user_id: true },
    });

    if (rows.length < 2) return null;

    const [a, b] = rows;

    // delete the exact picked rows (prevents race issues)
    await tx.matchmakingQueue.deleteMany({
      where: { id: { in: [a.id, b.id] } },
    });

    return [a.user_id, b.user_id] as [number, number];
  });
}

export async function isUserQueued(userId: number, game: string): Promise<boolean> {
  const row = await prisma.matchmakingQueue.findUnique({
    where: {
      user_id_game_name: { user_id: userId, game_name: game },
    },
    select: { id: true },
  });
  return !!row;
}

export async function removeFromQueue(userId: number, game: string): Promise<void> {
  await prisma.matchmakingQueue.deleteMany({
    where: { user_id: userId, game_name: game },
  });
}

// ------------------------------
// Match persistence (Match + MatchPlayer)
// ------------------------------

export async function recordConnect4Game(
  p1Id: number,
  p2Id: number,
  winnerId: number
): Promise<number> {
  if (!p1Id || !p2Id || !winnerId) throw new Error("Invalid input");
  if (winnerId !== p1Id && winnerId !== p2Id) throw new Error("Winner must be one of the players");

  const matchId = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const match = await tx.match.create({
      data: {
        game_name: "connect4",
        winner_id: winnerId,
        finished_at: new Date(),
        players: {
          create: [
            { user_id: p1Id, is_winner: p1Id === winnerId },
            { user_id: p2Id, is_winner: p2Id === winnerId },
          ],
        },
      },
      select: { id: true },
    });

    return match.id;
  });

  return matchId;
}

// ------------------------------
// Active matches (ActiveMatches)
// ------------------------------

export async function insertActiveMatch(match: ActiveMatchDTO): Promise<void> {
  await prisma.activeMatches.create({
    data: {
      match_id: match.id,
      game_name: match.game,
      p1_id: match.p1.id,
      p2_id: match.p2.id,
      status: match.status,
    },
  });
}

export async function updateActiveMatchStatus(matchId: string, status: MatchStatus): Promise<void> {
  await prisma.activeMatches.update({
    where: { match_id: matchId },
    data: {
      status,
      // emulate your CASE WHEN started
      started_at: status === "started" ? new Date() : undefined,
    },
  });
}

export async function deleteActiveMatch(matchId: string): Promise<void> {
  await prisma.activeMatches.delete({
    where: { match_id: matchId },
  });
}

export async function isUserValid(userId: number): Promise<boolean> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  return !!row;
}

export async function getExpiredActiveMatches(
  maxMatchedSeconds: number,
  maxStartedSeconds: number
): Promise<string[]> {
  const matchedCutoff = new Date(Date.now() - maxMatchedSeconds * 1000);
  const startedCutoff = new Date(Date.now() - maxStartedSeconds * 1000);

  const [matched, started] = await Promise.all([
    prisma.activeMatches.findMany({
      where: { status: "matched", created_at: { lt: matchedCutoff } },
      select: { match_id: true },
    }),
    prisma.activeMatches.findMany({
      where: { status: "started", started_at: { lt: startedCutoff } },
      select: { match_id: true },
    }),
  ]);

  return [...matched.map(x => x.match_id), ...started.map(x => x.match_id)];
}

export async function getActiveMatchFull(params: {
  matchId?: string;
  userId?: number;
}): Promise<ActiveMatchDTO | null> {
  if (!params.matchId && !params.userId) {
    throw new Error("Must provide either matchId or userId");
  }

  const row = await prisma.activeMatches.findFirst({
    where: params.matchId
      ? { match_id: params.matchId }
      : {
          status: { in: ["matched", "started"] },
          OR: [{ p1_id: params.userId! }, { p2_id: params.userId! }],
        },
    include: {
      p1: { select: { id: true, username: true } },
      p2: { select: { id: true, username: true } },
    },
  });

  if (!row) return null;

  return {
    id: row.match_id,
    game: row.game_name as "connect4",
    p1: { id: row.p1.id, name: row.p1.username },
    p2: { id: row.p2.id, name: row.p2.username },
    status: row.status as MatchStatus,
    createdAt: row.created_at.getTime(),
    startedAt: row.started_at?.getTime(),
  };
}

export async function getActiveMatchDTO(userId: number): Promise<ActiveMatchDTO | null> {
  return getActiveMatchFull({ userId });
}
