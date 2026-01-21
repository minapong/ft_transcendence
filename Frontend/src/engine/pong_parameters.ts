// =====================
// 2 PLAYER (P2) MODE
// =====================

let GAME_WIDTH : Number;
let GAME_HEIGHT : Number;
let WALL_WIDTH : Number;

export let BALL_SIZE : Number;

let PADDLE_HEIGHT : Number;
let PADDLE_WIDTH : Number;
let PADDLE_DIST : Number;

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
    GAME_WIDTH = 500;
    GAME_HEIGHT = 320;
    WALL_WIDTH = 6;
    BALL_SIZE = 16;
    PADDLE_HEIGHT = 80;
    PADDLE_WIDTH = 12;
    PADDLE_DIST = 12;
    }

  else {
    GAME_WIDTH = 800;
    GAME_HEIGHT = 500;
    WALL_WIDTH = 8;
    BALL_SIZE = 16;
    PADDLE_HEIGHT = 96;
    PADDLE_WIDTH = 12;
    PADDLE_DIST = 16;
    }
}

window.addEventListener("resize", () => {
  handle_parameters();
});


const PADDLE_SPEED = 6;

const PLAYABLE_WIDTH = Number(GAME_WIDTH) - (2 * Number(WALL_WIDTH));
const PLAYABLE_HEIGHT = Number(GAME_HEIGHT) - (2 * Number(WALL_WIDTH));
const LEFT_PADDLE_X = PADDLE_DIST;
const RIGHT_PADDLE_X = PLAYABLE_WIDTH - Number(PADDLE_DIST) - Number(PADDLE_WIDTH);


const GAME_SPEED = 2;

const WIN_SCORE = 3;


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