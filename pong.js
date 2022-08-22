const new2dCanvas = function (id, width, height) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  return [canvas, ctx];
};

const [canvas, ctx] = new2dCanvas("play-area", 800, 500);

function handlePlayerPaddle() {
  ctx.fillStyle = "white";
  ctx.fillRect(20, canvas.height / 2 - 40, 20, 80);
}

function handleEnemyPaddle() {
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width - 40, canvas.height / 2 - 40, 20, 80);
}

function handleBall() {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2 - 5,
    canvas.height / 2 - 5,
    10,
    0,
    Math.PI * 2,
    true
  );
  ctx.fill();
}

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleEnemyPaddle();
  handlePlayerPaddle();
  handleBall();
  requestAnimationFrame(animate);
})();
