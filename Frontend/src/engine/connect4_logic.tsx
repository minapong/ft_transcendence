export function connect4Logic()
{
    // 6 rows × 7 columns = 42 cells
    const board: (null | 'R' | 'Y')[] = Array(42).fill(null);

    let currentPlayer: 'R' | 'Y' = 'R';

    // cells[0] => id = 0 (bottom-left)
    // cells[41] => id = 41
    const cells = document.querySelectorAll('.cell');

    let winning_case = false;


    
    for (let col = 0; col < 7; col++) {
        const columnCells = Array.from(cells).filter(
            (_, index) => index % 7 === col
        );

        columnCells.forEach(cell => {
            cell.addEventListener('click', () => dropDisc(col));
        });
    }


    document.getElementById("resetBtn")!.addEventListener("click", resetGame);


    function getColumnIndices(col: number): number[] {
        const indices = [];
        for (let row = 0; row < 6; row++) {
            indices.push(col + row * 7);
        }
        return indices;
    }


    function findEmptyCell(col: number): number | null {
        const column = getColumnIndices(col);

        for (const index of column) {
            if (board[index] === null) {
                return index; // first empty cell (bottom-most)
            }
        }
        return null; // column is full
    }


    function dropDisc(col: number) {
        if (winning_case === true)
            return;
        const index = findEmptyCell(col);

        if (index === null) {
            // Column is full
            return;
        }

        // Update the board array
        board[index] = currentPlayer;

        // Update the HTML circle color
        const cell = document.getElementById(String(index));
        if (cell) {
            cell.classList.remove("bg-white"); // empty color

            if (currentPlayer === "R") {
                cell.classList.add("bg-red-500");
            } else {
                cell.classList.add("bg-yellow-500");
            }
        }

        if (checkWinner()) {
            winning_case = true;
            setTimeout(() => {
            alert(`${currentPlayer} wins!`);
            }, 50);
            return;
        }

        if (checkDraw()) {
            winning_case = true;
            setTimeout(() => {
            alert("Draw! The board is full.");
            }, 50);
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === "R" ? "Y" : "R";
    }




    function checkLine(a: number, b: number, c: number, d: number): boolean {
        return (
            board[a] !== null &&
            board[a] === board[b] &&
            board[a] === board[c] &&
            board[a] === board[d]
        );
    }

    function highlight(winning_ids: number[])
    {
        for (let i = 0; i < 4; i++)
        {
            const cell = document.getElementById(`${winning_ids[i]}`);
            cell.classList.add("ring-4", "ring-green-400");
        }
    }

    function checkWinner(): boolean {
        // Loop over all 42 cells
        for (let i = 0; i < 42; i++) {

            const row = Math.floor(i / 7);
            const col = i % 7;

            // --- 1. Horizontal (→) ---
            if (col <= 3) { // need 4 cells to the right
                if (checkLine(i, i+1, i+2, i+3)) {
                    highlight([i, i+1, i+2, i+3]);
                    return true;
                }
            }

            // --- 2. Vertical (↑) ---
            if (row <= 2) { // need 4 cells upward
                if (checkLine(i, i+7, i+14, i+21)) {
                    highlight([i, i+7, i+14, i+21]);
                    return true;
                }
            }

            // --- 3. Diagonal (↗) up-right ---
            if (col <= 3 && row <= 2) {
                if (checkLine(i, i+8, i+16, i+24)) {
                    highlight([i, i+8, i+16, i+24]);
                    return true;
                }
            }

            // --- 4. Diagonal (↘) down-right ---
            // In our coordinate system, up is +7, down is -7
            if (col <= 3 && row >= 3) {
                if (checkLine(i, i-6, i-12, i-18)) {
                    highlight([i, i-6, i-12, i-18]);
                    return true;
                }
            }
        }

        return false;
    }

    function checkDraw(): boolean {
        return board.every(cell => cell !== null);
    }



    function resetGame() {
        // Reset internal board
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                board[c + r * 7] = null;
            }
        }

        // Clear UI
        document.querySelectorAll(".cell").forEach(cell => {
            cell.classList.remove("bg-red-500", "bg-yellow-500", "ring-4", "ring-green-400");
            cell.classList.add("bg-white");
        });

        // Reset player
        currentPlayer = "R";

        // Reset game state
        winning_case = false;
   
    }

}
