
let P4_GAME_WIDTH: number;
let P4_GAME_HEIGHT: number;
let P4_WALL_WIDTH: number;

let P4_BALL_SIZE: number;

let P4_PADDLE_LENGTH: number;
let P4_PADDLE_THICKNESS: number;
let P4_PADDLE_DIST: number;


let P4_PLAYABLE_WIDTH: number;
let P4_PLAYABLE_HEIGHT: number;
let P4_LEFT_PADDLE_X: number;
let P4_RIGHT_PADDLE_X: number;
let P4_TOP_PADDLE_Y: number;
let P4_BOTTOM_PADDLE_Y: number;



const P4_PADDLE_SPEED = 6;

const P4_BALL_SPEED = 2;

const P4_WIN_SCORE = 7;

interface Pong4PElements {
	ball: HTMLElement;
	leftPaddle: HTMLElement;
	rightPaddle: HTMLElement;
	upperPaddle: HTMLElement;
	lowerPaddle: HTMLElement;
	pauseBtn: HTMLButtonElement;
	leftUpBtn: HTMLButtonElement;
	leftDownBtn: HTMLButtonElement;
	rightUpBtn: HTMLButtonElement;
	rightDownBtn: HTMLButtonElement;
	topLeftBtn: HTMLButtonElement;
	topRightBtn: HTMLButtonElement;
	bottomLeftBtn: HTMLButtonElement;
	bottomRightBtn: HTMLButtonElement;
	scoreRedDisplay: HTMLElement;
	scoreBlueDisplay: HTMLElement;
}

import { GAME_PAUSE_EVENT } from "./pong_logic";

// ... (existing constants)

