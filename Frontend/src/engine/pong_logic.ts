
export function pongLogic(p1: string, p2: string, onWin: (winner: string) => void)
{
    // Select the ball element
    const ball = document.getElementById('ball');
    const game = document.getElementById('game_board');
    const left_p = document.getElementById('left_p');
    const right_p = document.getElementById('right_p');
    const pause = document.getElementById("pauseBtn");

    let isPaused = false;

    // Game Board dimensions
    const gameWidth = 800;
    const gameHeight = 500;

    // the ball initial position
    let x = gameWidth / 2;
    let y = gameHeight / 2;
    // the ball speed
    let dx = (Math.random() > 0.5 ? 3 : -3);
    let dy = (Math.random() > 0.5 ? 3 : -3);

    // Width = Height = 16 px
    const ballSize = 16;

    let paddleY_Left = (gameHeight / 2);
    let paddleY_Right = (gameHeight / 2);
    const paddleSpeed = 6;

    let upPressed = false;
    let downPressed = false;
    let wPressed = false;
    let sPressed = false;

    let scoreLeft = 0;
    let scoreRight = 0;

    const winingScore = 7;

    const scoreLeftDisplay = document.getElementById('scoreLeft');
    const scoreRightDisplay = document.getElementById('scoreRight');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') 
            e.preventDefault(); // Stop page scrolling
        if (e.key === 'ArrowUp') 
            upPressed = true;
        if (e.key === 'ArrowDown') 
            downPressed = true;
        if (e.key === 'w') 
            wPressed = true;
        if (e.key === 's') 
            sPressed = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') 
            upPressed = false;
        if (e.key === 'ArrowDown') 
            downPressed = false;
        if (e.key === 'w') 
            wPressed = false;
        if (e.key === 's')
            sPressed = false;
    });

    pause.addEventListener("click", () => {
        isPaused = !isPaused; // flip the state (pause <-> resume)

        if (isPaused) {
            pause.textContent = "▶️ Resume";
        } else {
            pause.textContent = "⏸️ Pause";
            moveBall(); // resume game
        }
    });


    // Function to move the ball
    function moveBall() {
        if (isPaused) 
            return;
        x += dx;
        y += dy;

        if (
            x <= 16 + 6 && // paddle left edge + paddle width
            x >= 16 + 2 &&
            y + ballSize >= paddleY_Left - 40 && // ball bottom >= paddle top
            y <= paddleY_Left + 60 // ball top <= paddle bottom
        ) {
            dx = -dx; // reverse horizontal direction
            x = 16 + 6; // prevent the ball from "sticking" inside paddle
        }
        if (
            x + ballSize >= 778 &&       // ball reached right paddle left edge
            x + ballSize <= 782 &&     
            y + ballSize >= paddleY_Right - 40 && // ball bottom >= paddle top
            y <= paddleY_Right + 60         // ball top <= paddle bottom
        ) {
            dx = -dx;              // reverse horizontal direction
            x = 778 - ballSize;    // prevent sticking inside paddle
        }
        if (y <= 0)
        {
            dy = -dy;
            y = 0;
        }
        else if (y + ballSize >= gameHeight)
        {
            dy = -dy;
            y = gameHeight - ballSize;
        }

        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        movePaddle();

        requestAnimationFrame(moveBall);

        if (x < 0) {
            // Right player scores
            scoreRight++;
            scoreRightDisplay.textContent = scoreRight.toString();
            checkWinner();
            resetBall();
        }

        if (x + ballSize > gameWidth) {
            // Left player scores
            scoreLeft++;
            scoreLeftDisplay.textContent = scoreLeft.toString();
            checkWinner();
            resetBall();
        }
    }

    function movePaddle() 
    {
        if (wPressed && paddleY_Left - 55 > 0) 
            paddleY_Left -= paddleSpeed;
        if (sPressed && paddleY_Left + 60 < gameHeight) 
            paddleY_Left += paddleSpeed;

        left_p.style.top = paddleY_Left + 'px';

        if (upPressed && paddleY_Right - 55 > 0) 
            paddleY_Right -= paddleSpeed;
        if (downPressed && paddleY_Right + 60 < gameHeight) 
            paddleY_Right += paddleSpeed;

        right_p.style.top = paddleY_Right + 'px';
    }

    function resetBall() {
        x = gameWidth / 2;
        y = gameHeight / 2;
        dx = 0;
        dy = 0;
        if (scoreLeft === winingScore || scoreRight === winingScore)
        {
            isPaused = true;
            // delay of 5 seconds after the winning
            setTimeout(() => {
                isPaused = false;
                moveBall();
            }, 5000)
        }
        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        // Randomize direction
        // Wait 1 second, then start moving again
    setTimeout(() => {
        dx = (Math.random() > 0.5 ? 3 : -3);
        dy = (Math.random() > 0.5 ? 3 : -3);
    }, 1000);
        
    }

    function checkWinner() {
        if (scoreLeft >= winingScore) {
            showWinner("Left Player Wins! 🏆");
			onWin(p1);
			return;  // Left wins
		}
        else if (scoreRight >= winingScore) {
            showWinner("Right Player Wins! 🏆");
			onWin(p2);
			return;
		}
    }

    function showWinner(message) {
        // Stop ball movement
        dx = 0;
        dy = 0;

        // Create message
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

        // Restart after 3 seconds
        // setTimeout(() => {
        //     scoreLeft = 0;
        //     scoreRight = 0;
        //     scoreLeftDisplay.textContent = scoreLeft.toString();
        //     scoreRightDisplay.textContent = scoreRight.toString();
        //     winnerMsg.remove();
        //     resetBall();
        // }, 3000);
    }

    // Start moving
    moveBall();
}
