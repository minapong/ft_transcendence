export type GameType = "2P" | "AI" | "4P";
export type Difficulty = "easy" | "medium" | "hard";

export interface TeamPlayer {
    name: string;
}

export interface MatchConfig {
    type: GameType;
    players: {
        p1?: string;
        p2?: string;
        p3?: string;
        p4?: string;
    };
    difficulty?: Difficulty;
}
