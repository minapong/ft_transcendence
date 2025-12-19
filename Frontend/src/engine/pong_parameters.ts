// =====================
// 2 PLAYER (P2) MODE
// =====================

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 500;
export const WALL_WIDTH = 8;

export const BALL_SIZE = 16;

export const PADDLE_HEIGHT = 96;
export const PADDLE_SPEED = 6;
export const PADDLE_WIDTH = 12;
export const PLAYABLE_WIDTH = GAME_WIDTH - (2 * WALL_WIDTH);
export const PLAYABLE_HEIGHT = GAME_HEIGHT - (2 * WALL_WIDTH);
export const LEFT_PADDLE_X = 16;
export const RIGHT_PADDLE_X = PLAYABLE_WIDTH - 16 - PADDLE_WIDTH;


export const GAME_SPEED = 3;

export const WIN_SCORE = 1;

// =====================
// 4 PLAYER (P4) MODE
// =====================

export const P4_GAME_WIDTH = 500;
export const P4_GAME_HEIGHT = 500;

export const P4_WALL_WIDTH = 8;

export const P4_PLAYABLE_WIDTH = P4_GAME_WIDTH - ( 2 * P4_WALL_WIDTH);
export const P4_PLAYABLE_HEIGHT = P4_GAME_HEIGHT - ( 2 * P4_WALL_WIDTH);

export const P4_BALL_SIZE = 16;

export const P4_PADDLE_LENGTH = 96;
export const P4_PADDLE_THICKNESS = 12;
export const P4_PADDLE_SPEED = 6;

// Paddle fixed positions
export const P4_LEFT_PADDLE_X = 16;
export const P4_RIGHT_PADDLE_X = P4_PLAYABLE_WIDTH - 16 - P4_PADDLE_THICKNESS;

export const P4_TOP_PADDLE_Y = 16;
export const P4_BOTTOM_PADDLE_Y = P4_PLAYABLE_HEIGHT - 16 - P4_PADDLE_THICKNESS;

// Ball speed
export const P4_BALL_SPEED = 1;

export const P4_WIN_SCORE = 3;