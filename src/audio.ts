import * as Tone from "tone";
import { hovered } from "./canvas.ts";

const crickets = new Tone.Player({
  url: "/crickets.wav",
  autostart: true,
  loop: true,
  volume: 1,
}).toDestination();

const reverb = new Tone.Reverb(2);
const players = new Tone.Players(
  {
    a: "/a.wav",
    s: "/s.wav",
    d: "/d.wav",
    f: "/f.wav",
    g: "/g.wav",
  },
  { fadeIn: 2, fadeOut: 0.5, volume: 20 },
).chain(reverb, Tone.Destination);
let selectedPlayer = players.player("a");

let started = false;
let painting = false;
export const onMouseUp = (ev: MouseEvent) => {
  players.stopAll();
  painting = false;
};
export const onMouseDown = async (ev: MouseEvent) => {
  if (hovered) {
    if (!started) {
      await Tone.start().then(() => (started = true));
    }

    painting = true;
    selectedPlayer.start();
    selectedPlayer.loop = true;
  }
};

export const onKeyDown = (ev: KeyboardEvent) => {
  switch (ev.key) {
    case "a":
      selectedPlayer.stop();
      selectedPlayer = players.player("a");
      if (painting) selectedPlayer.start();
      break;
    case "s":
      selectedPlayer.stop();
      selectedPlayer = players.player("s");
      if (painting) selectedPlayer.start();
      break;
    case "d":
      selectedPlayer.stop();
      selectedPlayer = players.player("d");
      if (painting) selectedPlayer.start();
      break;
    case "f":
      selectedPlayer.stop();
      selectedPlayer = players.player("f");
      if (painting) selectedPlayer.start();
      break;
    case "g":
      selectedPlayer.stop();
      selectedPlayer = players.player("g");
      if (painting) selectedPlayer.start();
      break;
    default:
      break;
  }
};
