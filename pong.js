const new2dCanvas = function (id, width, height) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  return [canvas, ctx];
};

const randUpTo = function (num, floor = false) {
  const res = Math.random() * num;
  return floor ? Math.floor(res) : res;
};

const [canvas, ctx] = new2dCanvas("play-area", 800, 500);

const DIRECTION = {
  UP: "U",
  DOWN: "D",
  LEFT: "L",
  RIGHT: "R",
};

class Paddle {
  constructor(x) {
    this.h = 80;
    this.w = 20;
    this.x = x;
    this.y = canvas.height / 2 - this.h / 2;
    this.paddleSpeed = 2;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  update() {
    throw new Error("not implemented on base class.");
  }
}

class EnemyPaddle extends Paddle {
  constructor() {
    super(canvas.width - 40);
  }

  update() {
    if (!state.key.pressing) return;
    const movement =
      state.key.direction === DIRECTION.UP
        ? this.paddleSpeed
        : -this.paddleSpeed;
    const position = this.y - movement;
    if (position < 0 || position > canvas.height - this.h) return;
    this.y = position;
  }
}

class PlayerPaddle extends Paddle {
  constructor() {
    super(20);
  }

  update() {
    if (!state.key.pressing) return;
    const movement =
      state.key.direction === DIRECTION.UP
        ? this.paddleSpeed
        : -this.paddleSpeed;
    const position = this.y - movement;
    if (position < 0 || position > canvas.height - this.h) return;
    this.y = position;
  }
}

class Ball {
  constructor(trajectory) {
    this.x = canvas.width / 2 - 5;
    this.y = canvas.height / 2 - 5;
    this.r = 10;
    this.speed = 1;
    this.collisionCount = 0;
    this.trajectory = trajectory;
  }

  update() {
    if (state.countdown) return;
    const xMovement =
      this.trajectory.x === DIRECTION.LEFT ? this.speed : -this.speed;
    const yMovement =
      this.trajectory.y === DIRECTION.UP ? this.speed : -this.speed;
    this.x = Math.floor(this.x - xMovement);
    this.y = Math.floor(this.y - yMovement);

    let hasCollided = false;
    if (this.y - this.r === 0) {
      this.trajectory.y = DIRECTION.DOWN;
      hasCollided = true;
    }
    if (this.y + this.r === canvas.height) {
      this.trajectory.y = DIRECTION.UP;
      hasCollided = true;
    }
    const { player, enemy } = board;
    if (
      this.x - this.r === player.x + player.w &&
      this.y > player.y &&
      this.y < player.y + player.h
    ) {
      this.trajectory.x = DIRECTION.RIGHT;
      hasCollided = true;
    }

    if (
      this.x + this.r === enemy.x &&
      this.y > enemy.y &&
      this.y < enemy.y + enemy.h
    ) {
      this.trajectory.x = DIRECTION.LEFT;
      hasCollided = true;
    }

    if (hasCollided) this.collisionCount++;
    if (this.collisionCount > 0 && this.collisionCount % 5 === 0) {
      this.speed++;
      this.collisionCount = 0; // otherwise will infinitely speed up once it first hits 5.
    }

    if (this.x - this.r === 0) state.roundWon = true;
    if (this.x + this.r === canvas.width) state.roundWon = true;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fill();
  }
}

const Y_DIRECTIONS = [DIRECTION.UP, DIRECTION.DOWN];
const X_DIRECTIONS = [DIRECTION.LEFT, DIRECTION.RIGHT];

const board = {
  player: new PlayerPaddle(),
  enemy: new EnemyPaddle(),
  ball: new Ball({
    x: X_DIRECTIONS[randUpTo(2, true)],
    y: Y_DIRECTIONS[randUpTo(2, true)],
  }),
};
const state = {
  countdown: 3,
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

function handlePlayerPaddle() {
  board.player.draw();
  board.player.update();
}

function handleEnemyPaddle() {
  board.enemy.draw();
  board.enemy.update();
}

function handleBall() {
  board.ball.draw();
  board.ball.update();
}

function handleGameState() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(state.score.p, canvas.width / 2 - 50, 30);
  ctx.fillText(state.score.e, canvas.width / 2 + 50, 30);

  if (!state.roundWon && !state.over) return;

  if (state.roundWon) {
    if (state.winner === board.player) state.score.p++;
    if (state.winner === board.enemy) state.score.e++;
    board.ball.x = canvas.width / 2 - 5;
    board.ball.y = canvas.height / 2 - 5;
    state.countdown = 180;
    state.roundWon = false;
  }
  if (state.score === 3) state.over = true;
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

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleEnemyPaddle();
  handlePlayerPaddle();
  handleBall();
  handleGameState();
  handleCountDown();
  if (!state.over) requestAnimationFrame(animate);
})();
