import { navigate, useState } from "Reactor"
import { unwrap } from "@/core/lib/input/unwrap";
import { vPlayerName } from "@/core/lib/input/validators";




/** @deprecated This form is being phased out in favor of match scenes. */
export default function LegacyFormSetup() {

    function start2P() {
        const p1Raw = (document.getElementById("p1") as HTMLInputElement).value || "Player 1";
        const p2Raw = (document.getElementById("p2") as HTMLInputElement).value || "Player 2";

        let p1: string;
        let p2: string;

        try {
            p1 = unwrap(vPlayerName(p1Raw, "Player 1"));
            p2 = unwrap(vPlayerName(p2Raw, "Player 2"));
        } catch (e: any) {
            alert(e.message);
            return;
        }

        navigate("/game/pong", {
            state: {
                mode: "2p",
                p1,
                p2
            }
        });
    }

    function startAI() {
        const p1Raw = (document.getElementById("p1_ai") as HTMLInputElement).value || "Player";
        const difficultyRaw = (document.getElementById("difficulty") as HTMLSelectElement).value;

        let p1: string;
        let difficulty: "easy" | "medium" | "hard";

        try {
            p1 = unwrap(vPlayerName(p1Raw, "Player"));
            if (difficultyRaw !== "easy" && difficultyRaw !== "medium" && difficultyRaw !== "hard") {
                throw new Error("Invalid difficulty");
            }
            difficulty = difficultyRaw;
        } catch (e: any) {
            alert(e.message);
            return;
        }

        navigate("/game/pong", {
            state: {
                mode: "ai",
                p1,
                difficulty
            }
        });
    }

    function start4P() {
        const p1Raw = (document.getElementById("t1p1") as HTMLInputElement).value || "P1";
        const p2Raw = (document.getElementById("t1p2") as HTMLInputElement).value || "P2";
        const p3Raw = (document.getElementById("t2p1") as HTMLInputElement).value || "P3";
        const p4Raw = (document.getElementById("t2p2") as HTMLInputElement).value || "P4";

        let p1: string, p2: string, p3: string, p4: string;

        try {
            p1 = unwrap(vPlayerName(p1Raw, "P1"));
            p2 = unwrap(vPlayerName(p2Raw, "P2"));
            p3 = unwrap(vPlayerName(p3Raw, "P3"));
            p4 = unwrap(vPlayerName(p4Raw, "P4"));
        } catch (e: any) {
            alert(e.message);
            return;
        }
        navigate("/game/4p_pong", {
            state: {
                mode: "4p",
                p1,
                p2,
                p3,
                p4,
            }
        });
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold mb-10">Single Game</h1>

            {/* 2 PLAYER SECTION */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96 mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-center">2 Players</h2>

                <input
                    id="p1"
                    placeholder="Player 1 Name"
                    className="w-full mb-3 p-2 text-gray-300 rounded"
                />
                <input
                    id="p2"
                    placeholder="Player 2 Name"
                    className="w-full mb-3 p-2 text-gray-300 rounded"
                />

                <button
                    onClick={start2P}
                    className="w-full bg-blue-500 py-3 rounded text-xl font-bold hover:bg-blue-400"
                >
                    Start 2P Game
                </button>
            </div>

            {/* AI SECTION */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96 mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-center">Play vs AI</h2>

                <input
                    id="p1_ai"
                    placeholder="Your Name"
                    className="w-full mb-3 p-2 text-gray-300 rounded"
                />

                <select
                    id="difficulty"
                    className="w-full mb-3 p-2 text-gray-300 rounded"
                >
                    <option value="easy">Easy</option>
                    <option value="medium" selected>Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <button
                    onClick={startAI}
                    className="w-full bg-green-500 py-3 rounded text-xl font-bold hover:bg-green-400"
                >
                    Play vs AI
                </button>
            </div>

            {/* 4 PLAYER SECTION */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96 mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-center">4 Players</h2>

                <input id="t1p1" placeholder="Team 1 - Player 1" className="w-full mb-3 p-2 text-gray-300 rounded" />
                <input id="t1p2" placeholder="Team 1 - Player 2" className="w-full mb-3 p-2 text-gray-300 rounded" />
                <input id="t2p1" placeholder="Team 2 - Player 1" className="w-full mb-3 p-2 text-gray-300 rounded" />
                <input id="t2p2" placeholder="Team 2 - Player 2" className="w-full mb-3 p-2 text-gray-300 rounded" />

                <button
                    onClick={start4P}
                    className="w-full bg-purple-500 py-3 rounded text-xl font-bold hover:bg-purple-400"
                >
                    Start 4P Game
                </button>
            </div>

            <button
                    onClick= {navigate("/")}
                    className="text-cyan-400 underline hover:text-cyan-200"
                >
                    Back to Home
            </button>
        </div>
    );
}
