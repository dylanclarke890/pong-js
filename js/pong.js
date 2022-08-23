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

const againstPlayer = true;
const board = {
  player: new PONG.Paddle.Player("Dylan", "Standard", FIELD_SIDE_POS.LEFT),
  pong: againstPlayer
    ? new PONG.Paddle.Player("Krys", "Alt", FIELD_SIDE_POS.RIGHT)
    : new PONG.Paddle.Pong(FIELD_SIDE_POS.RIGHT),
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
  console.log(e.key.toLowerCase());
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
  board.player.draw();
  board.player.update();
}

function handleEnemyPaddle() {
  board.pong.draw();
  board.pong.update();
}

function handleBall() {
  board.ball.draw();
  board.ball.update();
}

function handleGameState() {
  if (state.roundWon) {
    if (state.winner === board.player) state.score.p++;
    if (state.winner === board.pong) state.score.e++;
    state.winner = null;
  }
  if (state.score.p >= board.winningScore && state.roundWon) {
    state.over = true;
    state.winner = board.player;
  } else if (state.score.e >= board.winningScore && state.roundWon) {
    state.over = true;
    state.winner = board.pong;
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
