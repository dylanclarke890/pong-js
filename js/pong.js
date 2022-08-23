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

const center = {
  w: canvas.width / 2,
  h: canvas.height / 2
}

const board = {
  player: new PONG.Paddle.Player(),
  pong: new PONG.Paddle.Pong(),
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
  key: {
    pressing: false,
    direction: "",
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
  switch (e.key) {
    case "ArrowUp":
      state.key = { pressing: true, direction: DIRECTION.UP };
      break;
    case "ArrowDown":
      state.key = { pressing: true, direction: DIRECTION.DOWN };
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", () => {
  state.key = { pressing: false, direction: "" };
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
    board.ball.x = center.w - 5;
    board.ball.y = center.h - 5;
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
