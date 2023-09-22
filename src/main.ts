import "./style.css";
import * as canvas from "./canvas.ts";
import * as audio from "./audio.ts";

window.addEventListener("load", canvas.init);
window.addEventListener("resize", canvas.resize);
window.addEventListener("mousedown", (ev) => {
  canvas.onMouseDown(ev);
  audio.onMouseDown(ev);
});
window.addEventListener("mouseup", (ev) => {
  canvas.onMouseUp(ev);
  audio.onMouseUp(ev);
});
window.addEventListener("mousemove", (ev) => {
  canvas.onMouseMove(ev);
});
window.addEventListener("keydown", (ev) => {
  canvas.onKeyDown(ev);
  audio.onKeyDown(ev);
});
