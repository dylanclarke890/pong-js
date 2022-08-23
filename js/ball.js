var PONG = PONG || {};

PONG.Ball = class {
  constructor(trajectory) {
    this.x = canvas.width / 2 - 5;
    this.y = canvas.height / 2 - 5;
    this.r = 10;
    this.speed = 3;
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
    if (this.y - this.r <= 0) {
      this.trajectory.y = DIRECTION.DOWN;
      hasCollided = true;
    }
    if (this.y + this.r >= canvas.height) {
      this.trajectory.y = DIRECTION.UP;
      hasCollided = true;
    }
    const { player, pong: enemy } = board;
    if (
      this.x - this.r <= player.x + player.w &&
      this.x - this.r > player.x &&
      this.y > player.y &&
      this.y < player.y + player.h
    ) {
      this.trajectory.x = DIRECTION.RIGHT;
      hasCollided = true;
    }

    if (
      this.x + this.r >= enemy.x &&
      this.x + this.r < enemy.x + enemy.w &&
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

    if (this.x - this.r <= 0) {
      state.roundWon = true;
      state.winner = board.pong;
    }
    if (this.x + this.r >= canvas.width) {
      state.roundWon = true;
      state.winner = board.player;
    }
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
    ctx.fill();
  }
};
