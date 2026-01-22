import { prisma } from "../db/prisma.js";
import type { Prisma } from "@prisma/client";
import type { PlayerDTO, MatchDTO, TournamentDTO } from "../types/tournament.js";

// ─────────────────────────────────────────────
// Prisma payload types (precise typing, no `any`)
// ─────────────────────────────────────────────
type PrismaTournamentPlayerWithUser = Prisma.TournamentPlayerGetPayload<{
  include: { user: { select: { id: true; username: true } } };
}>;

type PrismaTournamentMatchWithMatch = Prisma.TournamentMatchGetPayload<{
  include: {
    match: {
      include: {
        players: {
          include: { user: { select: { id: true; username: true } } };
          orderBy: { id: "asc" };
        };
      };
    };
  };
}>;

type PrismaMatchPlayerWithUser = Prisma.MatchPlayerGetPayload<{
  include: { user: { select: { id: true; username: true } } };
}>;

// ─────────────────────────────────────────────
// Helper: Build MatchDTO from TournamentMatch row
// ─────────────────────────────────────────────
function toMatchDTO(tm: PrismaTournamentMatchWithMatch): MatchDTO {
  const m = tm.match;

  // MatchPlayer rows are inserted in order, but we still sort for safety
  const sortedPlayers = [...(m.players ?? [])].sort((a, b) => a.id - b.id);

  const mp1 = sortedPlayers[0];
  const mp2 = sortedPlayers[1];

  const p1: PlayerDTO =
    mp1?.user_id != null
      ? { id: mp1.user_id, name: mp1.user?.username || "Unknown" }
      : { id: 0, name: "TBD" };

  const p2: PlayerDTO =
    mp2?.user_id != null
      ? { id: mp2.user_id, name: mp2.user?.username || "Unknown" }
      : { id: 0, name: "TBD" };

  return {
    id: tm.match_id,
    p1,
    p2,
    winnerId: m.winner_id ?? null,
    status: m.winner_id ? "finished" : "pending",
    round: tm.round_number,
    matchNumber: tm.match_number_in_round, // always present in DB
  };
}

// ─────────────────────────────────────────────
// Create tournament
// ─────────────────────────────────────────────
export async function insertTournament(
  name: string,
  maxPlayers: number = 4
): Promise<number | { error: string }> {
  if (!name || !name.trim()) return { error: "Tournament name cannot be empty" };
  if (![4, 8, 16].includes(maxPlayers)) return { error: "Max players must be 4, 8, or 16" };

  try {
    const t = await prisma.tournament.create({
      data: { name: name.trim(), max_players: maxPlayers },
      select: { id: true },
    });
    return t.id;
  } catch (err: any) {
    return { error: "Database error: " + (err?.message ?? String(err)) };
  }
}

// ─────────────────────────────────────────────
// Get tournament by ID (subset select, partner-style)
// ─────────────────────────────────────────────
export async function getTournamentById(id: number) {
  if (!id) return undefined;

  return prisma.tournament.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      state: true,
      current_round: true,
      max_players: true,
      winner_id: true,
    },
  });
}

// ─────────────────────────────────────────────
// Register player
// ─────────────────────────────────────────────
export async function insertTournamentPlayer(
  tournamentId: number,
  userId: number | null,
  alias?: string
): Promise<number> {
  if (!tournamentId) throw new Error("Invalid tournament ID");

  try {
    const tp = await prisma.tournamentPlayer.create({
      data: {
        tournament_id: tournamentId,
        user_id: userId,
        alias: alias ?? null,
      },
      select: { id: true },
    });
    return tp.id;
  } catch (err: any) {
    // @@unique([tournament_id, user_id]) => P2002
    if (err?.code === "P2002") throw new Error("Player is already registered in this tournament");
    throw err;
  }
}

// ─────────────────────────────────────────────
// Create match (transaction)
// ─────────────────────────────────────────────
export async function insertMatch(
  tournamentId: number,
  p1Id: number | null,
  p2Id: number | null,
  roundNumber: number,
  matchNumber: number,
  nextTournamentMatchId?: number
): Promise<number> {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const match = await tx.match.create({
      data: {},
      select: { id: true },
    });

    await tx.tournamentMatch.create({
      data: {
        tournament_id: tournamentId,
        match_id: match.id,
        round_number: roundNumber,
        match_number_in_round: matchNumber,
        next_tournament_match_id: nextTournamentMatchId ?? null,
      },
    });

    // only create players when IDs are valid
    const toCreate: { match_id: number; user_id: number }[] = [];
    if (p1Id != null && p1Id !== 0) toCreate.push({ match_id: match.id, user_id: p1Id });
    if (p2Id != null && p2Id !== 0) toCreate.push({ match_id: match.id, user_id: p2Id });

    if (toCreate.length) {
      await tx.matchPlayer.createMany({ data: toCreate });
    }

    return match.id;
  });
}

// ─────────────────────────────────────────────
// Insert a single match player 
// ─────────────────────────────────────────────
export async function insertMatchPlayer(matchId: number, userId: number): Promise<number> {
  if (!matchId || !userId) throw new Error("Invalid input");

  const mp = await prisma.matchPlayer.create({
    data: { match_id: matchId, user_id: userId },
    select: { id: true },
  });

  return mp.id;
}

