var PONG = PONG || {};
PONG.Paddle = PONG.Paddle || {};

PONG.Paddle.Base = class {
  constructor(name, x) {
    this.name = name;
    this.h = 80;
    this.w = 20;
    this.x = x;
    this.y = canvas.height / 2 - this.h / 2;
    this.paddleSpeed = 4;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  update() {
    throw new Error("not implemented on base class.");
  }
};

PONG.Paddle.Pong = class extends PONG.Paddle.Base {
  constructor() {
    super("Pong", canvas.width - 40);
  }

  update() {
    const { y } = board.ball;
    let movement;
    if (y < this.y && y > this.y + this.h) {
      movement = 0;
    } else {
      movement = y > this.y ? -this.paddleSpeed : this.paddleSpeed;
    }
    const position = this.y - movement;
    if (position < 0 || position > canvas.height - this.h) return;
    this.y = position;
  }
};

PONG.Paddle.Player = class extends PONG.Paddle.Base {
  constructor() {
    super("Player", 20);
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
};
