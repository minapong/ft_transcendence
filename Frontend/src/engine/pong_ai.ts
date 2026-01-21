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



interface GameState {
    ballX: number;
    ballY: number;
    ballDx: number;
    ballDy: number;
    aiPaddleY: number;
    timestamp: number;
}

export class PongAI {
    private difficulty: 'easy' | 'medium' | 'hard';
    private currentAction: 'up' | 'down' | 'none' = 'none';
    
    // Game constants
    private readonly GAME_WIDTH = PLAYABLE_WIDTH;
    private readonly GAME_HEIGHT = PLAYABLE_HEIGHT;
    private readonly PADDLE_HEIGHT = PADDLE_HEIGHT;
    private readonly BALL_SIZE = BALL_SIZE;
    private readonly PADDLE_X = RIGHT_PADDLE_X; // Right paddle X position
    
    // Observation interval (1 second = 1000ms)
    private readonly OBSERVATION_INTERVAL = 1000;
	private readonly PRESS_DURATION = 300 //ms

    private observationTimer: number | null = null;

    constructor(difficulty: 'easy' | 'medium' | 'hard') {
        this.difficulty = difficulty;
    }

    start(getGameState: () => GameState, simulateKeyPress: (key: string, action: 'down' | 'up') => void) {
        this.observe(getGameState, simulateKeyPress);
        
        this.observationTimer = window.setInterval(() => {
            this.observe(getGameState, simulateKeyPress);
        }, this.OBSERVATION_INTERVAL);
    }

    stop(simulateKeyPress: (key: string, action: 'down' | 'up') => void) {
        if (this.observationTimer) {
            clearInterval(this.observationTimer);
            this.observationTimer = null;
        }
        this.releaseKeys(simulateKeyPress);
    }

    private observe(
        getGameState: () => GameState, 
        simulateKeyPress: (key: string, action: 'down' | 'up') => void
    ) {
        const state = getGameState();
        const decision = this.makeDecision(state);
        this.executeDecision(decision, simulateKeyPress);
    }

    private makeDecision(state: GameState): 'up' | 'down' | 'none' {
        const prediction = this.predictBallIntercept(state);
        
        if (!prediction) {
            return this.moveTowardsTarget(state.aiPaddleY, this.GAME_HEIGHT / 2);
        }

        const targetY = this.applyDifficultyError(prediction.interceptY);
        return this.moveTowardsTarget(state.aiPaddleY, targetY);
    }

    private predictBallIntercept(state: GameState): { interceptY: number } | null {
        const { ballX, ballY, ballDx, ballDy, aiPaddleY } = state;
        
		if (ballDx <= 0) {
			const target = this.GAME_HEIGHT / 2;
			return {interceptY: target};
		}

		const distanceX = this.PADDLE_X - ballX;
		const framesUntilReach = distanceX / Math.abs(ballDx);

		let simY = ballY;
		let simDy = ballDy;
		let remainingFrames = framesUntilReach;

		let bounceCount = 0;
		const MAX_BOUNCES = 10;

        while (remainingFrames > 0 && bounceCount < MAX_BOUNCES) {
			const projectedY = simY + (simDy * remainingFrames);

            if (projectedY < 0) { //bottom bounce
				const framesToBounce = Math.abs(simY / simDy);
				remainingFrames -= framesToBounce;
				simY = 0;
				simDy = Math.abs(simDy);
				bounceCount++;
				continue;
            }

            const bottomBound = this.GAME_HEIGHT - this.BALL_SIZE - 16;
            if (projectedY > bottomBound) { //top bounce
				const framesToBounce = (bottomBound - simY) / simDy;
				remainingFrames -= framesToBounce;
				simY = bottomBound;
				simDy = -Math.abs(simDy);
				bounceCount++;
				continue;
            }

            simY = projectedY;
            break;
        }

        return {
            interceptY: simY + this.BALL_SIZE / 2
        };
    }

    private applyDifficultyError(predictedY: number): number {
        let errorMargin = 0;
        
		switch (this.difficulty) {
		    case 'easy':
		        errorMargin = 80;
                break;
		    case 'medium':
		        errorMargin = 30;
                break;
            case 'hard':
                errorMargin = 10;
                break;
        }

        const error = (Math.random() - 0.5) * 2 * errorMargin;
        return predictedY + error;
    }

    private moveTowardsTarget(currentY: number, targetY: number): 'up' | 'down' | 'none' {
        const paddleCenter = currentY + this.PADDLE_HEIGHT / 2;
        
        let threshold = 40;

        if (paddleCenter < targetY - threshold) {
            return 'down';
        } else if (paddleCenter > targetY + threshold) {
            return 'up';
        }
        
        return 'none';
    }

	private executeDecision(
		decision: 'up' | 'down' | 'none',
		simulateKeyPress: (key: string, action: 'down' | 'up') => void
	) {
		// Always release previous key
		if (this.currentAction === 'up') {
			simulateKeyPress('ArrowUp', 'up');
		} else if (this.currentAction === 'down') {
			simulateKeyPress('ArrowDown', 'up');
		}
	
		if (decision === 'up') {
			simulateKeyPress('ArrowUp', 'down');
			this.currentAction = 'up';
	
			setTimeout(() => {
				simulateKeyPress('ArrowUp', 'up');
				if (this.currentAction === 'up') this.currentAction = 'none';
			}, this.PRESS_DURATION);
			
		} else if (decision === 'down') {
			simulateKeyPress('ArrowDown', 'down');
			this.currentAction = 'down';
	
			setTimeout(() => {
				simulateKeyPress('ArrowDown', 'up');
				if (this.currentAction === 'down') this.currentAction = 'none';
			}, this.PRESS_DURATION);
	
		} else {
			// Decision "none": release both keys immediately
			simulateKeyPress('ArrowUp', 'up');
			simulateKeyPress('ArrowDown', 'up');
			this.currentAction = 'none';
		}
	}

    private releaseKeys(simulateKeyPress: (key: string, action: 'down' | 'up') => void) {
		simulateKeyPress('ArrowUp', 'up');
		simulateKeyPress('ArrowDown', 'up');
		this.currentAction = 'none';
    }
}