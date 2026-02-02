
interface GameState {
    ballX: number;
    ballY: number;
    ballDx: number;
    ballDy: number;
    aiPaddleY: number;
    timestamp: number;
    // Dynamic game dimensions
    gameHeight: number;
    paddleX: number;
    paddleHeight: number;
    ballSize: number;
}

export class PongAI {
    private difficulty: 'easy' | 'medium' | 'hard';
    private currentAction: 'up' | 'down' | 'none' = 'none';

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
            return this.moveTowardsTarget(state.aiPaddleY, state.gameHeight / 2, state.paddleHeight);
        }

        const targetY = this.applyDifficultyError(prediction.interceptY);
        return this.moveTowardsTarget(state.aiPaddleY, targetY, state.paddleHeight);
    }

    private predictBallIntercept(state: GameState): { interceptY: number } | null {
        const { ballX, ballY, ballDx, ballDy, ballSize, gameHeight, paddleX } = state;

        if (ballDx <= 0) {
            const target = gameHeight / 2;
            return { interceptY: target };
        }

        const distanceX = paddleX - ballX;
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

            const bottomBound = gameHeight - ballSize - 16;
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
            interceptY: simY + ballSize / 2
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

    private moveTowardsTarget(currentY: number, targetY: number, paddleHeight: number): 'up' | 'down' | 'none' {
        const paddleCenter = currentY + paddleHeight / 2;

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