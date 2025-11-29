import {connect4Logic} from "../engine/connect4_logic"


export default function Pong() {
    setTimeout(() => {
        connect4Logic();
    }, 0); // or 50ms to be extra safe
	return(
        
        <div class="min-h-screen flex items-center justify-center bg-slate-50 p-6">

        <main class="w-full max-w-3xl">
        <h1 class="text-2xl font-semibold mb-4">Connect 4</h1>
        {/* <!-- board shell --> */}
        <div class="mx-auto bg-blue-700 p-4 rounded-xl shadow-lg max-w-[720px] w-full aspect-[7/6]">
        {/* <!-- grid container --> */}
    

    
        <div class="grid grid-cols-7 grid-rows-6 gap-6 bg-blue-900 p-4 rounded-lg">
            {/* Bottom row */}
            <div id="0" class="cell w-full aspect-square bg-white rounded-full row-start-6 col-start-1"></div>
            <div id="1" class="cell w-full aspect-square bg-white rounded-full row-start-6 col-start-2"></div>
            <div id="2" class="cell w-full aspect-square bg-white rounded-full row-start-6 col-start-3"></div>
            <div id="3" class="cell w-full aspect-square bg-white rounded-full row-start-6 col-start-4"></div>
            <div id="4" class="cell w-full aspect-square bg-white rounded-full row-start-6 col-start-5"></div>
            <div id="5" class="cell w-full aspect-square bg-white rounded-full row-start-6 col-start-6"></div>
            <div id="6" class="cell w-full aspect-square bg-white rounded-full row-start-6 col-start-7"></div>

            {/* <!-- Second row from bottom --> */}
            <div id="7" class="cell w-full aspect-square bg-white rounded-full row-start-5 col-start-1"></div>
            <div id="8" class="cell w-full aspect-square bg-white rounded-full row-start-5 col-start-2"></div>
            <div id="9" class="cell w-full aspect-square bg-white rounded-full row-start-5 col-start-3"></div>
            <div id="10" class="cell w-full aspect-square bg-white rounded-full row-start-5 col-start-4"></div>
            <div id="11" class="cell w-full aspect-square bg-white rounded-full row-start-5 col-start-5"></div>
            <div id="12" class="cell w-full aspect-square bg-white rounded-full row-start-5 col-start-6"></div>
            <div id="13" class="cell w-full aspect-square bg-white rounded-full row-start-5 col-start-7"></div>

            {/* <!-- Row 3 row-start-4 --> */}
            <div id="14" class="cell w-full aspect-square bg-white rounded-full row-start-4 col-start-1"></div>
            <div id="15" class="cell w-full aspect-square bg-white rounded-full row-start-4 col-start-2"></div>
            <div id="16" class="cell w-full aspect-square bg-white rounded-full row-start-4 col-start-3"></div>
            <div id="17" class="cell w-full aspect-square bg-white rounded-full row-start-4 col-start-4"></div>
            <div id="18" class="cell w-full aspect-square bg-white rounded-full row-start-4 col-start-5"></div>
            <div id="19" class="cell w-full aspect-square bg-white rounded-full row-start-4 col-start-6"></div>
            <div id="20" class="cell w-full aspect-square bg-white rounded-full row-start-4 col-start-7"></div>

            {/* <!-- Row 4 row-start-3 --> */}
            <div id="21" class="cell w-full aspect-square bg-white rounded-full row-start-3 col-start-1"></div>
            <div id="22" class="cell w-full aspect-square bg-white rounded-full row-start-3 col-start-2"></div>
            <div id="23" class="cell w-full aspect-square bg-white rounded-full row-start-3 col-start-3"></div>
            <div id="24" class="cell w-full aspect-square bg-white rounded-full row-start-3 col-start-4"></div>
            <div id="25" class="cell w-full aspect-square bg-white rounded-full row-start-3 col-start-5"></div>
            <div id="26" class="cell w-full aspect-square bg-white rounded-full row-start-3 col-start-6"></div>
            <div id="27" class="cell w-full aspect-square bg-white rounded-full row-start-3 col-start-7"></div>

            {/* <!-- Row 5 row-start-2 --> */}
            <div id="28" class="cell w-full aspect-square bg-white rounded-full row-start-2 col-start-1"></div>
            <div id="29" class="cell w-full aspect-square bg-white rounded-full row-start-2 col-start-2"></div>
            <div id="30" class="cell w-full aspect-square bg-white rounded-full row-start-2 col-start-3"></div>
            <div id="31" class="cell w-full aspect-square bg-white rounded-full row-start-2 col-start-4"></div>
            <div id="32" class="cell w-full aspect-square bg-white rounded-full row-start-2 col-start-5"></div>
            <div id="33" class="cell w-full aspect-square bg-white rounded-full row-start-2 col-start-6"></div>
            <div id="34" class="cell w-full aspect-square bg-white rounded-full row-start-2 col-start-7"></div>

            {/* <!-- Row 6 (top row) row-start-1 --> */}
            <div id="35" class="cell w-full aspect-square bg-white rounded-full row-start-1 col-start-1"></div>
            <div id="36" class="cell w-full aspect-square bg-white rounded-full row-start-1 col-start-2"></div>
            <div id="37" class="cell w-full aspect-square bg-white rounded-full row-start-1 col-start-3"></div>
            <div id="38" class="cell w-full aspect-square bg-white rounded-full row-start-1 col-start-4"></div>
            <div id="39" class="cell w-full aspect-square bg-white rounded-full row-start-1 col-start-5"></div>
            <div id="40" class="cell w-full aspect-square bg-white rounded-full row-start-1 col-start-6"></div>
            <div id="41" class="cell w-full aspect-square bg-white rounded-full row-start-1 col-start-7"></div>
        </div>

        <div class="mt-4 flex justify-center">
            <button id="resetBtn" 
                    class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Reset Game
            </button>
        </div>


        </div>
        </main>
        </div>
	);
}