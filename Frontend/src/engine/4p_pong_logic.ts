import {
	P4_GAME_WIDTH,
	P4_GAME_HEIGHT,
	P4_BALL_SIZE,
	P4_PADDLE_LENGTH,
	P4_PADDLE_THICKNESS,
	P4_PADDLE_SPEED,
	P4_LEFT_PADDLE_X,
	P4_RIGHT_PADDLE_X,
	P4_TOP_PADDLE_Y,
	P4_BOTTOM_PADDLE_Y,
	P4_BALL_SPEED,
	P4_WIN_SCORE,
	P4_PLAYABLE_HEIGHT,
	P4_PLAYABLE_WIDTH
} from './pong_parameters';

export function pong4PLogic(
	onWin: (winner: "red" | "blue") => void
): () => void {
	const ball = document.getElementById('ball') as HTMLElement;
	const left_p = document.getElementById('left_p') as HTMLElement;
	const right_p = document.getElementById('right_p') as HTMLElement;
	const upper_p = document.getElementById('upper_p') as HTMLElement;
	const lower_p = document.getElementById('lower_p') as HTMLElement;
	const pause = document.getElementById('pauseBtn') as HTMLButtonElement;

	let isPaused = false;
	let isWin = false;

	let x = P4_GAME_WIDTH / 2 - P4_BALL_SIZE / 2;
	let y = P4_GAME_HEIGHT / 2 - P4_BALL_SIZE / 2;

	let dx = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED;
	let dy = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED;

	let paddleY_Left = P4_GAME_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
	let paddleY_Right = P4_GAME_HEIGHT / 2 - P4_PADDLE_LENGTH / 2;
	let paddleX_Upper = P4_GAME_WIDTH / 2 - P4_PADDLE_LENGTH / 2;
	let paddleX_Lower = P4_GAME_WIDTH / 2 - P4_PADDLE_LENGTH / 2;

	let scoreRed = 0;
	let scoreBlue = 0;

	const scoreRedDisplay = document.getElementById('scoreRed') as HTMLElement;
	const scoreBlueDisplay = document.getElementById('scoreBlue') as HTMLElement;

	let wPressed = false, sPressed = false;
	let num6Pressed = false, num3Pressed = false;
	let leftPressed = false, rightPressed = false;
	let vPressed = false, bPressed = false;

	/* ---------------- event handlers ---------------- */

	const keydownHandler = (e: KeyboardEvent) => {
		if (e.key === 'w') wPressed = true;
		if (e.key === 's') sPressed = true;
		if (e.key === '6') num6Pressed = true;
		if (e.key === '3') num3Pressed = true;
		if (e.key === 'ArrowLeft') leftPressed = true;
		if (e.key === 'ArrowRight') rightPressed = true;
		if (e.key === 'v') vPressed = true;
		if (e.key === 'b') bPressed = true;
	};

	const keyupHandler = (e: KeyboardEvent) => {
		if (e.key === 'w') wPressed = false;
		if (e.key === 's') sPressed = false;
		if (e.key === '6') num6Pressed = false;
		if (e.key === '3') num3Pressed = false;
		if (e.key === 'ArrowLeft') leftPressed = false;
		if (e.key === 'ArrowRight') rightPressed = false;
		if (e.key === 'v') vPressed = false;
		if (e.key === 'b') bPressed = false;
	};

	const pauseHandler = () => {
		isPaused = !isPaused;
		pause.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
		if (!isPaused) moveBall();
	};

	document.addEventListener('keydown', keydownHandler);
	document.addEventListener('keyup', keyupHandler);
	pause.addEventListener('click', pauseHandler);

	/* ---------------- game loop ---------------- */

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
		requestAnimationFrame(moveBall);

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
		// Left paddle (vertical)
		if (wPressed) paddleY_Left = clampPaddle(paddleY_Left, P4_PADDLE_SPEED, 0, P4_PLAYABLE_HEIGHT, P4_PADDLE_LENGTH, false);
		if (sPressed) paddleY_Left = clampPaddle(paddleY_Left, P4_PADDLE_SPEED, 0, P4_PLAYABLE_HEIGHT, P4_PADDLE_LENGTH, true);
		left_p.style.top = `${paddleY_Left}px`;
	
		// Right paddle (vertical)
		if (num6Pressed) paddleY_Right = clampPaddle(paddleY_Right, P4_PADDLE_SPEED, 0, P4_PLAYABLE_HEIGHT, P4_PADDLE_LENGTH, false);
		if (num3Pressed) paddleY_Right = clampPaddle(paddleY_Right, P4_PADDLE_SPEED, 0, P4_PLAYABLE_HEIGHT, P4_PADDLE_LENGTH, true);
		right_p.style.top = `${paddleY_Right}px`;
	
		// Bottom paddle (horizontal)
		if (leftPressed) paddleX_Lower = clampPaddle(paddleX_Lower, P4_PADDLE_SPEED, 0, P4_PLAYABLE_WIDTH, P4_PADDLE_LENGTH, false);
		if (rightPressed) paddleX_Lower = clampPaddle(paddleX_Lower, P4_PADDLE_SPEED, 0, P4_PLAYABLE_WIDTH, P4_PADDLE_LENGTH, true);
		lower_p.style.left = `${paddleX_Lower}px`;
	
		// Top paddle (horizontal)
		if (vPressed) paddleX_Upper = clampPaddle(paddleX_Upper, P4_PADDLE_SPEED, 0, P4_PLAYABLE_WIDTH, P4_PADDLE_LENGTH, false);
		if (bPressed) paddleX_Upper = clampPaddle(paddleX_Upper, P4_PADDLE_SPEED, 0, P4_PLAYABLE_WIDTH, P4_PADDLE_LENGTH, true);
		upper_p.style.left = `${paddleX_Upper}px`;
	}

	function resetBall() {
		x = P4_GAME_WIDTH / 2 - P4_BALL_SIZE / 2;
		y = P4_GAME_HEIGHT / 2 - P4_BALL_SIZE / 2;
		dx = 0;
		dy = 0;

		setTimeout(() => {
			dx = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED;
			dy = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED;
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
		isWin = true;
		dx = 0;
		dy = 0;

		onWin(winner);
	}

	moveBall();

	/* ---------------- cleanup ---------------- */

	return () => {
		isWin = true;
		isPaused = true;

		document.removeEventListener('keydown', keydownHandler);
		document.removeEventListener('keyup', keyupHandler);
		pause.removeEventListener('click', pauseHandler);
	};
}