var PONG = PONG || {};
PONG.Paddle = PONG.Paddle || {};

PONG.Paddle.Base = class {
  constructor(name, fieldPosition, maxSpeed) {
    this.name = name;
    this.h = 80;
    this.w = 20;
    this.x = fieldPosition.paddleX;
    this.y = canvas.height / 2 - this.h / 2;
    this.paddleSpeed = maxSpeed;
    this.score = 0;
    this.scoreX = fieldPosition.scoreX; // position of score
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.h;
  }

  centerX() {
    return this.x + this.w / 2;
  }

  centerY() {
    return this.y + this.h / 2;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.w;
  }

  isInYAxisOfBall(ball) {
    return ball.top() >= this.top() && ball.bottom() <= this.bottom();
  }

  setYPosition(movement) {
    if (this.top() + movement < 0) this.y = 0;
    else if (this.bottom() + movement > canvas.height)
      this.y = canvas.height - this.h;
    else this.y += movement;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  update() {
    throw new Error("Not implemented on base class.");
  }
};

PONG.Paddle.Pong = class extends PONG.Paddle.Base {
  constructor(fieldPosition, maxSpeed) {
    super("Pong", fieldPosition, maxSpeed);
  }

  // TODO: update ai to stop jittering effect.
  update() {
    const ball = board.ball;
    let movement;
    if (ball.bottom() < this.centerY())
      movement = Math.max(-this.paddleSpeed, ball.bottom() - this.centerY());
    else if (ball.top() > this.centerY())
      movement = Math.min(this.paddleSpeed, ball.top() - this.centerY());
    else movement = 0;
    this.setYPosition(movement);
  }
};

PONG.Paddle.Player = class extends PONG.Paddle.Base {
  constructor(name, controlsType, x) {
    super(name, x, 10);
    this.controlsType = controlsType || "Standard";
  }

  update() {
    let movement;
    switch (this.controlsType) {
      default:
        break;
      case "Standard":
        if (!state.controls.standard.pressing) return;
        movement =
          state.controls.standard.direction === DIRECTION.UP
            ? -this.paddleSpeed
            : this.paddleSpeed;
        break;
      case "Alt":
        if (!state.controls.alt.pressing) return;
        movement =
          state.controls.alt.direction === DIRECTION.UP
            ? -this.paddleSpeed
            : this.paddleSpeed;
        break;
    }
    this.setYPosition(movement);
  }
};
