// Shared type definitions for tournament system

export interface PlayerDTO {
    id: number;
    name: string;
}

export interface MatchDTO {
    id: number;
    p1: PlayerDTO;
    p2: PlayerDTO;
    winnerId: number | null;
    status: "finished" | "pending";
    round: number;
    matchNumber?: number;
}

export interface TournamentDTO {
    id: number;
    name: string;
    currentRound: number;
    state: "waiting" | "active" | "finished";
    matches: MatchDTO[] | [];
    winnerId: number | null;
	winnerName: string | null;
	max_players: number;
	registeredPlayers: PlayerDTO[] | [],
}

// Database row types (internal to repo layer)
export interface TournamentRow {
    id: number;
    name: string;
    state: "waiting" | "active" | "finished";
    current_round: number;
    winner_id: number | null;
	max_players: number;
}

export interface MatchRow {
    match_id: number;
    round_number: number;
    match_number_in_round: number;
    winner_id: number | null;
    p1_id: number | null;
    p1_name: string | null;
    p2_id: number | null;
    p2_name: string | null;
}