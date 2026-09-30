export type Question = {
  a: number;
  b: number;
  answer: number;
  options: number[];
  id: string;
};

export type LevelDef = {
  id: number;
  title: string;
  range: string;
  factors: [number, number];
  egg: {
    body: string;
    top: string;
    bottom: string;
    edge: string;
    speck: string;
    letter: string;
  };
  dino: "green" | "blue" | "purple" | "red" | "green2";
};

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    title: "Level 1",
    range: "1 - 2",
    factors: [1, 2],
    egg: {
      body: "#6ec94f",
      top: "#a4e37c",
      bottom: "#3d9434",
      edge: "#22621c",
      speck: "#2c7a26",
      letter: "#1d5c17",
    },
    dino: "blue",
  },
  {
    id: 2,
    title: "Level 2",
    range: "3 - 4",
    factors: [3, 4],
    egg: {
      body: "#3f9de8",
      top: "#79c6f7",
      bottom: "#1c68b4",
      edge: "#12497f",
      speck: "#1a63a8",
      letter: "#0f4472",
    },
    dino: "green",
  },
  {
    id: 3,
    title: "Level 3",
    range: "5 - 6",
    factors: [5, 6],
    egg: {
      body: "#a35ce0",
      top: "#c994f5",
      bottom: "#7330ad",
      edge: "#4f1f7c",
      speck: "#7b36b4",
      letter: "#45196f",
    },
    dino: "purple",
  },
  {
    id: 4,
    title: "Level 4",
    range: "7 - 8",
    factors: [7, 8],
    egg: {
      body: "#f5892e",
      top: "#ffbc70",
      bottom: "#d1601a",
      edge: "#9b420e",
      speck: "#d9691c",
      letter: "#8c3b0b",
    },
    dino: "red",
  },
  {
    id: 5,
    title: "Level 5",
    range: "9 - 10",
    factors: [9, 10],
    egg: {
      body: "#ea4a45",
      top: "#ff8b7f",
      bottom: "#b52b25",
      edge: "#7f1c17",
      speck: "#c2322b",
      letter: "#711713",
    },
    dino: "green",
  },
];

/** deterministic small PRNG so each level always builds the same 10 questions */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distractors(answer: number, a: number, b: number, rnd: () => number): number[] {
  const pool = new Set<number>();
  const candidates = [
    answer + a,
    answer - a,
    answer + b,
    answer - b,
    answer + 1,
    answer - 1,
    answer + 2,
    answer - 2,
    answer + 10,
    answer - 10,
    a * (b + 1),
    a * (b - 1),
  ];
  // start with the closest plausible wrong answers
  candidates.sort((x, y) => Math.abs(x - answer) - Math.abs(y - answer));
  for (const c of candidates) {
    if (c > 0 && c !== answer && !pool.has(c)) pool.add(c);
    if (pool.size === 2) break;
  }
  while (pool.size < 2) {
    const n = answer + Math.round((rnd() * 6 - 3) * 2);
    if (n > 0 && n !== answer) pool.add(n);
  }
  return [...pool];
}

export function buildQuestions(levelIndex: number): Question[] {
  const level = LEVELS[levelIndex];
  const [lo, hi] = level.factors;
  const rnd = mulberry32(9173 + levelIndex * 7717);

  // build every combination of (level factor) x (1..10), shuffled deterministically
  const combos: [number, number][] = [];
  for (let a = lo; a <= hi; a++) {
    for (let b = 1; b <= 10; b++) combos.push([a, b]);
  }
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]];
  }

  return combos.slice(0, 10).map(([a, b], i) => {
    const answer = a * b;
    const opts = distractors(answer, a, b, rnd);
    for (let k = opts.length - 1; k > 0; k--) {
      const j = Math.floor(rnd() * (k + 1));
      [opts[k], opts[j]] = [opts[j], opts[k]];
    }
    const options = [...opts, answer];
    for (let k = options.length - 1; k > 0; k--) {
      const j = Math.floor(rnd() * (k + 1));
      [options[k], options[j]] = [options[j], options[k]];
    }
    return { a, b, answer, options, id: `l${level.id}-q${i}` };
  });
}

export const MOTIVATION = [
  "Ayo Semangat!",
  "Kamu Pasti Bisa!",
  "Terus Berusaha!",
  "Hebat Sekali!",
  "Sedikit Lagi!",
  "Fokus Ya!",
  "Dinosaurus Bangga!",
  "Hitung Pelan-pelan!",
  "Jangan Menyerah!",
  "Kamu Cerdas!",
];

/** one question is worth 10 points when correct, 0 when wrong */
export const POINTS_PER_QUESTION = 10;
export const MAX_LEVEL_SCORE = 10 * POINTS_PER_QUESTION; // 100
export const MAX_TOTAL_SCORE = 5 * MAX_LEVEL_SCORE; // 500

export function starsFor(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  return 1;
}
