import { prisma } from "../db";
import { Prisma } from "@prisma/client";
import {
  PlayerDTO,
  MatchDTO,
  TournamentDTO,
} from "../types/tournament";

// ─────────────────────────────────────────────
// Types from Prisma (for precise typing)
// ─────────────────────────────────────────────
type PrismaMatchWithRelations = Prisma.MatchGetPayload<{
  include: {
    matchPlayers: {
      include: { user: { select: { id: true; username: true } } };
    };
    tournamentInfo: { select: { roundNumber: true; matchNumberInRound: true } };
  };
}>;

type PrismaTournamentMatchWithMatch = Prisma.TournamentMatchGetPayload<{
  include: {
    match: {
      include: {
        matchPlayers: {
          include: { user: { select: { id: true; username: true } } };
        };
      };
    };
  };
}>;

type PrismaTournamentPlayerWithUser = Prisma.TournamentPlayerGetPayload<{
  include: { user: { select: { id: true; username: true } } };
}>;

// ─────────────────────────────────────────────
// Helper: Build MatchDTO from Prisma data
// ─────────────────────────────────────────────
function buildMatchDTO(match: PrismaMatchWithRelations): MatchDTO {
  const sortedPlayers = [...match.matchPlayers].sort((a, b) => a.id - b.id);
  const p1 = sortedPlayers[0];
  const p2 = sortedPlayers[1];

  return {
    id: match.id,
    p1: {
      id: p1.userId!,
      name: p1.user?.username || "Unknown",
    },
    p2: {
      id: p2.userId!,
      name: p2.user?.username || "Unknown",
    },
    winnerId: match.winnerId ?? undefined,
    status: match.winnerId ? "finished" : "pending",
    round: match.tournamentInfo[0]?.roundNumber || 0,
    matchNumber: match.tournamentInfo[0]?.matchNumberInRound || 0,
  };
}

// ─────────────────────────────────────────────
// Create tournament
// ─────────────────────────────────────────────
export async function insertTournament(name: string, maxPlayers: number = 4): Promise<number> {
  if (!name?.trim()) throw new Error("Tournament name cannot be empty");
  if (![4, 8].includes(maxPlayers)) throw new Error("Max players must be 4 or 8");

  const tournament = await prisma.tournament.create({
    data: {
      name: name.trim(),
      maxPlayers,
    },
  });

  return tournament.id;
}

// ─────────────────────────────────────────────
// Get tournament by ID
// ─────────────────────────────────────────────
export async function getTournamentById(id: number) {
  return prisma.tournament.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      state: true,
      currentRound: true,
      maxPlayers: true,
      winnerId: true,
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

  const player = await prisma.tournamentPlayer.create({
    data: {
      tournamentId,
      userId,
      alias: alias || null,
    },
  });

  return player.id;
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
  nextMatchId?: number
): Promise<number> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const match = await tx.match.create({ data: {} });

    await tx.tournamentMatch.create({
      data: {
        tournamentId,
        matchId: match.id,
        roundNumber,
        matchNumberInRound: matchNumber,
        nextTournamentMatchId: nextMatchId || null,
      },
    });

    if (p1Id !== null && p1Id !== 0) {
      await tx.matchPlayer.create({ data: { matchId: match.id, userId: p1Id } });
    }
    if (p2Id !== null && p2Id !== 0) {
      await tx.matchPlayer.create({ data: { matchId: match.id, userId: p2Id } });
    }

    return match.id;
  });
}

export async function insertMatchPlayer(matchId: number, userId: number): Promise<number> {
  const mp = await prisma.matchPlayer.create({
    data: { matchId, userId },
  });
  return mp.id;
}

// ─────────────────────────────────────────────
// Get matches for tournament
// ─────────────────────────────────────────────
export async function getMatchesForTournament(tournamentId: number): Promise<MatchDTO[]> {
  if (!tournamentId) return [];

  const matches = await prisma.match.findMany({
    where: { tournamentInfo: { some: { tournamentId } } },
    include: {
      matchPlayers: {
        include: { user: { select: { id: true, username: true } } },
        orderBy: { id: "asc" },
      },
      tournamentInfo: {
        select: { roundNumber: true, matchNumberInRound: true },
      },
    },
  });

  return matches.map(buildMatchDTO);
}

