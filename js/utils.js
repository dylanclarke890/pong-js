var PONG = PONG || {};
PONG.utils = PONG.utils || {};

PONG.utils.new2dCanvas = function (id, width, height) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  return [canvas, ctx];
};

PONG.utils.randUpTo = function (num, floor = false) {
  const res = Math.random() * num;
  return floor ? Math.floor(res) : res;
};
