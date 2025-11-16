import {pongLogic} from "../engine/4p_pong_logic"


export default function Pong() {
    setTimeout(() => {
        pongLogic();
    }, 0); // or 50ms to be extra safe
	return(
        <div className="bg-gray-900 flex flex-col items-center justify-center h-screen">
            <div className="flex justify-between w-[800px] text-white text-2xl font-bold mb-2">
                <span id="scoreRed">Red team: 0</span>
                <span id="scoreBlue">Blue team: 0</span>
            </div>

            
            {/* Game board */}
            <div id="game_board" className="bg-gray-800 border-8 border-l-red-500 border-b-red-500 border-t-blue-500 border-r-blue-500 rounded-lg w-[500px] h-[500px] relative">
            
                {/* Left paddle */}
                <div id="left_p" className="absolute left-4 top-1/2 w-3 h-24 bg-white"></div>

                {/* Right paddle */}
                <div id="right_p" className="absolute right-4 top-1/2 w-3 h-24 bg-white"></div>

                {/* Upper paddle */}
                <div id="upper_p" className="absolute top-4 left-1/2 w-24 h-3 bg-white"></div>

                {/* Lower paddle */}
                <div id="lower_p" className="absolute bottom-4 left-1/2 w-24 h-3 bg-white"></div>

                {/* Ball */}
                <div id="ball" className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2"></div>
            
            </div>
            <button id="pauseBtn" className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400">
                ⏸️ Pause
            </button>
        </div>
	);
}