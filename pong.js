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

class Paddle {
  constructor(x) {
    this.h = 80;
    this.w = 20;
    this.x = x;
    this.y = canvas.height / 2 - this.h / 2;
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
}

class PlayerPaddle extends Paddle {
  constructor() {
    super(20);
  }
}

class Ball {
  constructor(trajectory) {
    this.x = canvas.width / 2 - 5;
    this.y = canvas.height / 2 - 5;
    this.size = 10;
    this.speed = 1;
    console.log(trajectory);
    this.trajectory = trajectory;
  }

  update() {
    const xSpeed =
      this.trajectory.x === DIRECTION.LEFT ? -this.speed : this.speed;
    const ySpeed =
      this.trajectory.y === DIRECTION.UP ? -this.speed : this.speed;
    this.x -= xSpeed;
    this.y -= ySpeed;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
    ctx.fill();
  }
}

const [canvas, ctx] = new2dCanvas("play-area", 800, 500);

const DIRECTION = {
  UP: "U",
  DOWN: "D",
  LEFT: "L",
  RIGHT: "R",
};

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

function handlePlayerPaddle() {
  board.player.draw();
}

function handleEnemyPaddle() {
  board.enemy.draw();
}

function handleBall() {
  board.ball.draw();
  board.ball.update();
}

window.addEventListener("keypress", (e) => {
  switch (e.key) {
    case "ArrowUp":
      break;
    case "ArrowDown":
      break;
  }
});

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleEnemyPaddle();
  handlePlayerPaddle();
  handleBall();
  requestAnimationFrame(animate);
})();
