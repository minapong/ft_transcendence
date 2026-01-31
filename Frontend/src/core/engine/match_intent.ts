/**
 * Match Intent Type System
 * 
 * Intent is the single source of truth for what kind of match the user wants to play.
 * The UI is driven by intent, not the other way around.
 */

export type Difficulty = "easy" | "medium" | "hard";
export type IntentType = "AI" | "2P" | "4P";

export interface Intent {
    type: IntentType;

    label: string;

    participants: number;

    ruleset: {
        difficulty?: Difficulty;
    };

    slots: {
        p1: string;
        p2?: string;
        p3?: string;
        p4?: string;
    };
}

export const IntentPresets = {
    AI: (): Intent => ({
        type: "AI",
        label: "Solo Trial",
        participants: 1,
        ruleset: { difficulty: "medium" },
        slots: { p1: "" }
    }),

    "2P": (): Intent => ({
        type: "2P",
        label: "Duel Protocol",
        participants: 2,
        ruleset: {},
        slots: { p1: "", p2: "" }
    }),

    "4P": (): Intent => ({
        type: "4P",
        label: "Squad Chaos",
        participants: 4,
        ruleset: {},
        slots: { p1: "", p2: "", p3: "", p4: "" }
    })
};