export function pong4PLogic(
	elements: Pong4PElements,
	inputRef: {
		current: {
			w: boolean; s: boolean;
			num6: boolean; num3: boolean;
			v: boolean; b: boolean;
			left: boolean; right: boolean;
		}
	},
	onWin: (winner: "red" | "blue") => void
): () => void {
	const {
		ball,
		leftPaddle: left_p,
		rightPaddle: right_p,
		upperPaddle: upper_p,
		lowerPaddle: lower_p,
		pauseBtn: pause,
		leftUpBtn: leftP_up_But,
		leftDownBtn: leftP_down_But,
		rightUpBtn: rightP_up_But,
		rightDownBtn: rightP_down_But,
		topLeftBtn: topP_left_But,
		topRightBtn: topP_right_But,
		bottomLeftBtn: bottomP_left_But,
		bottomRightBtn: bottomP_right_But,
		scoreRedDisplay,
		scoreBlueDisplay
	} = elements;

	let isPaused = false;
	let isWin = false;

	let state = 0;
	let x: number, y: number;
	let paddleY_Left: number, paddleY_Right: number;
	let paddleX_Upper: number, paddleX_Lower: number;

	function handle_parameters() {
		// ... (existing logic)
		let width = window.innerWidth;
		let height = window.innerHeight;
		let size: number;

		if (width <= height)
			size = width;
		else
			size = height;

		if (size < 640) {
			P4_GAME_WIDTH = 200;
			P4_GAME_HEIGHT = 200;
			P4_WALL_WIDTH = 4;
			P4_BALL_SIZE = 12;
			P4_PADDLE_LENGTH = 64;
			P4_PADDLE_THICKNESS = 8;
			P4_PADDLE_DIST = 8;
			P4_PLAYABLE_WIDTH = P4_GAME_WIDTH - (2 * P4_WALL_WIDTH);
			P4_PLAYABLE_HEIGHT = P4_GAME_HEIGHT - (2 * P4_WALL_WIDTH);
			if (state == 2) {
				paddleY_Left = paddleY_Left * (200 / 280);
				paddleY_Right = paddleY_Right * (200 / 280);
				paddleX_Upper = paddleX_Upper * (200 / 280);
				paddleX_Lower = paddleX_Lower * (200 / 280);
				x = x * (200 / 280);
				y = y * (200 / 280);
			}
			else if (state == 0) {
				paddleY_Left = P4_PLAYABLE_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
				paddleY_Right = P4_PLAYABLE_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
				paddleX_Upper = P4_PLAYABLE_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
				paddleX_Lower = P4_PLAYABLE_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
				x = P4_PLAYABLE_WIDTH / 2 - P4_BALL_SIZE / 2;
				y = P4_PLAYABLE_HEIGHT / 2 - P4_BALL_SIZE / 2;
			}
			state = 1;
		}
		else if (size < 840) {
			P4_GAME_WIDTH = 280;
			P4_GAME_HEIGHT = 280;
			P4_WALL_WIDTH = 6;
			P4_BALL_SIZE = 16;
			P4_PADDLE_LENGTH = 80;
			P4_PADDLE_THICKNESS = 12;
			P4_PADDLE_DIST = 12;
			P4_PLAYABLE_WIDTH = P4_GAME_WIDTH - (2 * P4_WALL_WIDTH);
			P4_PLAYABLE_HEIGHT = P4_GAME_HEIGHT - (2 * P4_WALL_WIDTH);
			if (state == 1) {
				paddleY_Left = paddleY_Left * (280 / 200);
				paddleY_Right = paddleY_Right * (280 / 200);
				paddleX_Upper = paddleX_Upper * (280 / 200);
				paddleX_Lower = paddleX_Lower * (280 / 200);
				x = x * (280 / 200);
				y = y * (280 / 200);
			}
			else if (state == 3) {
				paddleY_Left = paddleY_Left * (280 / 380);
				paddleY_Right = paddleY_Right * (280 / 380);
				paddleX_Upper = paddleX_Upper * (280 / 380);
				paddleX_Lower = paddleX_Lower * (280 / 380);
				x = x * (280 / 380);
				y = y * (280 / 380);
			}
			else if (state == 0) {
				paddleY_Left = P4_PLAYABLE_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
				paddleY_Right = P4_PLAYABLE_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
				paddleX_Upper = P4_PLAYABLE_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
				paddleX_Lower = P4_PLAYABLE_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
				x = P4_PLAYABLE_WIDTH / 2 - P4_BALL_SIZE / 2;
				y = P4_PLAYABLE_HEIGHT / 2 - P4_BALL_SIZE / 2;
			}
			state = 2;
		}

		else if (size < 1024) {
			P4_GAME_WIDTH = 380;
			P4_GAME_HEIGHT = 380;
			P4_WALL_WIDTH = 8;
			P4_BALL_SIZE = 16;
			P4_PADDLE_LENGTH = 80;
			P4_PADDLE_THICKNESS = 12;
			P4_PADDLE_DIST = 16;
			P4_PLAYABLE_WIDTH = P4_GAME_WIDTH - (2 * P4_WALL_WIDTH);
			P4_PLAYABLE_HEIGHT = P4_GAME_HEIGHT - (2 * P4_WALL_WIDTH);
			if (state == 2) {
				paddleY_Left = paddleY_Left * (380 / 280);
				paddleY_Right = paddleY_Right * (380 / 280);
				paddleX_Upper = paddleX_Upper * (380 / 280);
				paddleX_Lower = paddleX_Lower * (380 / 280);
				x = x * (380 / 280);
				y = y * (280 / 280);
			}
			else if (state == 4) {
				paddleY_Left = paddleY_Left * (380 / 500);
				paddleY_Right = paddleY_Right * (380 / 500);
				paddleX_Upper = paddleX_Upper * (380 / 500);
				paddleX_Lower = paddleX_Lower * (380 / 500);
				x = x * (380 / 500);
				y = y * (380 / 500);
			}
			else if (state == 0) {
				paddleY_Left = P4_PLAYABLE_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
				paddleY_Right = P4_PLAYABLE_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
				paddleX_Upper = P4_PLAYABLE_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
				paddleX_Lower = P4_PLAYABLE_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
				x = P4_PLAYABLE_WIDTH / 2 - P4_BALL_SIZE / 2;
				y = P4_PLAYABLE_HEIGHT / 2 - P4_BALL_SIZE / 2;
			}
			state = 3;
		}
		else {
			P4_GAME_WIDTH = 500;
			P4_GAME_HEIGHT = 500;
			P4_WALL_WIDTH = 8;
			P4_BALL_SIZE = 16;
			P4_PADDLE_LENGTH = 96;
			P4_PADDLE_THICKNESS = 12;
			P4_PADDLE_DIST = 16;
			P4_PLAYABLE_WIDTH = P4_GAME_WIDTH - (2 * P4_WALL_WIDTH);
			P4_PLAYABLE_HEIGHT = P4_GAME_HEIGHT - (2 * P4_WALL_WIDTH);
			if (state == 3) {
				paddleY_Left = paddleY_Left * (500 / 380);
				paddleY_Right = paddleY_Right * (500 / 380);
				paddleX_Upper = paddleX_Upper * (500 / 380);
				paddleX_Lower = paddleX_Lower * (500 / 380);
				x = x * (500 / 380);
				y = y * (500 / 380);
			}
			else if (state == 0) {
				paddleY_Left = P4_PLAYABLE_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
				paddleY_Right = P4_PLAYABLE_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
				paddleX_Upper = P4_PLAYABLE_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
				paddleX_Lower = P4_PLAYABLE_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
				x = P4_PLAYABLE_WIDTH / 2 - P4_BALL_SIZE / 2;
				y = P4_PLAYABLE_HEIGHT / 2 - P4_BALL_SIZE / 2;
			}
			state = 4;
		}
		P4_LEFT_PADDLE_X = P4_PADDLE_DIST;
		P4_RIGHT_PADDLE_X = P4_PLAYABLE_WIDTH - P4_PADDLE_DIST - P4_PADDLE_THICKNESS;

		P4_TOP_PADDLE_Y = P4_PADDLE_DIST;
		P4_BOTTOM_PADDLE_Y = P4_PLAYABLE_HEIGHT - P4_PADDLE_DIST - P4_PADDLE_THICKNESS;
	}

	// Resize Handler
	const resizeHandler = () => {
		handle_parameters();
		window.dispatchEvent(new Event(GAME_PAUSE_EVENT));
	};

	handle_parameters();
	window.addEventListener("resize", resizeHandler);

	let dx = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED;
	let dy = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED * 0.6;

	let scoreRed = 0;
	let scoreBlue = 0;

	// Pause Handlers
	const pauseHandler = () => {
		isPaused = true;
		pause.textContent = "▶️ Resume";
	};

	const toggleHandler = () => {
		isPaused = !isPaused;
		pause.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
		if (!isPaused) moveBall();
	};

	const blurHandler = () => {
		window.dispatchEvent(new Event(GAME_PAUSE_EVENT));
	};

	window.addEventListener(GAME_PAUSE_EVENT, pauseHandler);
	window.addEventListener("blur", blurHandler);
	pause.addEventListener('click', toggleHandler);

	/* ---------------- game loop ---------------- */

	let animationId: number | null = null;

	function moveBall() {
		if (isPaused || isWin) return;

		x += dx;
		y += dy;

		// Left paddle
		if (
			x <= P4_LEFT_PADDLE_X + P4_PADDLE_THICKNESS &&
			y + P4_BALL_SIZE >= paddleY_Left &&
			y <= paddleY_Left + P4_PADDLE_LENGTH
		) {
			dx = -dx;
			x = P4_LEFT_PADDLE_X + P4_PADDLE_THICKNESS;
		}

		// Right paddle
		if (
			x + P4_BALL_SIZE >= P4_RIGHT_PADDLE_X &&
			y + P4_BALL_SIZE >= paddleY_Right &&
			y <= paddleY_Right + P4_PADDLE_LENGTH
		) {
			dx = -dx;
			x = P4_RIGHT_PADDLE_X - P4_BALL_SIZE;
		}

		// Top paddle
		if (
			y <= P4_TOP_PADDLE_Y + P4_PADDLE_THICKNESS &&
			x + P4_BALL_SIZE >= paddleX_Upper &&
			x <= paddleX_Upper + P4_PADDLE_LENGTH
		) {
			dy = -dy;
			y = P4_TOP_PADDLE_Y + P4_PADDLE_THICKNESS;
		}

		// Bottom paddle
		if (
			y + P4_BALL_SIZE >= P4_BOTTOM_PADDLE_Y &&
			x + P4_BALL_SIZE >= paddleX_Lower &&
			x <= paddleX_Lower + P4_PADDLE_LENGTH
		) {
			dy = -dy;
			y = P4_BOTTOM_PADDLE_Y - P4_BALL_SIZE;
		}

		ball.style.left = `${x}px`;
		ball.style.top = `${y}px`;

		movePaddles();
		animationId = requestAnimationFrame(moveBall);

		// Ball exits RED team side (left OR bottom) → Blue scores
		if (x < 0 || y + P4_BALL_SIZE > P4_PLAYABLE_HEIGHT) {
			scoreBlue++;
			scoreBlueDisplay.textContent = String(scoreBlue);
			checkWinner();
			resetBall();
			return;
		}

		// Ball exits BLUE team side (right OR top) → Red scores
		if (x + P4_BALL_SIZE > P4_PLAYABLE_WIDTH || y < 0) {
			scoreRed++;
			scoreRedDisplay.textContent = String(scoreRed);
			checkWinner();
			resetBall();
			return;
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


	function movePaddles() {
		const { w, s, num6, num3, v, b, left, right } = inputRef.current;

		// Vertical Limits (for Left/Right paddles)
		const vMin = P4_TOP_PADDLE_Y + P4_PADDLE_THICKNESS;
		const vMax = P4_BOTTOM_PADDLE_Y;

		// Horizontal Limits (for Top/Bottom paddles)
		const hMin = P4_LEFT_PADDLE_X + P4_PADDLE_THICKNESS;
		const hMax = P4_RIGHT_PADDLE_X;

		// Left paddle (vertical)
		if (w) paddleY_Left = clampPaddle(paddleY_Left, P4_PADDLE_SPEED, vMin, vMax, P4_PADDLE_LENGTH, false);
		if (s) paddleY_Left = clampPaddle(paddleY_Left, P4_PADDLE_SPEED, vMin, vMax, P4_PADDLE_LENGTH, true);
		left_p.style.top = `${paddleY_Left}px`;

		// Right paddle (vertical)
		if (num6) paddleY_Right = clampPaddle(paddleY_Right, P4_PADDLE_SPEED, vMin, vMax, P4_PADDLE_LENGTH, false);
		if (num3) paddleY_Right = clampPaddle(paddleY_Right, P4_PADDLE_SPEED, vMin, vMax, P4_PADDLE_LENGTH, true);
		right_p.style.top = `${paddleY_Right}px`;

		// Bottom paddle (horizontal)
		if (left) paddleX_Lower = clampPaddle(paddleX_Lower, P4_PADDLE_SPEED, hMin, hMax, P4_PADDLE_LENGTH, false);
		if (right) paddleX_Lower = clampPaddle(paddleX_Lower, P4_PADDLE_SPEED, hMin, hMax, P4_PADDLE_LENGTH, true);
		lower_p.style.left = `${paddleX_Lower}px`;

		// Top paddle (horizontal)
		if (v) paddleX_Upper = clampPaddle(paddleX_Upper, P4_PADDLE_SPEED, hMin, hMax, P4_PADDLE_LENGTH, false);
		if (b) paddleX_Upper = clampPaddle(paddleX_Upper, P4_PADDLE_SPEED, hMin, hMax, P4_PADDLE_LENGTH, true);
		upper_p.style.left = `${paddleX_Upper}px`;
	}

	let resetTimeout: number | null = null;

	function resetBall() {
		x = P4_GAME_WIDTH / 2 - P4_BALL_SIZE / 2;
		y = P4_GAME_HEIGHT / 2 - P4_BALL_SIZE / 2;
		dx = 0;
		dy = 0;

		resetTimeout = window.setTimeout(() => {
			dx = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED;
			dy = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED;
			resetTimeout = null;
		}, 1000);
	}

	function checkWinner() {
		if (scoreRed >= P4_WIN_SCORE) {
			endGame("red");
		}
		else if (scoreBlue >= P4_WIN_SCORE) {
			endGame("blue");
		}
	}

	function endGame(winner: "red" | "blue") {
		window.dispatchEvent(new Event(GAME_PAUSE_EVENT));
		isWin = true;
		isPaused = true;
		dx = 0;
		dy = 0;

		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);

		// cleanup listeners managed by cleanup function
		onWin(winner);
	}

	moveBall();

	/* ---------------- cleanup ---------------- */

	return () => {
		isWin = true;
		isPaused = true;

		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);

		window.removeEventListener("resize", resizeHandler);
		window.removeEventListener(GAME_PAUSE_EVENT, pauseHandler);
		window.removeEventListener("blur", blurHandler);
		pause.removeEventListener('click', toggleHandler);
	};
}