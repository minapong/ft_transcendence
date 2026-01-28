import { PongAI } from './pong_ai'

let GAME_WIDTH: number;
let GAME_HEIGHT: number;
let WALL_WIDTH: number;
let BALL_SIZE: number;
let PADDLE_HEIGHT: number;
let PADDLE_WIDTH: number;
let PADDLE_DIST: number;

let PLAYABLE_WIDTH: number;
let PLAYABLE_HEIGHT: number;
let LEFT_PADDLE_X: number;
let RIGHT_PADDLE_X: number;

function handle_parameters() {
	let width = window.innerWidth;

	if (width < 640) {
		GAME_WIDTH = 320;
		GAME_HEIGHT = 200;
		WALL_WIDTH = 4;
		BALL_SIZE = 12;
		PADDLE_HEIGHT = 64;
		PADDLE_WIDTH = 8;
		PADDLE_DIST = 8;
	}
	else if (width < 1024) {
		GAME_WIDTH = 400;
		GAME_HEIGHT = 280;
		WALL_WIDTH = 6;
		BALL_SIZE = 16;
		PADDLE_HEIGHT = 80;
		PADDLE_WIDTH = 12;
		PADDLE_DIST = 12;
	}
	else if (width < 1280) {
		GAME_WIDTH = 600;
		GAME_HEIGHT = 380;
		WALL_WIDTH = 8;
		BALL_SIZE = 16;
		PADDLE_HEIGHT = 80;
		PADDLE_WIDTH = 12;
		PADDLE_DIST = 16;
	}
	else {
		GAME_WIDTH = 800;
		GAME_HEIGHT = 500;
		WALL_WIDTH = 8;
		BALL_SIZE = 16;
		PADDLE_HEIGHT = 96;
		PADDLE_WIDTH = 12;
		PADDLE_DIST = 16;
	}
	PLAYABLE_WIDTH = GAME_WIDTH - (2 * WALL_WIDTH);
	PLAYABLE_HEIGHT = GAME_HEIGHT - (2 * WALL_WIDTH);
	LEFT_PADDLE_X = PADDLE_DIST;
	RIGHT_PADDLE_X = PLAYABLE_WIDTH - PADDLE_DIST - PADDLE_WIDTH;
}

// Initial call to set global params
handle_parameters();

const PADDLE_SPEED = 6;
const GAME_SPEED = 2;
const WIN_SCORE = 3;

