import { PongAI } from './pong_ai'
export const GAME_PAUSE_EVENT = "pong:pause";


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



let PADDLE_SPEED = 6;

let GAME_SPEED = 2;

const WIN_SCORE = 3;


export function pongLogic(
	elements: {
		ball: HTMLElement;
		leftPaddle: HTMLElement;
		rightPaddle: HTMLElement;
		pauseBtn: HTMLElement;
		scoreLeft: HTMLElement;
		scoreRight: HTMLElement;
	},
	p1: string,
	p2: string,
	onWin: (winner: string, scoreP1: number, scoreP2: number) => void,
	inputRef: { current: { w: boolean; s: boolean; up: boolean; down: boolean } },
	useAI: boolean = false,
	aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium'
) {
	const ball = elements.ball;
	const left_p = elements.leftPaddle;
	const right_p = elements.rightPaddle;
	const pause = elements.pauseBtn;
	// Buttons handled via hooks in PongGame
	// const left_up_But = elements.leftUpBtn;
	// ...

	let isPaused = false;


	// Initial ball position (centered in playable area)
	// Initial state variables
	let state = 0;
	let x: number, y: number;
	let dx: number, dy: number;
	let paddleY_Left: number, paddleY_Right: number;

	function handle_parameters() {
		let width = window.innerWidth;

		// Calculate speed scaling factors based on width/height
		// Base speeds for 800x500 resolution
		// speed = base * (currentDimension / baseDimension)

		if (width < 640) {
			GAME_WIDTH = 320;
			GAME_HEIGHT = 200;
			WALL_WIDTH = 4;
			BALL_SIZE = 12;
			PADDLE_HEIGHT = 64;
			PADDLE_WIDTH = 8;
			PADDLE_DIST = 8;

			// Recalculate dynamic speeds
			GAME_SPEED = 2; // Slower for small screen
			PADDLE_SPEED = 3;

			PLAYABLE_WIDTH = GAME_WIDTH - (2 * WALL_WIDTH);
			PLAYABLE_HEIGHT = GAME_HEIGHT - (2 * WALL_WIDTH);

			if (state == 2) {
				paddleY_Left = paddleY_Left * (200 / 280);
				paddleY_Right = paddleY_Right * (200 / 280);
				x = x * (200 / 280);
				y = y * (200 / 280);
				dx = dx * (200 / 280); // Scale velocity
				dy = dy * (200 / 280);
			}
			else if (state == 0) {
				paddleY_Left = (PLAYABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
				paddleY_Right = (PLAYABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
				x = PLAYABLE_WIDTH / 2 - BALL_SIZE / 2;
				y = PLAYABLE_HEIGHT / 2 - BALL_SIZE / 2;
			}
			state = 1;
		}
		else if (width < 1024) {
			GAME_WIDTH = 400;
			GAME_HEIGHT = 280;
			WALL_WIDTH = 6;
			BALL_SIZE = 16;
			PADDLE_HEIGHT = 80;
			PADDLE_WIDTH = 12;
			PADDLE_DIST = 12;

			GAME_SPEED = 3;
			PADDLE_SPEED = 4.5;

			PLAYABLE_WIDTH = GAME_WIDTH - (2 * WALL_WIDTH);
			PLAYABLE_HEIGHT = GAME_HEIGHT - (2 * WALL_WIDTH);
			if (state == 1) {
				paddleY_Left = paddleY_Left * (280 / 200);
				paddleY_Right = paddleY_Right * (280 / 200);
				x = x * (280 / 200);
				y = y * (280 / 200);
				dx = dx * (280 / 200);
				dy = dy * (280 / 200);
			}
			else if (state == 3) {
				paddleY_Left = paddleY_Left * (280 / 380);
				paddleY_Right = paddleY_Right * (280 / 380);
				x = x * (280 / 380);
				y = y * (280 / 380);
				dx = dx * (280 / 380);
				dy = dy * (280 / 380);
			}
			else if (state == 0) {
				paddleY_Left = (PLAYABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
				paddleY_Right = (PLAYABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
				x = PLAYABLE_WIDTH / 2 - BALL_SIZE / 2;
				y = PLAYABLE_HEIGHT / 2 - BALL_SIZE / 2;
			}
			state = 2;
		}

		else if (width < 1280) {
			GAME_WIDTH = 600;
			GAME_HEIGHT = 380;
			WALL_WIDTH = 8;
			BALL_SIZE = 16;
			PADDLE_HEIGHT = 80;
			PADDLE_WIDTH = 12;
			PADDLE_DIST = 16;

			GAME_SPEED = 4;
			PADDLE_SPEED = 6;

			PLAYABLE_WIDTH = GAME_WIDTH - (2 * WALL_WIDTH);
			PLAYABLE_HEIGHT = GAME_HEIGHT - (2 * WALL_WIDTH);
			if (state == 2) {
				paddleY_Left = paddleY_Left * (380 / 280);
				paddleY_Right = paddleY_Right * (380 / 280);
				x = x * (380 / 280);
				y = y * (380 / 280);
				dx = dx * (380 / 280);
				dy = dy * (380 / 280);
			}
			else if (state == 4) {
				paddleY_Left = paddleY_Left * (380 / 500);
				paddleY_Right = paddleY_Right * (380 / 500);
				x = x * (380 / 500);
				y = y * (380 / 500);
				dx = dx * (380 / 500);
				dy = dy * (380 / 500);
			}
			else if (state == 0) {
				paddleY_Left = (PLAYABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
				paddleY_Right = (PLAYABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
				x = PLAYABLE_WIDTH / 2 - BALL_SIZE / 2;
				y = PLAYABLE_HEIGHT / 2 - BALL_SIZE / 2;
			}
			state = 3;
		}
		else {
			GAME_WIDTH = 800;
			GAME_HEIGHT = 500;
			WALL_WIDTH = 8;
			BALL_SIZE = 16;
			PADDLE_HEIGHT = 96;
			PADDLE_WIDTH = 12;
			PADDLE_DIST = 16;

			GAME_SPEED = 5;
			PADDLE_SPEED = 8;

			PLAYABLE_WIDTH = GAME_WIDTH - (2 * WALL_WIDTH);
			PLAYABLE_HEIGHT = GAME_HEIGHT - (2 * WALL_WIDTH);
			if (state == 3) {
				paddleY_Left = paddleY_Left * (500 / 380);
				paddleY_Right = paddleY_Right * (500 / 380);
				x = x * (500 / 380);
				y = y * (500 / 380);
				dx = dx * (500 / 380);
				dy = dy * (500 / 380);
			}
			else if (state == 0) {
				paddleY_Left = (PLAYABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
				paddleY_Right = (PLAYABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 2);
				x = PLAYABLE_WIDTH / 2 - BALL_SIZE / 2;
				y = PLAYABLE_HEIGHT / 2 - BALL_SIZE / 2;
			}
			state = 4;
		}
		LEFT_PADDLE_X = PADDLE_DIST;
		RIGHT_PADDLE_X = PLAYABLE_WIDTH - PADDLE_DIST - PADDLE_WIDTH;
	}

	const resizeHandler = () => {
		handle_parameters();
		window.dispatchEvent(new Event(GAME_PAUSE_EVENT));
	};

	resizeHandler();
	window.addEventListener("resize", resizeHandler);

	dx = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
	dy = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;


	let scoreLeft = 0;
	let scoreRight = 0;

	const scoreLeftDisplay = elements.scoreLeft;
	const scoreRightDisplay = elements.scoreRight;

	// Show player names
	if (scoreLeftDisplay) scoreLeftDisplay.textContent = `${p1}: 0`;
	if (scoreRightDisplay) scoreRightDisplay.textContent = `${p2}: 0`;

	// AI Setup
	let aiPlayer: PongAI | null = null;
	let gameEnded = false;

	const getGameState = () => ({
		ballX: x,
		ballY: y,
		ballDx: dx,
		ballDy: dy,
		aiPaddleY: paddleY_Right,
		timestamp: Date.now(),
		gameHeight: PLAYABLE_HEIGHT,
		paddleX: RIGHT_PADDLE_X,
		paddleHeight: PADDLE_HEIGHT,
		ballSize: BALL_SIZE
	});

	const simulateKeyPress = (key: string, action: 'down' | 'up') => {
		if (gameEnded) return;

		// Update inputRef directly for AI
		if (key === 'ArrowUp') inputRef.current.up = action === 'down';
		if (key === 'ArrowDown') inputRef.current.down = action === 'down';
	};

	// Initialize AI if needed
	if (useAI) {
		aiPlayer = new PongAI(aiDifficulty);
		aiPlayer.start(getGameState, simulateKeyPress);
	}

	// Event listeners moved to pong.tsx


	const pauseHandler = (e?: Event) => {
		if (gameEnded) return;

		isPaused = true;
		pause.textContent = "▶️ Resume";

		if (aiPlayer) {
			aiPlayer.stop(simulateKeyPress);
		}
	};

	const blurHandler = () => {
		window.dispatchEvent(new Event(GAME_PAUSE_EVENT));
	};

	window.addEventListener(GAME_PAUSE_EVENT, pauseHandler);
	window.addEventListener("blur", blurHandler);

	const toggleHandler = () => {
		if (isPaused) {
			isPaused = false;
			pause.textContent = "⏸️ Pause";
			if (aiPlayer) {
				aiPlayer.start(getGameState, simulateKeyPress);
			}
			lastTime = performance.now();
			animationId = requestAnimationFrame(moveBall);
		} else {
			window.dispatchEvent(new Event(GAME_PAUSE_EVENT));
		}
	};

	pause.addEventListener("click", toggleHandler);

	let animationId: number | null = null;
	let lastTime = performance.now();
	function moveBall(now: number) {
		if (gameEnded || isPaused) {
			lastTime = now; // prevent delta spike after pause
			return;
		}

		const delta = (now - lastTime) / 16.666; // normalize to 60fps
		lastTime = now;

		// --- Ball movement ---
		x += dx * delta;
		y += dy * delta;

		/// Left Paddle collision
		if (
			x <= LEFT_PADDLE_X + PADDLE_WIDTH &&
			x >= LEFT_PADDLE_X + PADDLE_WIDTH - 10 &&
			y + BALL_SIZE >= paddleY_Left &&
			y <= paddleY_Left + PADDLE_HEIGHT
		) {
			dx = -dx * 1.05;
			dy = dy * 1.05;
			x = LEFT_PADDLE_X + PADDLE_WIDTH;
		}

		/// Right Paddle collision
		if (
			x + BALL_SIZE >= RIGHT_PADDLE_X &&
			x + BALL_SIZE <= RIGHT_PADDLE_X + 10 &&
			y + BALL_SIZE >= paddleY_Right &&
			y <= paddleY_Right + PADDLE_HEIGHT
		) {
			dx = -dx * 1.05;
			dy = dy * 1.05;
			x = RIGHT_PADDLE_X - BALL_SIZE;
		}

		/// Top wall
		if (y <= 0) {
			dy = -dy;
			y = 0;
		}

		/// Bottom wall
		else if (y + BALL_SIZE >= PLAYABLE_HEIGHT) {
			dy = -dy;
			y = PLAYABLE_HEIGHT - BALL_SIZE;
		}

		// Render (GPU-friendly)
		ball.style.transform = `translate3d(${x}px, ${y}px, 0)`;

		// --- Paddle movement ---
		movePaddle(delta);

		// Scoring
		if (x < 0) {
			scoreRight++;
			scoreRightDisplay.textContent = `${p2}: ${scoreRight}`;
			checkWinner();
			if (!gameEnded) resetBall();
		}

		if (x + BALL_SIZE > PLAYABLE_WIDTH) {
			scoreLeft++;
			scoreLeftDisplay.textContent = `${p1}: ${scoreLeft}`;
			checkWinner();
			if (!gameEnded) resetBall();
		}

		if (!gameEnded && !isPaused) {
			animationId = requestAnimationFrame(moveBall);
		}
	}

	function clampPaddle(
		pos: number,
		speed: number,
		min: number,
		max: number,
		length: number,
		movingPositive: boolean
	): number {
		if (movingPositive) {
			if (pos + speed + length >= max) return max - length;
			return pos + speed;
		} else {
			if (pos - speed <= min) return min;
			return pos - speed;
		}
	}

	function movePaddle(delta: number) {
		const { w, s, up, down } = inputRef.current;
		const step = PADDLE_SPEED * delta;

		// Left paddle (W / S)
		if (w)
			paddleY_Left = clampPaddle(
				paddleY_Left,
				step,
				0,
				PLAYABLE_HEIGHT,
				PADDLE_HEIGHT,
				false
			);

		if (s)
			paddleY_Left = clampPaddle(
				paddleY_Left,
				step,
				0,
				PLAYABLE_HEIGHT,
				PADDLE_HEIGHT,
				true
			);

		left_p.style.transform = `translate3d(0, ${paddleY_Left}px, 0)`;

		// Right paddle (Arrow Up / Down or AI)
		if (up)
			paddleY_Right = clampPaddle(
				paddleY_Right,
				step,
				0,
				PLAYABLE_HEIGHT,
				PADDLE_HEIGHT,
				false
			);

		if (down)
			paddleY_Right = clampPaddle(
				paddleY_Right,
				step,
				0,
				PLAYABLE_HEIGHT,
				PADDLE_HEIGHT,
				true
			);

		right_p.style.transform = `translate3d(0, ${paddleY_Right}px, 0)`;
	}

	let resetTimeout: number | null = null;

	function resetBall() {
		x = PLAYABLE_WIDTH / 2 - BALL_SIZE / 2;
		y = PLAYABLE_HEIGHT / 2 - BALL_SIZE / 2;
		dx = 0;
		dy = 0;

		ball.style.transform = `translate3d(${x}px, ${y}px, 0)`;

		if (scoreLeft !== WIN_SCORE && scoreRight !== WIN_SCORE) {
			resetTimeout = window.setTimeout(() => {
				dx = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
				dy = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
				resetTimeout = null;
			}, 1000);
		}
	}

	function checkWinner() {
		if (scoreLeft >= WIN_SCORE) {
			showWinner(p1, scoreLeft, scoreRight);
		}
		else if (scoreRight >= WIN_SCORE) {
			showWinner(p2, scoreLeft, scoreRight);
		}
	}

	function showWinner(winner: string, scoreP1: number, scoreP2: number) {
		window.dispatchEvent(new Event(GAME_PAUSE_EVENT));
		gameEnded = true;
		isPaused = true;
		dx = 0;
		dy = 0;

		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);

		if (aiPlayer) aiPlayer.stop(simulateKeyPress);
		// Listeners are removed in the return cleanup function now

		onWin(winner, scoreP1, scoreP2);
		console.log("gameEnded in showWinner")
	}

	lastTime = performance.now();
	animationId = requestAnimationFrame(moveBall);

	return () => {
		console.log("gameEnded in return")
		gameEnded = true;
		isPaused = true;

		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);

		if (aiPlayer) aiPlayer.stop(simulateKeyPress);

		window.removeEventListener("resize", resizeHandler);
		window.removeEventListener(GAME_PAUSE_EVENT, pauseHandler);
		window.removeEventListener("blur", blurHandler);
		// No event listeners to remove here anymore!
		pause.removeEventListener('click', toggleHandler);
	};
}
