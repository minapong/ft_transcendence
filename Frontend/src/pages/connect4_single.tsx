import { navigate } from "Reactor";

export default function Connect4Single() {
    function start2P() {
        const p1 = (document.getElementById("p1") as HTMLInputElement).value || "Player 1";
        const p2 = (document.getElementById("p2") as HTMLInputElement).value || "Player 2";

        navigate("/connect4", {
            state: {
                mode: "2p",
                p1,
                p2
            }
        });
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold mb-10">Single Game</h1>

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

            <a href="/" className="text-cyan-400 underline hover:text-cyan-200">← Back to Home</a>
        </div>
    );
}