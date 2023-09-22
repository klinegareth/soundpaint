import * as Tone from "tone";

const crickets = new Tone.Player({
  url: "/crickets.wav",
  autostart: true,
  loop: true,
}).toDestination();

const players = new Tone.Players(
  {
    a: "/a.wav",
    s: "/s.wav",
    d: "/d.wav",
    f: "/f.wav",
    g: "/g.wav",
  },
  { fadeIn: 2, fadeOut: 0.5 },
).toDestination();

let selectedPlayer = players.player("a");

let started = false;
export const onMouseUp = (ev: MouseEvent) => {
  players.stopAll();
};
export const onMouseDown = async (ev: MouseEvent) => {
  if (!started) {
    await Tone.start().then(() => (started = true));
  }
  selectedPlayer.start();
  selectedPlayer.loop = true;
};

export const onKeyDown = (ev: KeyboardEvent) => {
  switch (ev.key) {
    case "a":
      selectedPlayer = players.player("a");
      break;
    case "s":
      selectedPlayer = players.player("s");
      break;
    case "d":
      selectedPlayer = players.player("d");
      break;
    case "f":
      selectedPlayer = players.player("f");
      break;
    case "g":
      selectedPlayer = players.player("g");
      break;
    default:
      break;
  }
};
