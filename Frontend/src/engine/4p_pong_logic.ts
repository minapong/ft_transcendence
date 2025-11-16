
export function pongLogic()
{
    // Select the ball element
    const ball = document.getElementById('ball');
    const left_p = document.getElementById('left_p');
    const right_p = document.getElementById('right_p');
    const upper_p = document.getElementById('upper_p');
    const lower_p = document.getElementById('lower_p');
    const pause = document.getElementById("pauseBtn");

    let isPaused = false;
    let isWin = false;

    // Game Board dimensions
    const gameWidth = 500;
    const gameHeight = 500;


    // Width = Height = 16 px
    const ballSize = 16;

    // the ball initial position
    let x = gameWidth / 2 - ballSize / 2;
    let y = gameHeight / 2 - ballSize / 2;
    // the ball speed
    let dx = (Math.random() > 0.5 ? 1.5 : -1.5);
    let dy = (Math.random() > 0.5 ? 2 : -2);


    let paddleY_Left = (gameHeight / 2) - 48;
    let paddleY_Right = (gameHeight / 2) - 48;
    let paddleX_Upper = (gameWidth / 2) - 48;
    let paddleX_Lower = (gameWidth / 2) - 48;
    const paddleSpeed = 6;

    let leftPressed = false;
    let rightPressed = false;
    let wPressed = false;
    let sPressed = false;
    let num3Pressed = false;
    let num6Pressed = false;
    let vPressed = false;
    let bPressed = false;

    let scoreRed = 0;
    let scoreBlue = 0;

    const winingScore = 7;

    const scoreRedDisplay = document.getElementById('scoreRed');
    const scoreBlueDisplay = document.getElementById('scoreBlue');
    // const scoreBottomDisplay = document.getElementById('scoreBottom');
    // const scoreTopDisplay = document.getElementById('scoreTop');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') 
            e.preventDefault(); // Stop page scrolling
        if (e.key === 'ArrowLeft') 
            leftPressed = true;
        if (e.key === 'ArrowRight') 
            rightPressed = true;
        if (e.key === 'w') 
            wPressed = true;
        if (e.key === 's') 
            sPressed = true;
        if (e.key === '6') 
            num6Pressed = true;
        if (e.key === '3') 
            num3Pressed = true;
        if (e.key === 'v') 
            vPressed = true;
        if (e.key === 'b') 
            bPressed = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') 
            leftPressed = false;
        if (e.key === 'ArrowRight') 
            rightPressed = false;
        if (e.key === 'w') 
            wPressed = false;
        if (e.key === 's')
            sPressed = false;
        if (e.key === '6') 
            num6Pressed = false;
        if (e.key === '3')
            num3Pressed = false;
        if (e.key === 'v') 
            vPressed = false;
        if (e.key === 'b')
            bPressed = false;
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
        if (isPaused || isWin) 
            return;
        x += dx;
        y += dy;

        // Left Paddle
        if (
            x <= 16 + 12 && // paddle left edge + paddle width
            x >= 16 + 8 &&
            y + ballSize >= paddleY_Left && // ball bottom >= paddle top
            y <= paddleY_Left + 96 // ball top <= paddle bottom
        ) {
            dx = -dx; // reverse horizontal direction
            x = 16 + 12; // prevent the ball from "sticking" inside paddle
        }
        // Right Paddle
        if (
            x + ballSize >= gameWidth - 16 - 12 - 8 - 8 &&  // ball reached right paddle left edge
            x + ballSize <= gameWidth - 16 - 8 - 8 - 8 &&     
            y + ballSize >= paddleY_Right && // ball bottom >= paddle top
            y <= paddleY_Right + 96         // ball top <= paddle bottom
        ) {
            dx = -dx;              // reverse horizontal direction
            x = gameWidth - 16 - 12 - 8 - 8 - ballSize;    // prevent sticking inside paddle
        }
        // Top Paddle
        if (
            x + ballSize >= paddleX_Upper && 
            x <= paddleX_Upper + 96 &&    
            y <= 16 + 12 && 
            y >= 16 + 8
        ) {
            dy = -dy;
            y = 16 + 12;
        }
        // Bottom Paddle
        if (
            x + ballSize >= paddleX_Lower && 
            x <= paddleX_Lower + 96 &&    
            y + ballSize >= gameHeight - 16 - 12 - 8 - 8 && 
            y + ballSize <= gameHeight - 16 - 8 - 8 - 8
        ) {
            dy = -dy;
            y = gameHeight - 16 - 12 - 8 - 8 - ballSize;
        }

        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        movePaddle();

        requestAnimationFrame(moveBall);

        if (x < 0 || y + ballSize > gameHeight) {
            // Blue team scores
            scoreBlue++;
            scoreBlueDisplay.textContent = `Blue team: ${scoreBlue}`;
            checkWinner();
            resetBall();
        }

        if (x + ballSize > gameWidth || y < 0) {
            scoreRed++;
            scoreRedDisplay.textContent = `Red team: ${scoreRed}`;
            checkWinner();
            resetBall();
        }
    }

    function movePaddle() 
    {
        if (wPressed && paddleY_Left > 0) 
            paddleY_Left -= paddleSpeed;
        if (sPressed && paddleY_Left + 96 + 8 + 8 < gameHeight) 
            paddleY_Left += paddleSpeed;

        left_p.style.top = paddleY_Left + 'px';

        if (num6Pressed && paddleY_Right > 0) 
            paddleY_Right -= paddleSpeed;
        if (num3Pressed && paddleY_Right + 96 + 8 + 8 < gameHeight) 
            paddleY_Right += paddleSpeed;

        right_p.style.top = paddleY_Right + 'px';

        if (leftPressed && paddleX_Lower > 0) 
            paddleX_Lower -= paddleSpeed;
        if (rightPressed && paddleX_Lower + 96 + 8 + 8 < gameWidth) 
            paddleX_Lower += paddleSpeed;

        lower_p.style.left = paddleX_Lower + 'px';

        if (vPressed && paddleX_Upper > 0) 
            paddleX_Upper -= paddleSpeed;
        if (bPressed && paddleX_Upper + 96 + 8 + 8 < gameWidth) 
            paddleX_Upper += paddleSpeed;

        upper_p.style.left = paddleX_Upper + 'px';
    }

    function resetBall() {
        x = gameWidth / 2 - ballSize / 2;
        y = gameHeight / 2 - ballSize / 2;
        dx = 0;
        dy = 0;
        if (scoreRed === winingScore || scoreBlue === winingScore)
        {
            isWin = true;
            // delay of 5 seconds after the winning
            setTimeout(() => {
                isWin = false;
                moveBall();
            }, 5000)
        }
        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        // Randomize direction
        // Wait 1 second, then start moving again
        setTimeout(() => {
            dx = (Math.random() > 0.5 ? 1.5 : -1.5);
            dy = (Math.random() > 0.5 ? 2 : -2);
        }, 1000);
        
    }

    function checkWinner() {
        if (scoreRed >= winingScore)
            showWinner("Red team Wins! 🏆"); 
        else if (scoreBlue >= winingScore)
            showWinner("Blue team Wins! 🏆");
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
        setTimeout(() => {
            scoreRed = 0;
            scoreBlue = 0;
            scoreRedDisplay.textContent = `Red team: ${scoreRed}`;
            scoreBlueDisplay.textContent = `Blue team: ${scoreBlue}`;
            winnerMsg.remove();
            resetBall();
        }, 3000);
    }

    // Start moving
    moveBall();
}