export function pongLogic(
	p1: string,
	p2: string,
	onWin: (winner: string, scoreP1: number, scoreP2: number) => void,
	useAI: boolean = false,
	aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium'
) {
	const ball = document.getElementById('ball');
	const left_p = document.getElementById('left_p');
	const right_p = document.getElementById('right_p');
	const pause = document.getElementById("pauseBtn") as HTMLButtonElement;
	const left_up_But = document.getElementById("left-up");
	const left_down_But = document.getElementById("left-down");
	const right_up_But = document.getElementById("right-up");
	const right_down_But = document.getElementById("right-down");

	if (!ball || !left_p || !right_p || !pause) {
		console.error("[PongLogic] Missing critical DOM elements:", { ball, left_p, right_p, pause });
		return () => { };
	}

	let isPaused = false;
	let gameEnded = false;
	let inputEnabled = true;
	let animationId: number | null = null;
	let resetTimeout: number | null = null;

	// Update params for the current window size
	handle_parameters();

	let x = PLAYABLE_WIDTH / 2 - BALL_SIZE / 2;
	let y = PLAYABLE_HEIGHT / 2 - BALL_SIZE / 2;
	let dx = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
	let dy = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;

	let paddleY_Left = (GAME_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
	let paddleY_Right = (GAME_HEIGHT / 2) - (PADDLE_HEIGHT / 2);

	let upPressed = false;
	let downPressed = false;
	let wPressed = false;
	let sPressed = false;

	let scoreLeft = 0;
	let scoreRight = 0;

	const scoreLeftDisplay = document.getElementById('scoreLeft');
	const scoreRightDisplay = document.getElementById('scoreRight');

	if (scoreLeftDisplay) scoreLeftDisplay.textContent = `${p1}: 0`;
	if (scoreRightDisplay) scoreRightDisplay.textContent = `${p2}: 0`;

	let aiPlayer: PongAI | null = null;
	const getGameState = () => ({
		ballX: x,
		ballY: y,
		ballDx: dx,
		ballDy: dy,
		aiPaddleY: paddleY_Right,
		timestamp: Date.now()
	});

	const simulateKeyPress = (key: string, action: 'down' | 'up') => {
		if (gameEnded) return;
		const event = new KeyboardEvent(`key${action}`, {
			key: key,
			bubbles: true,
			cancelable: true
		});
		document.dispatchEvent(event);
	};

	if (useAI) {
		aiPlayer = new PongAI(aiDifficulty);
		aiPlayer.start(getGameState, simulateKeyPress);
	}

	const keydownHandler = (e: KeyboardEvent) => {
		if (!inputEnabled) return;
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			if (useAI && e.isTrusted) return;
		}
		if (e.key === 'ArrowUp') upPressed = true;
		if (e.key === 'ArrowDown') downPressed = true;
		if (e.key === 'w') wPressed = true;
		if (e.key === 's') sPressed = true;
	};

	const keyupHandler = (e: KeyboardEvent) => {
		if (!inputEnabled) return;
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			if (useAI && e.isTrusted) return;
		}
		if (e.key === 'ArrowUp') upPressed = false;
		if (e.key === 'ArrowDown') downPressed = false;
		if (e.key === 'w') wPressed = false;
		if (e.key === 's') sPressed = false;
	};

	const setPause = (paused: boolean) => {
		if (gameEnded || isPaused === paused) return;
		isPaused = paused;
		inputEnabled = !isPaused && !gameEnded;
		if (isPaused) {
			pause.textContent = "▶️ Resume";
			if (aiPlayer) aiPlayer.stop(simulateKeyPress);
			if (animationId !== null) cancelAnimationFrame(animationId);
		} else {
			pause.textContent = "⏸️ Pause";
			if (aiPlayer) aiPlayer.start(getGameState, simulateKeyPress);
			moveBall();
		}
	};

	const pauseHandler = () => setPause(!isPaused);

	const sidebarPauseHandler = () => setPause(true);
	const sidebarResumeHandler = () => setPause(false);

	const resizeHandler = () => {
		// Auto-pause game on resize to prevent issues during re-rendering
		if (!isPaused && !gameEnded) {
			isPaused = true;
			inputEnabled = false;
			pause.textContent = "▶️ Resume (Paused: Resize)";
			if (aiPlayer) aiPlayer.stop(simulateKeyPress);
			if (animationId !== null) cancelAnimationFrame(animationId);
		}
		handle_parameters();
	};

	// Event Listeners
	document.addEventListener('keydown', keydownHandler);
	document.addEventListener('keyup', keyupHandler);
	pause.addEventListener("click", pauseHandler);
	window.addEventListener('resize', resizeHandler);
	window.addEventListener('sidebar:pause', sidebarPauseHandler);
	window.addEventListener('sidebar:resume', sidebarResumeHandler);

	if (left_up_But) {
		left_up_But.addEventListener("pointerdown", () => { wPressed = true; });
		left_up_But.addEventListener("pointerup", () => { wPressed = false; });
	}
	if (left_down_But) {
		left_down_But.addEventListener("pointerdown", () => { sPressed = true; });
		left_down_But.addEventListener("pointerup", () => { sPressed = false; });
	}
	if (right_up_But) {
		right_up_But.addEventListener("pointerdown", () => { upPressed = true; });
		right_up_But.addEventListener("pointerup", () => { upPressed = false; });
	}
	if (right_down_But) {
		right_down_But.addEventListener("pointerdown", () => { downPressed = true; });
		right_down_But.addEventListener("pointerup", () => { downPressed = false; });
	}

	function moveBall() {
		if (isPaused || gameEnded) return;
		x += dx;
		y += dy;

		// Collisions
		if (x <= LEFT_PADDLE_X + PADDLE_WIDTH && x >= LEFT_PADDLE_X + PADDLE_WIDTH - 8 &&
			y + BALL_SIZE >= paddleY_Left && y <= paddleY_Left + PADDLE_HEIGHT) {
			dx = -dx;
			x = LEFT_PADDLE_X + PADDLE_WIDTH;
		}
		if (x + BALL_SIZE >= RIGHT_PADDLE_X && x + BALL_SIZE <= RIGHT_PADDLE_X + 8 &&
			y + BALL_SIZE >= paddleY_Right && y <= paddleY_Right + PADDLE_HEIGHT) {
			dx = -dx;
			x = RIGHT_PADDLE_X - BALL_SIZE;
		}
		if (y <= 0) { dy = -dy; y = 0; }
		else if (y + BALL_SIZE >= PLAYABLE_HEIGHT) { dy = -dy; y = PLAYABLE_HEIGHT - BALL_SIZE; }

		if (ball) {
			ball.style.left = x + 'px';
			ball.style.top = y + 'px';
		}

		movePaddle();

		if (x < 0) {
			scoreRight++;
			if (scoreRightDisplay) scoreRightDisplay.textContent = `${p2}: ${scoreRight}`;
			checkWinner();
			resetBall();
		} else if (x + BALL_SIZE > PLAYABLE_WIDTH) {
			scoreLeft++;
			if (scoreLeftDisplay) scoreLeftDisplay.textContent = `${p1}: ${scoreLeft}`;
			checkWinner();
			resetBall();
		} else {
			animationId = requestAnimationFrame(moveBall);
		}
	}

	function clampPaddle(pos: number, speed: number, min: number, max: number, length: number, movingPositive: boolean): number {
		if (movingPositive) {
			if (pos + speed + length >= max) return max - length;
			return pos + speed;
		} else {
			if (pos - speed <= min) return min;
			return pos - speed;
		}
	}

	function movePaddle() {
		if (wPressed) paddleY_Left = clampPaddle(paddleY_Left, PADDLE_SPEED, 0, PLAYABLE_HEIGHT, PADDLE_HEIGHT, false);
		if (sPressed) paddleY_Left = clampPaddle(paddleY_Left, PADDLE_SPEED, 0, PLAYABLE_HEIGHT, PADDLE_HEIGHT, true);
		if (left_p) left_p.style.top = `${paddleY_Left}px`;

		if (upPressed) paddleY_Right = clampPaddle(paddleY_Right, PADDLE_SPEED, 0, PLAYABLE_HEIGHT, PADDLE_HEIGHT, false);
		if (downPressed) paddleY_Right = clampPaddle(paddleY_Right, PADDLE_SPEED, 0, PLAYABLE_HEIGHT, PADDLE_HEIGHT, true);
		if (right_p) right_p.style.top = `${paddleY_Right}px`;
	}

	function resetBall() {
		x = PLAYABLE_WIDTH / 2 - BALL_SIZE / 2;
		y = PLAYABLE_HEIGHT / 2 - BALL_SIZE / 2;
		dx = 0;
		dy = 0;
		if (ball) {
			ball.style.left = x + 'px';
			ball.style.top = y + 'px';
		}
		if (scoreLeft !== WIN_SCORE && scoreRight !== WIN_SCORE) {
			resetTimeout = window.setTimeout(() => {
				dx = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
				dy = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
				resetTimeout = null;
				moveBall();
			}, 1000);
		}
	}

	function checkWinner() {
		if (scoreLeft >= WIN_SCORE) showWinner(p1, scoreLeft, scoreRight);
		else if (scoreRight >= WIN_SCORE) showWinner(p2, scoreLeft, scoreRight);
	}

	function showWinner(winner: string, s1: number, s2: number) {
		gameEnded = true;
		isPaused = true;
		inputEnabled = false;
		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);
		if (aiPlayer) aiPlayer.stop(simulateKeyPress);
		onWin(winner, s1, s2);
	}

	// Start Game
	moveBall();

	return () => {
		gameEnded = true;
		isPaused = true;
		inputEnabled = false;
		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);
		if (aiPlayer) aiPlayer.stop(simulateKeyPress);

		document.removeEventListener('keydown', keydownHandler);
		document.removeEventListener('keyup', keyupHandler);
		pause.removeEventListener('click', pauseHandler);
		window.removeEventListener('resize', resizeHandler);
		window.removeEventListener('sidebar:pause', sidebarPauseHandler);
		window.removeEventListener('sidebar:resume', sidebarResumeHandler);
	};
}