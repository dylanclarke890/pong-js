const [canvas, ctx] = PONG.utils.new2dCanvas("play-area", 800, 500);

/********************************************************
 *                  G L O B A L S
 */
const DIRECTION = {
  UP: "U",
  DOWN: "D",
  LEFT: "L",
  RIGHT: "R",
};

const FIELD_SIDE_POS = {
  LEFT: 20,
  RIGHT: canvas.width - 40,
};

const center = {
  w: canvas.width / 2,
  h: canvas.height / 2,
};

const opponentSettings = {
  pvp: false,
  p1StartingSide: FIELD_SIDE_POS.LEFT,
};
const { pvp, p1StartingSide } = opponentSettings;
const p2StartingSide =
  p1StartingSide === FIELD_SIDE_POS.LEFT
    ? FIELD_SIDE_POS.RIGHT
    : FIELD_SIDE_POS.LEFT;

const board = {
  playerOne: new PONG.Paddle.Player("Dylan", "Standard", p1StartingSide),
  playerTwo: pvp
    ? new PONG.Paddle.Player("Krys", "Alt", p2StartingSide)
    : new PONG.Paddle.Pong(p2StartingSide),
  ball: new PONG.Ball({
    // randomly select left/right and up/down as starting directions for the ball
    x: [DIRECTION.LEFT, DIRECTION.RIGHT][PONG.utils.randUpTo(2, true)],
    y: [DIRECTION.UP, DIRECTION.DOWN][PONG.utils.randUpTo(2, true)],
  }),
  winningScore: 6,
};

const state = {
  countdown: 180,
  frame: 0,
  controls: {
    standard: {
      pressing: false,
      direction: "",
    },
    alt: {
      pressing: false,
      direction: "",
    },
  },
  roundWon: false,
  over: false,
  winner: null,
  score: {
    p: 0,
    e: 0,
  },
};

/********************************************************************
 *                          E V E N T S
 */

window.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "arrowup":
      state.controls.standard = { pressing: true, direction: DIRECTION.UP };
      break;
    case "arrowdown":
      state.controls.standard = { pressing: true, direction: DIRECTION.DOWN };
      break;
    case "w":
      state.controls.alt = { pressing: true, direction: DIRECTION.UP };
      break;
    case "s":
      state.controls.alt = { pressing: true, direction: DIRECTION.DOWN };
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key.toLowerCase()) {
    case "arrowup":
    case "arrowdown":
      state.controls.standard = { pressing: false, direction: "" };
      break;
    case "w":
    case "s":
      state.controls.alt = { pressing: false, direction: "" };
      break;
    default:
      break;
  }
});

/********************************************************************
 *                            M A I N
 */

function handlePlayerPaddle() {
  board.playerOne.draw();
  board.playerOne.update();
}

function handleEnemyPaddle() {
  board.playerTwo.draw();
  board.playerTwo.update();
}

function handleBall() {
  board.ball.draw();
  board.ball.update();
}

function handleGameState() {
  if (state.roundWon) {
    if (state.winner === board.playerOne) state.score.p++;
    if (state.winner === board.playerTwo) state.score.e++;
    state.winner = null;
  }
  if (state.score.p >= board.winningScore && state.roundWon) {
    state.over = true;
    state.winner = board.playerOne;
  } else if (state.score.e >= board.winningScore && state.roundWon) {
    state.over = true;
    state.winner = board.playerTwo;
  }

  if (state.roundWon && !state.over) {
    board.ball.x = center.w - board.ball.r / 2;
    board.ball.y = center.h - board.ball.r / 2;
    state.countdown = 180;
    state.roundWon = false;
  }

  if (state.over)
    PONG.utils.drawText(
      `${state.winner.name} Wins!`,
      "60px Arial",
      "white",
      center.w - 200,
      center.h
    );

  const { p, e } = state.score;
  PONG.utils.drawText(p, "30px Arial", "white", center.w - 50, 25);
  PONG.utils.drawText(e, "30px Arial", "white", center.w + 50, 25);
  this.frame++;
}

function handleCountDown() {
  if (state.countdown === 0) return;
  state.countdown--;
  PONG.utils.drawText(Math.ceil(state.countdown / 60), "60px Arial", "white", center.w, center.h);
}

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleEnemyPaddle();
  handlePlayerPaddle();
  handleBall();
  handleGameState();
  handleCountDown();
  if (!state.over) requestAnimationFrame(animate);
})();
