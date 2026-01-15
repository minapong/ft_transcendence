import { prisma } from "../db/prisma.js";
import type { Prisma } from "@prisma/client";
import type { PlayerDTO, MatchDTO, TournamentDTO } from "../types/tournament.js";

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

export async function getTournamentById(id: number) {
  if (!id) return undefined;
  return prisma.tournament.findUnique({ where: { id } });
}

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

    const toCreate: { match_id: number; user_id: number }[] = [];
    if (p1Id != null) toCreate.push({ match_id: match.id, user_id: p1Id });
    if (p2Id != null) toCreate.push({ match_id: match.id, user_id: p2Id });

    if (toCreate.length) {
      await tx.matchPlayer.createMany({ data: toCreate });
    }

    return match.id;
  });
}

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

export async function getRegisteredPlayers(tournamentId: number): Promise<PlayerDTO[]> {
  const rows = await prisma.tournamentPlayer.findMany({
    where: { tournament_id: tournamentId, user_id: { not: null } },
    orderBy: { id: "asc" },
    include: { user: { select: { id: true, username: true } } },
  });

  return rows
    .filter(r => r.user)
    .map(r => ({ id: r.user!.id, name: r.user!.username }));
}

export async function getMatchPlayers(matchId: number): Promise<PlayerDTO[]> {
  const rows = await prisma.matchPlayer.findMany({
    where: { match_id: matchId, user_id: { not: null } },
    orderBy: { id: "asc" },
    include: { user: { select: { id: true, username: true } } },
  });

  return rows
    .filter(r => r.user)
    .map(r => ({ id: r.user!.id, name: r.user!.username }));
}

export async function getMatchesForTournament(tournamentId: number): Promise<MatchDTO[]> {
  const rows = await prisma.tournamentMatch.findMany({
    where: { tournament_id: tournamentId },
    orderBy: [{ round_number: "asc" }, { match_number_in_round: "asc" }],
    include: {
      match: {
        include: {
          players: {
            orderBy: { id: "asc" }, // first inserted = p1
            include: { user: { select: { id: true, username: true } } },
          },
        },
      },
    },
  });

  return rows.map(tm => toMatchDTO(tm));
}

export async function getMatchDTO(matchId: number): Promise<MatchDTO> {
  const tm = await prisma.tournamentMatch.findFirst({
    where: { match_id: matchId },
    include: {
      match: {
        include: {
          players: {
            orderBy: { id: "asc" },
            include: { user: { select: { id: true, username: true } } },
          },
        },
      },
    },
  });

  if (!tm) throw new Error("Match not found");
  return toMatchDTO(tm);
}

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

export async function getTournamentWithMatches(tournamentId: number): Promise<TournamentDTO | null> {
  const t = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      players: { include: { user: { select: { id: true, username: true } } }, orderBy: { id: "asc" } },
      matches: {
        orderBy: [{ round_number: "asc" }, { match_number_in_round: "asc" }],
        include: {
          match: {
            include: {
              players: {
                orderBy: { id: "asc" },
                include: { user: { select: { id: true, username: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!t) return null;

  const matches = t.matches.map(tm => toMatchDTO(tm));
  const registeredPlayers = t.players
    .filter(tp => tp.user)
    .map(tp => ({ id: tp.user!.id, name: tp.user!.username }));

  const winnerName =
    t.winner_id != null ? (registeredPlayers.find(p => p.id === t.winner_id)?.name ?? null) : null;

  return {
    id: t.id,
    name: t.name ?? "",
    currentRound: t.current_round,
    state: t.state,
    matches,
    winnerName,
    winnerId: t.winner_id ?? null,
    max_players: t.max_players,
    registeredPlayers,
  };
}

export async function get_ActiveTournament(): Promise<TournamentDTO | null> {
  const t = await prisma.tournament.findFirst({
    where: { state: { in: ["waiting", "active"] } },
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (!t) return null;
  return getTournamentWithMatches(t.id);
}

// ---- helper ----
function toMatchDTO(tm: any): MatchDTO {
  const m = tm.match;

  const players = (m.players ?? [])
    .filter((p: any) => p.user)
    .map((p: any) => ({ id: p.user.id, name: p.user.username }));

  const p1 = players[0] ?? { id: 0, name: "TBD" };
  const p2 = players[1] ?? { id: 0, name: "TBD" };

  return {
    id: tm.match_id,
    p1,
    p2,
    winnerId: m.winner_id ?? null,
    status: m.winner_id ? "finished" : "pending",
    round: tm.round_number,
    matchNumber: tm.match_number_in_round,
  };
}
