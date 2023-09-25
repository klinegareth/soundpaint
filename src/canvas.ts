import { sleep } from "./utils.ts";
import { extrudeMidpoints, getPoints, Vector2D, Polygon } from "./geometry.ts";

export const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

// Creating an offscreen canvas to render to when the page resizes
let offscreenCanvas = document.createElement("canvas");
offscreenCanvas.width = window.innerWidth;
offscreenCanvas.height = window.innerHeight;

let color = "rgba(255, 89, 94, 0.05)";
export let hovered = false;

export const init = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.8;
  if (ctx) draw(ctx);
};

export const resize = () => {
  offscreenCanvas.width = window.innerWidth;
  offscreenCanvas.height = window.innerHeight * 0.8;
  const offscreenCtx = offscreenCanvas.getContext("2d");
  offscreenCtx?.drawImage(canvas, 0, 0);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.8;
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
  const colors = [
    "rgba(255, 89, 94, 0.05)",
    "rgba(255, 202, 58, 0.05)",
    "rgba(138, 201, 38, 0.05)",
  ];
  for (let i = 0; i < 3; i++) {
    const polygon: Polygon = {
      size: Math.random() * (200 - 100) + 100,
      sides: 10,
      center: {
        x:
          Math.random() * (canvas.width * 0.8 - canvas.width * 0.2) +
          canvas.width * 0.2,
        y:
          Math.random() * (canvas.height * 0.8 - canvas.height * 0.2) +
          canvas.height * 0.2,
      },
    };
    blotch(polygon, colors[i]);
  }
};

const blotch = (polygon: Polygon, colorOverride?: string) => {
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
      colorOverride || color,
    );
    if (counter > 0) {
      counter--;
      window.requestAnimationFrame(recursiveDraw);
    }
  };
  recursiveDraw();
};

// Event handlers

let mouseDown = false;

canvas.addEventListener("mouseenter", () => {
  hovered = true;
});

canvas.addEventListener("mouseleave", () => {
  hovered = false;
});

const clear = () => {
  ctx?.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.01)";
  ctx?.fill();
  window.requestAnimationFrame(clear);
};

export const onMouseDown = (ev: MouseEvent) => {
  mouseDown = true;
  if (hovered) {
    clear();
    const polygon: Polygon = {
      size: Math.random() * (200 - 100) + 100,
      sides: 10,
      center: {
        x: ev.clientX,
        y: ev.clientY,
      },
    };
    blotch(polygon);
  }
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
  if (mouseDown && hovered) {
    sleep(25).then(() => {
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
