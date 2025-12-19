export function connect4Logic(onWin: (winner: "R" | "Y" | "draw") => void): () => void {
	const board: (null | "R" | "Y")[] = Array(42).fill(null);
	let currentPlayer: "R" | "Y" = "R";
	let winningCase = false;

	const cells = Array.from(document.querySelectorAll(".cell"));
	const resetBtn = document.getElementById("resetBtn")!;

	function findEmptyCell(col: number): number | null {
		for (let row = 5; row >= 0; row--) {
			const idx = row * 7 + col;
			if (!board[idx]) return idx;
		}
		return null;
	}

	function dropDisc(col: number) {
		if (winningCase) return;
		const idx = findEmptyCell(col);
		if (idx === null) return;

		board[idx] = currentPlayer;

		const cell = document.getElementById(`${idx}`);
		if (cell) {
			cell.classList.remove("bg-white");
			cell.classList.add(currentPlayer === "R" ? "bg-red-500" : "bg-yellow-500");
		}

		if (checkWinner()) {
			winningCase = true;
			onWin(currentPlayer);
			return;
		}

		if (board.every(c => c !== null)) {
			winningCase = true;
			onWin("draw");
			return;
		}

		currentPlayer = currentPlayer === "R" ? "Y" : "R";
	}

	function checkLine(a: number, b: number, c: number, d: number) {
		return board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d];
	}

	function highlight(indices: number[]) {
		indices.forEach(i => document.getElementById(`${i}`)?.classList.add("ring-4", "ring-green-400"));
	}
	
	function checkWinner(): boolean {
		for (let i = 0; i < 42; i++) {
			const row = Math.floor(i / 7);
			const col = i % 7;
	
			if (col <= 3 && checkLine(i, i+1, i+2, i+3)) { highlight([i,i+1,i+2,i+3]); return true; }
			if (row <= 2 && checkLine(i, i+7, i+14, i+21)) { highlight([i,i+7,i+14,i+21]); return true; }
			if (col <= 3 && row <= 2 && checkLine(i, i+8, i+16, i+24)) { highlight([i,i+8,i+16,i+24]); return true; }
			if (col <= 3 && row >= 3 && checkLine(i, i-6, i-12, i-18)) { highlight([i,i-6,i-12,i-18]); return true; }
		}
		return false;
	}

	function resetGame() {
		board.fill(null);
		cells.forEach(c => c.className = "cell w-full aspect-square bg-white rounded-full");
		winningCase = false;
		currentPlayer = "R";
	}

	// Attach listeners
	const listeners: (() => void)[] = [];
	cells.forEach((cell, idx) => {
		const col = idx % 7;
		const handler = () => dropDisc(col);
		cell.addEventListener("click", handler);
		listeners.push(() => cell.removeEventListener("click", handler));
	});
	resetBtn.addEventListener("click", resetGame);
	listeners.push(() => resetBtn.removeEventListener("click", resetGame));

	return () => {
		listeners.forEach(f => f());
	};
}