const new2dCanvas = function (id, width, height) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  return [canvas, ctx];
};

const [canvas, ctx] = new2dCanvas("play-area", 800, 500);

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 200, 200);
  requestAnimationFrame(animate);
})();
