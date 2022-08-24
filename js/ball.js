var PONG = PONG || {};

PONG.Ball = class {
  constructor(trajectory) {
    this.x = canvas.width / 2 - 5;
    this.y = canvas.height / 2 - 5;
    this.r = 10;
    this.speed = 3;
    this.startingSpeed = this.speed;
    this.maxSpeed = 12;
    this.collisionCount = 0;
    this.trajectory = trajectory;
  }

  top() {
    return this.y - this.r;
  }

  bottom() {
    return this.y + this.r;
  }

  left() {
    return this.x - this.r;
  }

  right() {
    return this.x + this.r;
  }

  hasCollidedWithPaddle(paddle) {
    let hasCollided = false;
    if (
      paddle.x === FIELD_SIDE_POS.LEFT.paddleX &&
      this.left() <= paddle.right() &&
      this.left() >= paddle.left()
    ) {
      this.trajectory.x = DIRECTION.RIGHT;
      hasCollided = true;
    } else if (
      paddle.x === FIELD_SIDE_POS.RIGHT.paddleX &&
      this.right() >= paddle.left() &&
      this.right() <= paddle.right()
    ) {
      this.trajectory.x = DIRECTION.LEFT;
      hasCollided = true;
    }
    return hasCollided;
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
    // Check if it has collided with the top or bottom boundary.
    if (this.top() <= 0) {
      this.trajectory.y = DIRECTION.DOWN;
      hasCollided = true;
    }
    if (this.bottom() >= canvas.height) {
      this.trajectory.y = DIRECTION.UP;
      hasCollided = true;
    }

    // Check for collision with either player's paddle.
    const { playerOne, playerTwo } = board;

    if (playerOne.isInYAxisOfBall(this)) {
      hasCollided = this.hasCollidedWithPaddle(playerOne);
    }

    if (playerTwo.isInYAxisOfBall(this)) {
      hasCollided = this.hasCollidedWithPaddle(playerTwo);
    }

    // Check for collision with the left and right side of the screen.
    if (this.right() >= canvas.width) {
      state.roundWon = true;
      state.winner =
        playerOne.x === FIELD_SIDE_POS.LEFT.paddleX ? playerOne : playerTwo;
    }
    if (this.left() <= 0) {
      state.roundWon = true;
      state.winner =
        playerTwo.x === FIELD_SIDE_POS.RIGHT.paddleX ? playerTwo : playerOne;
    }

    console.log(this.speed);
    // Periodically increase the speed based off of the amount of collisions.
    if (hasCollided) this.collisionCount++;
    if (this.collisionCount > 0 && this.collisionCount % 5 === 0) {
      this.speed = Math.min(this.speed + 1, this.maxSpeed);
      this.collisionCount = 0; // otherwise will infinitely speed up once it first hits 5.
    }
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fill();
  }
};
