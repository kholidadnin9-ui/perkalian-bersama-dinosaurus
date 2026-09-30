let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  return ctx;
}

type Tone = { f: number; t: number; d: number; type?: OscillatorType; gain?: number };

function playTones(tones: Tone[]) {
  const c = ac();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const now = c.currentTime;
  for (const tone of tones) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = tone.type ?? "triangle";
    osc.frequency.setValueAtTime(tone.f, now + tone.t);
    const g = tone.gain ?? 0.18;
    gain.gain.setValueAtTime(0.0001, now + tone.t);
    gain.gain.exponentialRampToValueAtTime(g, now + tone.t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.t + tone.d);
    osc.connect(gain).connect(c.destination);
    osc.start(now + tone.t);
    osc.stop(now + tone.t + tone.d + 0.04);
  }
}

export const sfx = {
  click: () => playTones([{ f: 520, t: 0, d: 0.08, type: "square", gain: 0.09 }]),
  pop: () =>
    playTones([
      { f: 660, t: 0, d: 0.07, type: "triangle", gain: 0.12 },
      { f: 880, t: 0.05, d: 0.1, type: "triangle", gain: 0.12 },
    ]),
  correct: () =>
    playTones([
      { f: 523.25, t: 0, d: 0.14 },
      { f: 659.25, t: 0.1, d: 0.14 },
      { f: 783.99, t: 0.2, d: 0.16 },
      { f: 1046.5, t: 0.32, d: 0.28 },
    ]),
  wrong: () =>
    playTones([
      { f: 233.08, t: 0, d: 0.18, type: "sawtooth", gain: 0.1 },
      { f: 174.61, t: 0.13, d: 0.26, type: "sawtooth", gain: 0.1 },
    ]),
  star: () =>
    playTones([
      { f: 1046.5, t: 0, d: 0.12, type: "triangle", gain: 0.12 },
      { f: 1318.5, t: 0.08, d: 0.18, type: "triangle", gain: 0.12 },
    ]),
  finish: () =>
    playTones([
      { f: 523.25, t: 0, d: 0.16 },
      { f: 659.25, t: 0.12, d: 0.16 },
      { f: 783.99, t: 0.24, d: 0.16 },
      { f: 1046.5, t: 0.36, d: 0.2 },
      { f: 1318.5, t: 0.5, d: 0.42 },
    ]),
};
