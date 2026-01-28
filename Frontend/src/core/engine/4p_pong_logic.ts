

let P4_GAME_WIDTH : number;
let P4_GAME_HEIGHT : number;
let P4_WALL_WIDTH : number;

let P4_BALL_SIZE : number;

let P4_PADDLE_LENGTH : number;
let P4_PADDLE_THICKNESS : number;
let P4_PADDLE_DIST : number;


let P4_PLAYABLE_WIDTH : number;
let P4_PLAYABLE_HEIGHT : number;
let P4_LEFT_PADDLE_X : number;
let P4_RIGHT_PADDLE_X : number;
let P4_TOP_PADDLE_Y : number;
let P4_BOTTOM_PADDLE_Y : number;

function handle_parameters()
{
    let width = window.innerWidth;

    if (width < 640) {
    P4_GAME_WIDTH = 200;
    P4_GAME_HEIGHT = 200;
    P4_WALL_WIDTH = 4;
    P4_BALL_SIZE = 12;
    P4_PADDLE_LENGTH = 64;
    P4_PADDLE_THICKNESS = 8;
    P4_PADDLE_DIST = 8;
    }
  else if (width < 1024) {
    P4_GAME_WIDTH = 280;
    P4_GAME_HEIGHT = 280;
    P4_WALL_WIDTH = 6;
    P4_BALL_SIZE = 16;
    P4_PADDLE_LENGTH = 80;
    P4_PADDLE_THICKNESS = 12;
    P4_PADDLE_DIST = 12;
    }

  else if (width < 1280){
    P4_GAME_WIDTH = 380;
    P4_GAME_HEIGHT = 380;
    P4_WALL_WIDTH = 8;
    P4_BALL_SIZE = 16;
    P4_PADDLE_LENGTH = 80;
    P4_PADDLE_THICKNESS = 12;
    P4_PADDLE_DIST = 16;
    }
	else 
	{
	P4_GAME_WIDTH = 500;
    P4_GAME_HEIGHT = 500;
    P4_WALL_WIDTH = 8;
    P4_BALL_SIZE = 16;
    P4_PADDLE_LENGTH = 96;
    P4_PADDLE_THICKNESS = 12;
    P4_PADDLE_DIST = 16;
	}
	P4_PLAYABLE_WIDTH = P4_GAME_WIDTH - ( 2 * P4_WALL_WIDTH);
	P4_PLAYABLE_HEIGHT = P4_GAME_HEIGHT - ( 2 * P4_WALL_WIDTH);
	P4_LEFT_PADDLE_X = P4_PADDLE_DIST;
	P4_RIGHT_PADDLE_X = P4_PLAYABLE_WIDTH - P4_PADDLE_DIST - P4_PADDLE_THICKNESS;
	
	P4_TOP_PADDLE_Y = P4_PADDLE_DIST;
	P4_BOTTOM_PADDLE_Y = P4_PLAYABLE_HEIGHT - P4_PADDLE_DIST - P4_PADDLE_THICKNESS;
}

window.addEventListener("resize", () => {
  handle_parameters();
});

handle_parameters();

const P4_PADDLE_SPEED = 6;

const P4_BALL_SPEED = 2;

const P4_WIN_SCORE = 3;




export function pong4PLogic(
	onWin: (winner: "red" | "blue") => void
): () => void {
	const ball = document.getElementById('ball') as HTMLElement;
	const left_p = document.getElementById('left_p') as HTMLElement;
	const right_p = document.getElementById('right_p') as HTMLElement;
	const upper_p = document.getElementById('upper_p') as HTMLElement;
	const lower_p = document.getElementById('lower_p') as HTMLElement;
	const pause = document.getElementById('pauseBtn') as HTMLButtonElement;
	const leftP_up_But = document.getElementById('left-up') as HTMLButtonElement;
	const leftP_down_But = document.getElementById('left-down') as HTMLButtonElement;
	const rightP_up_But = document.getElementById('right-up') as HTMLButtonElement;
	const rightP_down_But = document.getElementById('right-down') as HTMLButtonElement;
	const topP_left_But = document.getElementById('top-left') as HTMLButtonElement;
	const topP_right_But = document.getElementById('top-right') as HTMLButtonElement;
	const bottomP_left_But = document.getElementById('bottom-left') as HTMLButtonElement;
	const bottomP_right_But = document.getElementById('bottom-right') as HTMLButtonElement;

	let isPaused = false;
	let isWin = false;

	let x = P4_GAME_WIDTH / 2 - P4_BALL_SIZE / 2;
	let y = P4_GAME_HEIGHT / 2 - P4_BALL_SIZE / 2;

	let dx = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED;
	let dy = (Math.random() > 0.5 ? 1 : -1) * P4_BALL_SPEED * 0.75;

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

	leftP_up_But.addEventListener("pointerdown", e => {
		wPressed = true;
	});
	leftP_up_But.addEventListener("pointerup", e => {
		wPressed = false;
	});
	leftP_down_But.addEventListener("pointerdown", e => {
		sPressed = true;
	});
	leftP_down_But.addEventListener("pointerup", e => {
		sPressed = false;
	});

	rightP_up_But.addEventListener("pointerdown", e => {
		num6Pressed = true;
	});
	rightP_up_But.addEventListener("pointerup", e => {
		num6Pressed = false;
	});
	rightP_down_But.addEventListener("pointerdown", e => {
		num3Pressed = true;
	});
	rightP_down_But.addEventListener("pointerup", e => {
		num3Pressed = false;
	});

	topP_left_But.addEventListener("pointerdown", e => {
		vPressed = true;
	});
	topP_left_But.addEventListener("pointerup", e => {
		vPressed = false;
	});
	topP_right_But.addEventListener("pointerdown", e => {
		bPressed = true;
	});
	topP_right_But.addEventListener("pointerup", e => {
		bPressed = false;
	});

	bottomP_left_But.addEventListener("pointerdown", e => {
		leftPressed = true;
	});
	bottomP_left_But.addEventListener("pointerup", e => {
		leftPressed = false;
	});
	bottomP_right_But.addEventListener("pointerdown", e => {
		rightPressed = true;
	});
	bottomP_right_But.addEventListener("pointerup", e => {
		rightPressed = false;
	});


	const pauseHandler = () => {
		isPaused = !isPaused;
		pause.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
		if (!isPaused) moveBall();
	};

	document.addEventListener('keydown', keydownHandler);
	document.addEventListener('keyup', keyupHandler);
	pause.addEventListener('click', pauseHandler);

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
		isWin = true;
		isPaused = true;
		dx = 0;
		dy = 0;
	
		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);
	
		document.removeEventListener('keydown', keydownHandler);
		document.removeEventListener('keyup', keyupHandler);
		pause.removeEventListener('click', pauseHandler);
	
		onWin(winner);
	}

	moveBall();

	/* ---------------- cleanup ---------------- */

	return () => {
		isWin = true;
		isPaused = true;
	
		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);
	
		document.removeEventListener('keydown', keydownHandler);
		document.removeEventListener('keyup', keyupHandler);
		pause.removeEventListener('click', pauseHandler);
	};
}