import { sleep } from "./utils.ts";
import { extrudeMidpoints, getPoints, Vector2D, Polygon } from "./geometry.ts";

const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

// Creating an offscreen canvas to render to when the page resizes
let offscreenCanvas = document.createElement("canvas");
offscreenCanvas.width = window.innerWidth;
offscreenCanvas.height = window.innerHeight;

let color = "rgba(255, 89, 94, 0.05)";

export const init = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (ctx) draw(ctx);
};

export const resize = () => {
  offscreenCanvas.width = window.innerWidth;
  offscreenCanvas.height = window.innerHeight;
  const offscreenCtx = offscreenCanvas.getContext("2d");
  offscreenCtx?.drawImage(canvas, 0, 0);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx?.drawImage(offscreenCanvas, 0, 0);
};

const drawPoints = (
  points: Array<Vector2D>,
  ctx: CanvasRenderingContext2D,

  fill?: CanvasPattern | CanvasGradient | string,
  stroke?: CanvasPattern | CanvasGradient | string,
) => {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  if (fill) {
    ctx.fillStyle = fill;
  } else {
    ctx.fillStyle = "white";
  }
  ctx.fill();
};

export const draw = (ctx: CanvasRenderingContext2D) => {
  const clear = () => {
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fill();
    window.setTimeout(clear, 50);
  };
  clear();
};

const blotch = (polygon: Polygon) => {
  const basePolygon = extrudeMidpoints(
    extrudeMidpoints(extrudeMidpoints(getPoints(polygon), 60), 20),
    10,
  );

  let counter = 50;
  const recursiveDraw = () => {
    drawPoints(
      extrudeMidpoints(
        extrudeMidpoints(extrudeMidpoints(basePolygon, 10), 8),
        5,
      ),
      ctx,
      color,
    );
    if (counter > 0) {
      counter--;
      window.setTimeout(
        recursiveDraw,
        Math.random() * (20 - 20 / counter) + 20 / counter,
      );
    }
  };
  recursiveDraw();
};

// Event handlers

let mouseDown = false;

export const onMouseDown = (ev: MouseEvent) => {
  mouseDown = true;
  const polygon: Polygon = {
    size: Math.random() * (200 - 100) + 100,
    sides: 10,
    center: {
      x: ev.clientX,
      y: ev.clientY,
    },
  };
  blotch(polygon);
};

export const onMouseUp = (ev: MouseEvent) => {
  mouseDown = false;
};

export const onMouseMove = (ev: MouseEvent) => {
  const polygon: Polygon = {
    size: Math.random() * (100 - 50) + 50,
    sides: 10,
    center: {
      x: ev.clientX,
      y: ev.clientY,
    },
  };
  if (mouseDown) {
    sleep(50).then(() => {
      blotch(polygon);
    });
  }
};

export const onKeyDown = (ev: KeyboardEvent) => {
  switch (ev.key) {
    case "a":
      color = "rgba(255, 89, 94, 0.05)";
      break;
    case "s":
      color = "rgba(255, 202, 58, 0.05)";
      break;
    case "d":
      color = "rgba(138, 201, 38, 0.05)";
      break;
    case "f":
      color = "rgba(25, 130, 196, 0.05)";
      break;
    case "g":
      color = "rgba(106, 76, 147, 0.05)";
      break;

    default:
      break;
  }
};
