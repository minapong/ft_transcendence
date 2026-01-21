import { PongAI } from './pong_ai'


let GAME_WIDTH : Number;
let GAME_HEIGHT : Number;
let WALL_WIDTH : Number;

let BALL_SIZE : Number;

let PADDLE_HEIGHT : Number;
let PADDLE_WIDTH : Number;
let PADDLE_DIST : Number;


let PLAYABLE_WIDTH : Number;
let PLAYABLE_HEIGHT : Number;
let LEFT_PADDLE_X : Number;
let RIGHT_PADDLE_X : Number;

function handle_parameters()
{
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

  else if (width < 1280){
    GAME_WIDTH = 600;
    GAME_HEIGHT = 380;
    WALL_WIDTH = 8;
    BALL_SIZE = 16;
    PADDLE_HEIGHT = 80;
    PADDLE_WIDTH = 12;
    PADDLE_DIST = 16;
    }
	else 
	{
	GAME_WIDTH = 800;
    GAME_HEIGHT = 500;
    WALL_WIDTH = 8;
    BALL_SIZE = 16;
    PADDLE_HEIGHT = 96;
    PADDLE_WIDTH = 12;
    PADDLE_DIST = 16;
	}
	PLAYABLE_WIDTH = Number(GAME_WIDTH) - (2 * Number(WALL_WIDTH));
	PLAYABLE_HEIGHT = Number(GAME_HEIGHT) - (2 * Number(WALL_WIDTH));
	LEFT_PADDLE_X = PADDLE_DIST;
	RIGHT_PADDLE_X = Number(PLAYABLE_WIDTH) - Number(PADDLE_DIST) - Number(PADDLE_WIDTH);
}

window.addEventListener("resize", () => {
  handle_parameters();
});

handle_parameters();

const PADDLE_SPEED = 6;

const GAME_SPEED = 2;

const WIN_SCORE = 3;


