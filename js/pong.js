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
  h: canvas.height / 2,
};

const FIELD_SIDE_POS = {
  LEFT: { paddleX: 20, scoreX: center.w - 50 },
  RIGHT: { paddleX: canvas.width - 40, scoreX: center.w + 50 },
};

const opponentSettings = {
  pvp: false,
  p1StartingSide: FIELD_SIDE_POS.RIGHT,
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
};

/********************************************************************
 *                          E V E N T S
 */

window.addEventListener("keydown", (e) => {
  const pressingUp = { pressing: true, direction: DIRECTION.UP };
  const pressingDown = { pressing: true, direction: DIRECTION.DOWN };
  switch (e.key.toLowerCase()) {
    case "arrowup":
      state.controls.standard = pressingUp;
      break;
    case "arrowdown":
      state.controls.standard = pressingDown;
      break;
    case "w":
      state.controls.alt = pressingUp;
      break;
    case "s":
      state.controls.alt = pressingDown;
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  const noPress = { pressing: false, direction: "" };
  switch (e.key.toLowerCase()) {
    case "arrowup":
    case "arrowdown":
      state.controls.standard = noPress;
      break;
    case "w":
    case "s":
      state.controls.alt = noPress;
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
  const { playerOne, playerTwo, winningScore, ball } = board;
  if (state.roundWon) {
    state.winner.score++;
    state.winner = null;
    if (playerOne.score >= winningScore) {
      state.over = true;
      state.winner = playerOne;
    } else if (playerTwo.score >= winningScore) {
      state.over = true;
      state.winner = playerTwo;
    }
    if (!state.over) {
      const { r, speed, startingSpeed } = ball;
      ball.x = center.w - r / 2;
      ball.y = center.h - r / 2;
      ball.speed = Math.max(speed - 3, startingSpeed);
      state.countdown = 180;
      state.roundWon = false;
    }
  }

  if (state.over)
    PONG.utils.drawText(
      `${state.winner.name} Wins!`,
      "60px Arial",
      "white",
      center.w - 200,
      center.h
    );

  PONG.utils.drawText(
    playerOne.score,
    "30px Arial",
    "white",
    playerOne.scoreX,
    25
  );
  PONG.utils.drawText(
    playerTwo.score,
    "30px Arial",
    "white",
    playerTwo.scoreX,
    25
  );
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