// ─────────────────────────────────────────────
// Record winner 
// ─────────────────────────────────────────────
export async function recordMatchWinner(matchId: number, winnerId: number): Promise<void> {
  if (!matchId || !winnerId) throw new Error("Invalid input");

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.match.update({
      where: { id: matchId },
      data: {
        winner_id: winnerId,
        finished_at: new Date(),
      },
    });

    await tx.matchPlayer.updateMany({
      where: { match_id: matchId },
      data: { is_winner: false },
    });

    await tx.matchPlayer.updateMany({
      where: { match_id: matchId, user_id: winnerId },
      data: { is_winner: true },
    });
  });
}

// ─────────────────────────────────────────────
// Registered players
// ─────────────────────────────────────────────
export async function getRegisteredPlayers(tournamentId: number): Promise<PlayerDTO[]> {
  const players = await prisma.tournamentPlayer.findMany({
    where: { tournament_id: tournamentId },
    include: { user: { select: { id: true, username: true } } },
    orderBy: { id: "asc" },
  });

  return players
    .filter((p: PrismaTournamentPlayerWithUser) => p.user_id != null)
    .map((p: PrismaTournamentPlayerWithUser) => ({
      id: p.user_id!,
      name: p.user?.username || "Guest",
    }));
}

// ─────────────────────────────────────────────
// Players in a match
// ─────────────────────────────────────────────
export async function getMatchPlayers(matchId: number): Promise<PlayerDTO[]> {
  const players = await prisma.matchPlayer.findMany({
    where: { match_id: matchId },
    include: { user: { select: { id: true, username: true } } },
    orderBy: { id: "asc" },
  });

  return players
    .filter((p: PrismaMatchPlayerWithUser) => p.user_id != null)
    .map((p: PrismaMatchPlayerWithUser) => ({
      id: p.user_id!,
      name: p.user?.username || "Unknown",
    }));
}

// ─────────────────────────────────────────────
// Get matches for tournament
// ─────────────────────────────────────────────
export async function getMatchesForTournament(tournamentId: number): Promise<MatchDTO[]> {
  if (!tournamentId) return [];

  const rows = await prisma.tournamentMatch.findMany({
    where: { tournament_id: tournamentId },
    orderBy: [{ round_number: "asc" }, { match_number_in_round: "asc" }],
    include: {
      match: {
        include: {
          players: {
            include: { user: { select: { id: true, username: true } } },
            orderBy: { id: "asc" },
          },
        },
      },
    },
  });

  return rows.map(toMatchDTO);
}

// ─────────────────────────────────────────────
// Single match DTO
// ─────────────────────────────────────────────
export async function getMatchDTO(matchId: number): Promise<MatchDTO> {
  const tm = await prisma.tournamentMatch.findFirst({
    where: { match_id: matchId },
    include: {
      match: {
        include: {
          players: {
            include: { user: { select: { id: true, username: true } } },
            orderBy: { id: "asc" },
          },
        },
      },
    },
  });

  if (!tm) throw new Error("Match not found");
  return toMatchDTO(tm);
}

// ─────────────────────────────────────────────
// Update tournament state
// ─────────────────────────────────────────────
export async function updateTournamentState(
  tournamentId: number,
  state: "waiting" | "active" | "finished",
  currentRound: number,
  winnerId?: number
): Promise<TournamentDTO | null> {
  await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      state,
      current_round: currentRound,
      winner_id: winnerId ?? null,
      finished_at: state === "finished" ? new Date() : undefined,
    },
  });

  return getTournamentWithMatches(tournamentId);
}

// ─────────────────────────────────────────────
// Full tournament with matches & players
// ─────────────────────────────────────────────
export async function getTournamentWithMatches(tournamentId: number): Promise<TournamentDTO | null> {
  const t = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      players: {
        include: { user: { select: { id: true, username: true } } },
        orderBy: { id: "asc" },
      },
      matches: {
        orderBy: [{ round_number: "asc" }, { match_number_in_round: "asc" }],
        include: {
          match: {
            include: {
              players: {
                include: { user: { select: { id: true, username: true } } },
                orderBy: { id: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!t) return null;

  const matches = t.matches.map(toMatchDTO);

  const registeredPlayers = t.players.map((p: PrismaTournamentPlayerWithUser) => ({
    id: p.user_id ?? 0,
    name: p.user?.username || "Guest",
  }));

  //derive from the match where winnerId appears
  const winnerMatch = matches.find(m => m.winnerId === (t.winner_id ?? null));
  const winnerName = winnerMatch
    ? winnerMatch.p1.id === t.winner_id
      ? winnerMatch.p1.name
      : winnerMatch.p2.name
    : null;

  return {
    id: t.id,
    name: t.name ?? "",
    currentRound: t.current_round,
    state: t.state , //state is enum in Prisma 
    matches,
    winnerId: t.winner_id ?? null,
    winnerName,
    max_players: t.max_players,
    registeredPlayers,
  };
}

// ─────────────────────────────────────────────
// Get active tournament
// ─────────────────────────────────────────────
export async function get_ActiveTournament(): Promise<TournamentDTO | null> {
  const t = await prisma.tournament.findFirst({
    where: { state: { in: ["waiting", "active"] } },
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (!t) return null;
  return getTournamentWithMatches(t.id);
}

export const TournamentRepo = {
  insertTournament,
  getTournamentById,
  insertTournamentPlayer,
  insertMatch,
  insertMatchPlayer,
  recordMatchWinner,
  getRegisteredPlayers,
  getMatchPlayers,
  getMatchesForTournament,
  getMatchDTO,
  updateTournamentState,
  getTournamentWithMatches,
  get_ActiveTournament,
};
