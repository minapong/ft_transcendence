import { PongAI } from './pong_ai'
import { 
	GAME_WIDTH, 
	GAME_HEIGHT, 
	BALL_SIZE, 
	PADDLE_SPEED, 
	PADDLE_HEIGHT,
	GAME_SPEED,
	WIN_SCORE,
  } from './pong_parameters';

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

    let isPaused = false;

    let x = GAME_WIDTH / 2 - BALL_SIZE / 2;
    let y = GAME_HEIGHT / 2 - BALL_SIZE / 2;
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
		if (useAI && e.isTrusted && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
			e.preventDefault();
			return;
		}

		if (e.key === 'ArrowUp') upPressed = true;
		if (e.key === 'ArrowDown') downPressed = true;
		if (e.key === 'w') wPressed = true;
		if (e.key === 's') sPressed = true;
	};

	const keyupHandler = (e: KeyboardEvent) => {
		if (useAI && e.isTrusted && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
			e.preventDefault();
			return;
		}

		if (e.key === 'ArrowUp') upPressed = false;
		if (e.key === 'ArrowDown') downPressed = false;
		if (e.key === 'w') wPressed = false;
		if (e.key === 's') sPressed = false;
	};

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

    function moveBall() {
        if (isPaused) 
            return;
        x += dx;
        y += dy;

        if (
            x <= 16 + 12 &&
            x >= 16 + 8 &&
            y + BALL_SIZE >= paddleY_Left &&
            y <= paddleY_Left + PADDLE_HEIGHT
        ) {
            dx = -dx;
            x = 16 + 12;
        }
        if (
            x + BALL_SIZE >= GAME_WIDTH - 16 - 12 - 8 - 8 &&
            x + BALL_SIZE <= GAME_WIDTH - 16 - 8 - 8 - 8 &&
            y + BALL_SIZE >= paddleY_Right &&
            y <= paddleY_Right + PADDLE_HEIGHT
        ) {
            dx = -dx;
            x = GAME_WIDTH - 16 - 12 - 8 - 8 - BALL_SIZE;
        }
        if (y <= 0)
        {
            dy = -dy;
            y = 0;
        }
        else if (y + BALL_SIZE >= GAME_HEIGHT - 8 - 8)
        {
            dy = -dy;
            y = GAME_HEIGHT - BALL_SIZE - 8 - 8;
        }

        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        movePaddle();

        requestAnimationFrame(moveBall);

        if (x < 0) {
            scoreRight++;
            scoreRightDisplay.textContent = `${p2}: ${scoreRight}`;
            checkWinner();
            resetBall();
        }

        if (x + BALL_SIZE > GAME_WIDTH) {
            scoreLeft++;
            scoreLeftDisplay.textContent = `${p1}: ${scoreLeft}`;
            checkWinner();
            resetBall();
        }
    }

    function movePaddle() 
    {
        // Left paddle - always controlled by human (W/S keys)
        if (wPressed && paddleY_Left > 0) 
            paddleY_Left -= PADDLE_SPEED;
        if (sPressed && paddleY_Left + PADDLE_HEIGHT + 8 + 8 < GAME_HEIGHT) 
            paddleY_Left += PADDLE_SPEED;

        left_p.style.top = paddleY_Left + 'px';

        // Right paddle - controlled by human Arrow keys OR AI (AI simulates Arrow keys)
        if (upPressed && paddleY_Right > 0) 
            paddleY_Right -= PADDLE_SPEED;
        if (downPressed && paddleY_Right + PADDLE_HEIGHT + 8 + 8 < GAME_HEIGHT) 
            paddleY_Right += PADDLE_SPEED;

        right_p.style.top = paddleY_Right + 'px';
    }

    function resetBall() {
        x = GAME_WIDTH / 2  - BALL_SIZE / 2;
        y = GAME_HEIGHT / 2  - BALL_SIZE / 2;
        dx = 0;
        dy = 0;
        
        if (scoreLeft !== WIN_SCORE && scoreRight !== WIN_SCORE)
        {
            ball.style.left = x + 'px';
            ball.style.top = y + 'px';

            setTimeout(() => {
                dx = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
                dy = (Math.random() > 0.5 ? 1 : -1) * GAME_SPEED;
            }, 1000);
        }
    }

    function checkWinner() {
        if (scoreLeft >= WIN_SCORE) {
            showWinner(`${p1} Wins! 🏆`);
            return;
        }
        if (scoreRight >= WIN_SCORE) {
            showWinner(`${p2} Wins! 🏆`);
            return;
        }
    }

    function showWinner(message: string) {
        gameEnded = true;
        
        if (aiPlayer) {
            aiPlayer.stop(simulateKeyPress);
        }
        
        dx = 0;
        dy = 0;

        const winnerMsg = document.createElement("div");
        winnerMsg.textContent = message;
        winnerMsg.style.position = "absolute";
        winnerMsg.style.top = "50%";
        winnerMsg.style.left = "50%";
        winnerMsg.style.transform = "translate(-50%, -50%)";
        winnerMsg.style.fontSize = "32px";
        winnerMsg.style.fontWeight = "bold";
        winnerMsg.style.color = "yellow";
        winnerMsg.style.backgroundColor = "rgba(0,0,0,0.6)";
        winnerMsg.style.padding = "20px";
        winnerMsg.style.borderRadius = "10px";
        document.body.appendChild(winnerMsg);

        setTimeout(() => {
            winnerMsg.remove();
            onWin(message.includes(p1) ? p1 : p2);
        }, 2000);
    }

    moveBall();

	return () => {
		alert("Cleanup called");
		gameEnded = true;
		if (aiPlayer) aiPlayer.stop(simulateKeyPress);
		document.removeEventListener('keydown', keydownHandler);
		document.removeEventListener('keyup', keyupHandler);
		pause.removeEventListener("click", pauseHandler);
	};
}