export function pongLogic(
    p1: string, 
    p2: string, 
    onWin: (winner: string) => void,
    useAI: boolean = false,
    aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium'
)
{
    const ball = document.getElementById('ball');
    const left_p = document.getElementById('left_p');
    const right_p = document.getElementById('right_p');
    const pause = document.getElementById("pauseBtn");
	const left_up_But = document.getElementById("left-up");
	const left_down_But = document.getElementById("left-down");
	const right_up_But = document.getElementById("right-up");
	const right_down_But = document.getElementById("right-down");

    let isPaused = false;



	// Initial ball position (centered in playable area)
	let x = Number(PLAYABLE_WIDTH) / 2 - Number(BALL_SIZE) / 2;
	let y = Number(PLAYABLE_HEIGHT) / 2 - Number(BALL_SIZE) / 2;

    let dx = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
    let dy = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;

    let paddleY_Left = (Number(GAME_HEIGHT) / 2) - (Number(PADDLE_HEIGHT) / 2);
    let paddleY_Right = (Number(GAME_HEIGHT) / 2) - (Number(PADDLE_HEIGHT) / 2);

    let upPressed = false;
    let downPressed = false;
    let wPressed = false;
    let sPressed = false;

    let scoreLeft = 0;
    let scoreRight = 0;

    const scoreLeftDisplay = document.getElementById('scoreLeft');
    const scoreRightDisplay = document.getElementById('scoreRight');

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

    // Initialize AI if needed
    if (useAI) {
        aiPlayer = new PongAI(aiDifficulty);
        aiPlayer.start(getGameState, simulateKeyPress);
    }

	// Define handlers
	const keydownHandler = (e: KeyboardEvent) => {
		if ((e.key === "ArrowUp" || e.key === "ArrowDown")) {
			e.preventDefault();
			if (useAI && e.isTrusted)
				return;
		}

		if (e.key === 'ArrowUp') upPressed = true;
		if (e.key === 'ArrowDown') downPressed = true;
		if (e.key === 'w') wPressed = true;
		if (e.key === 's') sPressed = true;
	};

	const keyupHandler = (e: KeyboardEvent) => {
		if ((e.key === "ArrowUp" || e.key === "ArrowDown")) {
			e.preventDefault();
			if (useAI && e.isTrusted)
				return;
		}

		if (e.key === 'ArrowUp') upPressed = false;
		if (e.key === 'ArrowDown') downPressed = false;
		if (e.key === 'w') wPressed = false;
		if (e.key === 's') sPressed = false;
	};

	left_up_But.addEventListener("pointerdown", e => {
		wPressed = true;
	});
	left_up_But.addEventListener("pointerup", e => {
		wPressed = false;
	});
	left_down_But.addEventListener("pointerdown", e => {
		sPressed = true;
	});
	left_down_But.addEventListener("pointerup", e => {
		sPressed = false;
	});
	right_up_But.addEventListener("pointerdown", e => {
		upPressed = true;
	});
	right_up_But.addEventListener("pointerup", e => {
		upPressed = false;
	});
	right_down_But.addEventListener("pointerdown", e => {
		downPressed = true;
	});
	right_down_But.addEventListener("pointerup", e => {
		downPressed = false;
	});

	const pauseHandler = () => {
		isPaused = !isPaused;
	
		if (isPaused) {
			pause.textContent = "▶️ Resume";
			if (aiPlayer) {
				aiPlayer.stop(simulateKeyPress);
			}
		} else {
			pause.textContent = "⏸️ Pause";
			if (aiPlayer) {
				aiPlayer.start(getGameState, simulateKeyPress);
			}
			moveBall();
		}
	};
	// Attach
	document.addEventListener('keydown', keydownHandler);
	document.addEventListener('keyup', keyupHandler);
	pause.addEventListener("click", pauseHandler);

	let animationId: number | null = null;

    function moveBall() {
		if (isPaused || gameEnded) return;
        x += dx;
        y += dy;

		/// Left Paddle
        if (
            x <= Number(LEFT_PADDLE_X) + Number(PADDLE_WIDTH) &&
            x >= Number(LEFT_PADDLE_X) + Number(PADDLE_WIDTH) - 8 &&
            y + Number(BALL_SIZE) >= paddleY_Left && // Ball's bottom edge >= Paddle's top edge
            y <= paddleY_Left + Number(PADDLE_HEIGHT) // Ball's top edge <= Paddle's bottom edge
        ) {
            dx = -dx;
            x = Number(LEFT_PADDLE_X) + Number(PADDLE_WIDTH);
        }

		/// Right Paddle
        if (
            x + Number(BALL_SIZE) >= Number(RIGHT_PADDLE_X) &&
            x + Number(BALL_SIZE) <= Number(RIGHT_PADDLE_X) + 8 &&
            y + Number(BALL_SIZE) >= paddleY_Right && // Ball's bottom edge >= Paddle's top edge
            y <= paddleY_Right + Number(PADDLE_HEIGHT) // Ball's top edge <= Paddle's bottom edge
        ) {
            dx = -dx;
            x = Number(RIGHT_PADDLE_X) - Number(BALL_SIZE);
        }

		/// Top Wall
        if (y <= 0)
        {
            dy = -dy;
            y = 0;
        }

		/// Bottom Wall
		else if (y + Number(BALL_SIZE) >= Number(PLAYABLE_HEIGHT)) {
			dy = -dy;
			y = Number(PLAYABLE_HEIGHT) - Number(BALL_SIZE);
		}

        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        movePaddle();

		animationId = requestAnimationFrame(moveBall);

        if (x < 0) {
            scoreRight++;
            scoreRightDisplay.textContent = `${p2}: ${scoreRight}`;
            checkWinner();
            resetBall();
        }

        if (x + Number(BALL_SIZE) > Number(PLAYABLE_WIDTH)) {
            scoreLeft++;
            scoreLeftDisplay.textContent = `${p1}: ${scoreLeft}`;
            checkWinner();
            resetBall();
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
		// Left paddle (W / S)
		if (wPressed)
			paddleY_Left = clampPaddle(paddleY_Left, PADDLE_SPEED, 0, Number(PLAYABLE_HEIGHT), Number(PADDLE_HEIGHT), false);
		if (sPressed)
			paddleY_Left = clampPaddle(paddleY_Left, PADDLE_SPEED, 0, Number(PLAYABLE_HEIGHT), Number(PADDLE_HEIGHT), true);
		left_p.style.top = `${paddleY_Left}px`;

		// Right paddle (Arrow Up / Down or AI)
		if (upPressed)
			paddleY_Right = clampPaddle(paddleY_Right, PADDLE_SPEED, 0, Number(PLAYABLE_HEIGHT), Number(PADDLE_HEIGHT), false);
		if (downPressed)
			paddleY_Right = clampPaddle(paddleY_Right, PADDLE_SPEED, 0, Number(PLAYABLE_HEIGHT), Number(PADDLE_HEIGHT), true);

		right_p.style.top = `${paddleY_Right}px`;
	}

	let resetTimeout: number | null = null;

	function resetBall() {
		x = Number(PLAYABLE_WIDTH) / 2 - Number(BALL_SIZE) / 2;
		y = Number(PLAYABLE_HEIGHT) / 2 - Number(BALL_SIZE) / 2;
		dx = 0;
		dy = 0;
	
		ball.style.left = x + 'px';
		ball.style.top = y + 'px';
	
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
			showWinner(p1);
		}
		else if (scoreRight >= WIN_SCORE) {
			showWinner(p2);
		}
	}

	function showWinner(winner: string) {
		gameEnded = true;
		isPaused = true;
		dx = 0;
		dy = 0;
	
		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);
	
		if (aiPlayer) aiPlayer.stop(simulateKeyPress);
	
		onWin(winner);
	}

    moveBall();

	return () => {
		gameEnded = true;
		isPaused = true;
	
		if (animationId !== null) cancelAnimationFrame(animationId);
		if (resetTimeout !== null) clearTimeout(resetTimeout);
	
		if (aiPlayer) aiPlayer.stop(simulateKeyPress);
	
		document.removeEventListener('keydown', keydownHandler);
		document.removeEventListener('keyup', keyupHandler);
		pause.removeEventListener('click', pauseHandler);
	};
}