// ─────────────────────────────────────────────
// Record winner
// ─────────────────────────────────────────────
export async function recordMatchWinner(matchId: number, winnerId: number): Promise<void> {
  if (!matchId || !winnerId) throw new Error("Invalid input");

  await prisma.match.update({
    where: { id: matchId },
    data: { winnerId },
  });
}

// ─────────────────────────────────────────────
// Registered players
// ─────────────────────────────────────────────
export async function getRegisteredPlayers(tournamentId: number): Promise<PlayerDTO[]> {
  const players = await prisma.tournamentPlayer.findMany({
    where: { tournamentId },
    include: { user: { select: { id: true, username: true } } },
    orderBy: { id: "asc" },
  });

  return players.map((p: PrismaTournamentPlayerWithUser) => ({
    id: p.userId!,
    name: p.user?.username || "Guest",
  }));
}

// ─────────────────────────────────────────────
// Players in a match
// ─────────────────────────────────────────────
export async function getMatchPlayers(matchId: number): Promise<PlayerDTO[]> {
  const players = await prisma.matchPlayer.findMany({
    where: { matchId },
    include: { user: { select: { id: true, username: true } } },
  });

  return players.map(p => ({
    id: p.userId!,
    name: p.user?.username || "Unknown",
  }));
}

// ─────────────────────────────────────────────
// Single match DTO
// ─────────────────────────────────────────────
export async function getMatchDTO(matchId: number): Promise<MatchDTO> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      matchPlayers: {
        include: { user: { select: { id: true, username: true } } },
        orderBy: { id: "asc" },
      },
      tournamentInfo: {
        select: { roundNumber: true, matchNumberInRound: true },
      },
    },
  });

  if (!match) throw new Error("Match not found");

  return buildMatchDTO(match);
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
      currentRound,
      winnerId: winnerId ?? null,
    },
  });

  return getTournamentWithMatches(tournamentId);
}

// ─────────────────────────────────────────────
// Full tournament with matches & players
// ─────────────────────────────────────────────
export async function getTournamentWithMatches(tournamentId: number): Promise<TournamentDTO | null> {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      players: {
        include: { user: { select: { id: true, username: true } } },
      },
      matches: {
        include: {
          match: {
            include: {
              matchPlayers: {
                include: { user: { select: { id: true, username: true } } },
                orderBy: { id: "asc" },
              },
              tournamentInfo: {
                select: { roundNumber: true, matchNumberInRound: true },
              },
            },
          },
        },
        orderBy: [
          { roundNumber: "asc" },
          { matchNumberInRound: "asc" },
        ],
      },
    },
  });

  if (!tournament) return null;

  const matches = tournament.matches.map((tm: PrismaTournamentMatchWithMatch) => buildMatchDTO(tm.match));

  const winnerMatch = matches.find(m => m.winnerId === tournament.winnerId);
  const winnerName = winnerMatch
    ? winnerMatch.p1.id === tournament.winnerId
      ? winnerMatch.p1.name
      : winnerMatch.p2.name
    : null;

  const registeredPlayers = tournament.players.map((p: PrismaTournamentPlayerWithUser) => ({
    id: p.userId!,
    name: p.user?.username || "Guest",
  }));

  return {
    id: tournament.id,
    name: tournament.name || undefined,
    currentRound: tournament.currentRound,
    state: tournament.state,
    matches,
    winnerName,
    winnerId: tournament.winnerId ?? undefined,
    max_players: tournament.maxPlayers,
    registeredPlayers,
  };
}

// ─────────────────────────────────────────────
// Get active tournament
// ─────────────────────────────────────────────
export async function get_ActiveTournament(): Promise<TournamentDTO | null> {
  const active = await prisma.tournament.findFirst({
    where: { state: { in: ["waiting", "active"] } },
    orderBy: { id: "asc" },
  });

  if (!active) return null;

  return getTournamentWithMatches(active.id);
}