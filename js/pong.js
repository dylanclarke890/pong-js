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

const Y_DIRECTIONS = [DIRECTION.UP, DIRECTION.DOWN];
const X_DIRECTIONS = [DIRECTION.LEFT, DIRECTION.RIGHT];

const board = {
  player: new PONG.Paddle.Player(),
  pong: new PONG.Paddle.Pong(),
  ball: new PONG.Ball({
    x: X_DIRECTIONS[PONG.utils.randUpTo(2, true)],
    y: Y_DIRECTIONS[PONG.utils.randUpTo(2, true)],
  }),
};

const state = {
  countdown: 180,
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
  if (state.score.p >= 3 && state.roundWon) {
    state.over = true;
    state.winner = board.player;
  } else if (state.score.e >= 3 && state.roundWon) {
    state.over = true;
    state.winner = board.pong;
  }

  if (state.roundWon && !state.over) {
    board.ball.x = canvas.width / 2 - 5;
    board.ball.y = canvas.height / 2 - 5;
    state.countdown = 180;
    state.roundWon = false;
  }

  if (state.over) {
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(
      `${state.winner.name} Wins!`,
      canvas.width / 2 - 200,
      canvas.height / 2
    );
  }

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(state.score.p, canvas.width / 2 - 50, 30);
  ctx.fillText(state.score.e, canvas.width / 2 + 50, 30);
}

function handleCountDown() {
  if (state.countdown === 0) return;
  state.countdown--;
  ctx.font = "60px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(
    Math.ceil(state.countdown / 60),
    canvas.width / 2,
    canvas.height / 2
  );
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
