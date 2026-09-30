import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Confetti from "./components/Confetti";
import {
  Btn,
  Dino,
  Egg,
  IconArrow,
  IconBack,
  IconGear,
  IconHome,
  IconPlay,
  IconRetry,
  IconSound,
  Parchment,
  Star,
  StarRow,
  WoodSign,
} from "./components/ui";
import {
  LEVELS,
  MAX_LEVEL_SCORE,
  MAX_TOTAL_SCORE,
  MOTIVATION,
  POINTS_PER_QUESTION,
  buildQuestions,
  starsFor,
  type Question,
} from "./lib/game";
import { sfx } from "./lib/sound";

const bg = `${import.meta.env.BASE_URL}images/jungle-bg.jpg`;

type Screen = "home" | "levels" | "intro" | "quiz" | "done" | "final";
type Feedback = "none" | "correct" | "wrong";

type LevelResult = { score: number; stars: number };

const LETTERS = ["A", "B", "C"];
const TILE_VARIANTS = ["btn-orange", "btn-blue", "btn-purple"];

const fadeSlide = {
  initial: { opacity: 0, y: 26, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.98 },
  transition: { duration: 0.34, ease: [0.22, 0.9, 0.3, 1] as [number, number, number, number] },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [levelIndex, setLevelIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>("none");
  const [levelScore, setLevelScore] = useState(0);
  const [results, setResults] = useState<Record<number, LevelResult>>({});
  const [muted, setMuted] = useState(false);
  const [burst, setBurst] = useState(0);
  const [hopKey, setHopKey] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const soundRef = useRef({ muted: false });

  useEffect(() => {
    soundRef.current.muted = muted;
  }, [muted]);

  const withSound = useCallback((fn: () => void) => {
    if (!soundRef.current.muted) fn();
  }, []);

  const totalScore = useMemo(
    () => Object.values(results).reduce((sum, r) => sum + r.score, 0),
    [results],
  );
  const completedCount = Object.keys(results).length;

  const startLevel = (idx: number) => {
    setLevelIndex(idx);
    setQuestions(buildQuestions(idx));
    setQIndex(0);
    setPicked(null);
    setFeedback("none");
    setLevelScore(0);
  };

  const go = (next: Screen) => {
    withSound(sfx.click);
    setScreen(next);
  };

  const answer = (value: number) => {
    if (feedback !== "none" || picked !== null) return;
    setPicked(value);
    const q = questions[qIndex];
    if (value === q.answer) {
      setLevelScore((s) => s + POINTS_PER_QUESTION);
      setFeedback("correct");
      setBurst((b) => b + 1);
      setHopKey((k) => k + 1);
      withSound(sfx.correct);
    } else {
      setFeedback("wrong");
      setShakeKey((k) => k + 1);
      withSound(sfx.wrong);
    }
  };

  const nextQuestion = () => {
    withSound(sfx.click);
    setPicked(null);
    setFeedback("none");
    if (qIndex >= questions.length - 1) {
      const stars = starsFor(levelScore);
      setResults((r) => ({ ...r, [levelIndex]: { score: levelScore, stars } }));
      setScreen("done");
      setBurst((b) => b + 1);
      if (!muted) setTimeout(() => sfx.finish(), 120);
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const currentLevel = LEVELS[levelIndex];
  const question = questions[qIndex];
  const motivation = MOTIVATION[(levelIndex * 3 + qIndex) % MOTIVATION.length];

  return (
    <div className="stage grain font-body">
      <div className="bg-layer" style={{ backgroundImage: `url(${bg})` }} />
      <div className="bg-scrim" />
      <Confetti burstKey={burst} />

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col">
        <AnimatePresence mode="wait">
          {/* ================= HOME ================= */}
          {screen === "home" && (
            <motion.section
              key="home"
              {...fadeSlide}
              className="relative flex min-h-[100dvh] w-full flex-col items-center px-4 pb-8 pt-5"
            >
              <TopBar muted={muted} onMute={() => setMuted((m) => !m)} onGear={() => {}} />

              <div className="anim-sway mt-6 w-full max-w-[680px]" style={{ transformOrigin: "top center" }}>
                <WoodSign className="relative px-5 pb-7 pt-6 sm:px-9">
                  <span className="pointer-events-none absolute -top-3 left-[17%] h-6 w-6 rounded-full border-[5px] border-[#d8b273] bg-[#7c5228] shadow-[0_3px_6px_rgba(60,32,10,0.5)]" />
                  <span className="pointer-events-none absolute -top-3 right-[17%] h-6 w-6 rounded-full border-[5px] border-[#d8b273] bg-[#7c5228] shadow-[0_3px_6px_rgba(60,32,10,0.5)]" />
                  <div className="mx-auto w-fit rounded-full border-4 border-[#1b4c7c] bg-gradient-to-b from-[#69b6ef] to-[#2b6fb6] px-6 py-1.5 shadow-[inset_0_3px_0_rgba(255,255,255,0.4),0_6px_12px_rgba(20,50,80,0.35)]">
                    <span className="sticker text-[clamp(1.05rem,3.8vw,2.05rem)]">PETUALANGAN</span>
                  </div>

                  <h1 className="mt-1 text-center">
                    <span className="sticker sticker-yellow block text-[clamp(2.35rem,11vw,6.4rem)] leading-[0.92]">
                      PERKALIAN
                    </span>
                  </h1>

                  <div className="mx-auto -mt-1 w-fit rounded-full border-4 border-[#1b4c7c] bg-gradient-to-b from-[#74bff2] to-[#2d76c0] px-8 py-1 shadow-[inset_0_3px_0_rgba(255,255,255,0.42),0_6px_12px_rgba(20,50,80,0.32)]">
                    <span className="sticker text-[clamp(1.35rem,5.4vw,3rem)] tracking-[0.08em]">
                      1 - 10
                    </span>
                  </div>

                  {/* required byline, directly under the title */}
                  <div className="mx-auto mt-3 w-fit rounded-full border-[3px] border-[#c08a4c] bg-[#fdf3dc] px-5 py-1.5 shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_5px_10px_rgba(70,40,12,0.28)]">
                    <p className="text-[clamp(0.68rem,1.95vw,0.92rem)] font-bold tracking-[0.13em] text-[#6b431f]">
                      created by: Widodo guru sd
                    </p>
                  </div>
                </WoodSign>
              </div>

              <WoodSign
                deep
                bolted={false}
                className="mt-4 max-w-[560px] rounded-[20px] px-6 py-3 text-center"
              >
                <p className="text-[clamp(0.95rem,2.7vw,1.35rem)] font-bold leading-snug text-[#ffe9c2]">
                  Yuk, jadi penjelajah cerdas di dunia dinosaurus!
                </p>
              </WoodSign>

              <div className="mt-7">
                <Btn variant="green" size="lg" onClick={() => go("levels")} className="px-12">
                  <IconPlay size={26} />
                  <span>Mulai</span>
                </Btn>
              </div>

              <p className="mt-5 rounded-full border-2 border-[#c9a165]/70 bg-[#fdf3dc]/85 px-5 py-1.5 text-center text-[clamp(0.72rem,2vw,0.92rem)] font-bold text-[#6b431f]">
                5 level · 50 soal perkalian · 3 pilihan jawaban
              </p>
            </motion.section>
          )}

          {/* ================= LEVEL SELECT ================= */}
          {screen === "levels" && (
            <motion.section
              key="levels"
              {...fadeSlide}
              className="relative flex min-h-[100dvh] w-full flex-col items-center px-4 pb-10 pt-5"
            >
              <TopBar
                muted={muted}
                onMute={() => setMuted((m) => !m)}
                onGear={() => {}}
                left={
                  <IconBtnRound label="Kembali" onClick={() => go("home")}>
                    <IconBack />
                  </IconBtnRound>
                }
              />

              <WoodSign className="mt-4 px-9 py-3">
                <h2 className="sticker text-[clamp(1.75rem,6vw,3.1rem)]">Pilih Level</h2>
              </WoodSign>

              <div className="mt-8 flex w-full max-w-[1050px] flex-wrap items-start justify-center gap-x-2 gap-y-8 sm:gap-x-3 lg:gap-x-6">
                {LEVELS.map((lv, i) => {
                  const res = results[i];
                  return (
                    <button
                      key={lv.id}
                      type="button"
                      onClick={() => {
                        withSound(sfx.pop);
                        startLevel(i);
                        setScreen("intro");
                      }}
                      className="group w-[84px] sm:w-[104px] lg:w-[170px] cursor-pointer rounded-[22px] pb-2 transition-transform duration-150 hover:-translate-y-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe27a]"
                    >
                      <div
                        className="anim-bob mx-auto aspect-[120/156] w-full drop-shadow-[0_16px_20px_rgba(8,40,28,0.42)]"
                        style={{ animationDelay: `${i * 320}ms` }}
                      >
                        <Egg {...lv.egg} number={lv.id} />
                      </div>
                      <div className="wood-deep mx-auto -mt-2 w-full rounded-2xl px-1.5 py-1.5">
                        <p className="text-center text-[clamp(0.68rem,2vw,0.92rem)] font-extrabold leading-tight text-[#ffe9c2]">
                          Level {lv.id}
                        </p>
                        <p className="text-center text-[clamp(0.62rem,1.8vw,0.82rem)] font-bold text-[#f0cf9c]">
                          ({lv.range})
                        </p>
                        <div className="mt-1 flex justify-center">
                          <StarRow count={res?.stars ?? 0} size={16} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <WoodSign
                deep
                bolted={false}
                className="mt-10 rounded-[20px] px-7 py-3 text-center"
              >
                <p className="text-[clamp(0.92rem,2.6vw,1.3rem)] font-bold text-[#ffe9c2]">
                  Selesaikan 10 soal di setiap level!
                </p>
              </WoodSign>

              <Recap results={results} />
            </motion.section>
          )}

          {/* ================= LEVEL INTRO ================= */}
          {screen === "intro" && (
            <motion.section
              key="intro"
              {...fadeSlide}
              className="relative flex min-h-[100dvh] w-full flex-col items-center px-4 pb-10 pt-5"
            >
              <TopBar
                muted={muted}
                onMute={() => setMuted((m) => !m)}
                onGear={() => {}}
                left={
                  <IconBtnRound label="Kembali" onClick={() => go("levels")}>
                    <IconBack />
                  </IconBtnRound>
                }
              />

              <WoodSign className="mt-4 px-10 py-3">
                <h2 className="sticker text-[clamp(1.75rem,6vw,3.1rem)]">
                  Level {currentLevel.id}
                </h2>
              </WoodSign>

              <Parchment className="relative mt-7 w-full max-w-[560px] px-6 py-8 text-center sm:px-10">
                <p className="label-caps text-[clamp(0.68rem,2vw,0.86rem)] text-[#a97b3d]">
                  Materi
                </p>
                <h3 className="sticker sticker-dark mt-1 text-[clamp(1.85rem,7vw,3.35rem)]">
                  Perkalian {currentLevel.range}
                </h3>
                <p className="mx-auto mt-3 max-w-[380px] text-[clamp(0.98rem,2.8vw,1.28rem)] font-bold text-[#6b431f]">
                  Selesaikan 10 soal dengan benar!
                </p>

                <div className="mt-5 flex justify-center">
                  <StarRow count={0} size={38} />
                </div>

                <div className="mx-auto mt-6 w-fit rounded-2xl border-[3px] border-[#c08a4c] bg-[#f0dcb4] px-6 py-2.5 shadow-[inset_0_2px_0_rgba(255,255,255,0.55)]">
                  <p className="label-caps text-[clamp(0.62rem,1.8vw,0.8rem)] text-[#8b5f2c]">
                    Jumlah Soal
                  </p>
                  <p className="font-display text-[clamp(1.6rem,5vw,2.35rem)] leading-none text-[#6b431f]">
                    10
                  </p>
                </div>
              </Parchment>

              <div className="mt-7">
                <Btn variant="green" size="lg" onClick={() => { startLevel(levelIndex); go("quiz"); }}>
                  <IconPlay size={26} />
                  <span>Mulai</span>
                </Btn>
              </div>
            </motion.section>
          )}

          {/* ================= QUIZ ================= */}
          {screen === "quiz" && question && (
            <motion.section
              key="quiz"
              {...fadeSlide}
              className="relative flex min-h-[100dvh] w-full flex-col items-center px-4 pb-10 pt-4"
            >
              <TopBar
                muted={muted}
                onMute={() => setMuted((m) => !m)}
                onGear={() => {}}
                left={
                  <IconBtnRound label="Ke beranda" onClick={() => go("home")}>
                    <IconHome />
                  </IconBtnRound>
                }
                compact
              />

              {/* progress row */}
              <div className="mt-2 flex w-full max-w-[980px] flex-wrap items-center justify-center gap-3 sm:gap-5">
                <WoodSign deep bolted={false} className="rounded-full px-5 py-1.5">
                  <span className="font-display text-[clamp(0.95rem,2.8vw,1.35rem)] text-[#ffe9c2]">
                    Level {currentLevel.id}
                  </span>
                </WoodSign>

                <div className="relative h-9 w-[min(52vw,330px)] rounded-full border-4 border-[#2f1c0c] bg-[#4d2f16] p-[5px] shadow-[inset_0_3px_6px_rgba(0,0,0,0.45)]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-b from-[#8fe86f] to-[#37a229] shadow-[inset_0_2px_0_rgba(255,255,255,0.5)]"
                    initial={false}
                    animate={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-display text-[clamp(0.85rem,2.5vw,1.15rem)] text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
                    {qIndex + 1}/{questions.length}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border-4 border-[#a8720f] bg-gradient-to-b from-[#ffd766] to-[#eaa61c] px-4 py-1 shadow-[inset_0_2px_0_rgba(255,255,255,0.55),0_8px_14px_rgba(20,50,35,0.32)]">
                  <Star size={22} />
                  <span className="font-display text-[clamp(0.95rem,2.8vw,1.35rem)] text-[#7a4c0c]">
                    {totalScore + levelScore}
                  </span>
                </div>
              </div>

              {/* question */}
              <Parchment
                key={question.id}
                className="relative mt-6 w-full max-w-[720px] px-5 py-10 text-center sm:py-14"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <span className="sticker sticker-dark text-[clamp(2.6rem,12vw,6.2rem)] leading-none">
                    {question.a} <span className="text-[#c2452c]">×</span> {question.b}{" "}
                    <span className="text-[#c2452c]">=</span> ?
                  </span>
                </motion.div>
                <p className="mt-4 text-[clamp(0.82rem,2.3vw,1.05rem)] font-bold text-[#8b5f2c]">
                  Pilih jawaban yang benar di bawah ini
                </p>
              </Parchment>

              {/* answers */}
              <div className="mt-8 grid w-full max-w-[860px] grid-cols-3 gap-2.5 pb-3 sm:gap-7">
                {question.options.map((opt, i) => {
                  const isPicked = picked === opt;
                  const isAnswer = opt === question.answer;
                  const state =
                    feedback === "correct" && isAnswer
                      ? "tile-correct"
                      : feedback === "wrong" && isPicked
                        ? "tile-wrong"
                        : "";
                  return (
                    <button
                      key={`${question.id}-${opt}`}
                      type="button"
                      onClick={() => answer(opt)}
                      disabled={feedback !== "none"}
                      className={`tile ${TILE_VARIANTS[i]} ${state} w-full pb-4 pt-4 ${
                        feedback !== "none" && !isAnswer && !isPicked ? "opacity-55" : ""
                      }`}
                    >
                      <span className="block text-[clamp(2rem,8vw,4.2rem)] leading-none">{opt}</span>
                      <span className="absolute -bottom-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white/85 font-display text-[clamp(0.95rem,2.6vw,1.3rem)] text-white shadow-[0_5px_10px_rgba(10,30,20,0.35)]">
                        {LETTERS[i]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex w-full max-w-[980px] items-end justify-between gap-4">
                <Dino
                  name={currentLevel.dino}
                  className="w-[clamp(84px,20vw,190px)]"
                />
                <WoodSign
                  deep
                  bolted={false}
                  className="max-w-[230px] rounded-[18px] px-4 py-2.5 text-center"
                >
                  <p className="text-[clamp(0.85rem,2.4vw,1.12rem)] font-extrabold leading-tight text-[#ffe9c2]">
                    {motivation}
                  </p>
                </WoodSign>
              </div>
            </motion.section>
          )}

          {/* ================= LEVEL DONE ================= */}
          {screen === "done" && (
            <motion.section
              key="done"
              {...fadeSlide}
              className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 pb-10 pt-6"
            >
              <TopBar floating muted={muted} onMute={() => setMuted((m) => !m)} onGear={() => {}} />

              <WoodSign className="relative w-full max-w-[560px] px-6 py-8 text-center">
                <h2 className="sticker text-[clamp(1.75rem,6.4vw,3.25rem)]">
                  Level {currentLevel.id} Selesai!
                </h2>
                <div className="mt-4 flex justify-center">
                  <StarRow
                    count={results[levelIndex]?.stars ?? starsFor(levelScore)}
                    size={46}
                    animate
                  />
                </div>

                <p className="label-caps mt-6 text-[clamp(0.68rem,2vw,0.88rem)] text-[#f2d9ab]">
                  Skor Level
                </p>
                <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full border-4 border-[#a8720f] bg-gradient-to-b from-[#ffd766] to-[#eaa61c] px-6 py-1.5">
                  <Star size={22} />
                  <span className="font-display text-[clamp(1.15rem,3.6vw,1.75rem)] text-[#7a4c0c]">
                    {levelScore}/{MAX_LEVEL_SCORE}
                  </span>
                </div>

                <p className="mt-6 text-[clamp(1rem,3vw,1.35rem)] font-extrabold text-[#ffe9c2]">
                  {levelIndex < LEVELS.length - 1
                    ? `Lanjut ke Level ${levelIndex + 2}?`
                    : "Lihat hasil akhir?"}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                  <Btn
                    variant="green"
                    size="md"
                    onClick={() => {
                      withSound(sfx.pop);
                      if (levelIndex < LEVELS.length - 1) {
                        startLevel(levelIndex + 1);
                        setScreen("intro");
                      } else {
                        setScreen("final");
                        setBurst((b) => b + 1);
                      }
                    }}
                  >
                    <span>Ya</span>
                    <IconArrow />
                  </Btn>
                  <Btn variant="slate" size="md" onClick={() => go("levels")}>
                    <span>Nanti</span>
                  </Btn>
                </div>
              </WoodSign>

              <Recap results={results} />
            </motion.section>
          )}

          {/* ================= FINAL ================= */}
          {screen === "final" && (
            <motion.section
              key="final"
              {...fadeSlide}
              className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 pb-10 pt-6"
            >
              <TopBar floating muted={muted} onMute={() => setMuted((m) => !m)} onGear={() => {}} />

              <WoodSign className="relative w-full max-w-[560px] px-6 py-8 text-center">
                <h2 className="sticker sticker-yellow text-[clamp(2.1rem,8vw,4.15rem)] leading-none">
                  Selamat!
                </h2>
                <p className="mx-auto mt-3 max-w-[380px] text-[clamp(1rem,3vw,1.35rem)] font-extrabold leading-snug text-[#ffe9c2]">
                  Kamu telah menyelesaikan semua level!
                </p>

                <div className="mt-5 flex justify-center">
                  <StarRow count={3} size={42} animate />
                </div>

                <p className="label-caps mt-6 text-[clamp(0.68rem,2vw,0.88rem)] text-[#f2d9ab]">
                  Skor Akhir
                </p>
                <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full border-4 border-[#a8720f] bg-gradient-to-b from-[#ffd766] to-[#eaa61c] px-6 py-1.5">
                  <Star size={22} />
                  <span className="font-display text-[clamp(1.15rem,3.6vw,1.75rem)] text-[#7a4c0c]">
                    {totalScore}/{MAX_TOTAL_SCORE}
                  </span>
                </div>

                <div className="mt-4 text-[clamp(0.85rem,2.4vw,1.05rem)] font-bold text-[#f2d9ab]">
                  Level selesai: {completedCount}/{LEVELS.length}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <Btn
                    variant="green"
                    size="md"
                    onClick={() => {
                      withSound(sfx.pop);
                      setResults({});
                      startLevel(0);
                      setScreen("levels");
                    }}
                  >
                    <IconRetry />
                    <span>Main Lagi</span>
                  </Btn>
                  <Btn variant="cream" size="md" onClick={() => go("levels")}>
                    <span>Pilih Level</span>
                  </Btn>
                </div>
              </WoodSign>

              <Recap results={results} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- feedback overlays ---------- */}
      <AnimatePresence>
        {screen === "quiz" && feedback === "correct" && (
          <Overlay key="ok" shakeKey={shakeKey}>
            <WoodSign className="relative w-full max-w-[520px] px-6 py-8 text-center">
              <div className="flex justify-center">
                <StarRow count={3} size={44} animate />
              </div>
              <h3 className="sticker sticker-yellow mt-3 text-[clamp(2.25rem,8vw,4rem)] leading-none">
                Hebat!
              </h3>
              <p className="mt-2 text-[clamp(1.02rem,3vw,1.42rem)] font-extrabold text-[#ffe9c2]">
                Jawaban kamu benar!
              </p>
              <div className="mt-3 flex justify-center">
                <span className="rounded-full border-[3px] border-[#a8720f] bg-gradient-to-b from-[#ffd766] to-[#eaa61c] px-5 py-1 font-display text-[clamp(1.05rem,3.2vw,1.5rem)] text-[#7a4c0c]">
                  +{POINTS_PER_QUESTION} poin
                </span>
              </div>
              <div className="mt-6">
                <Btn variant="green" size="md" onClick={nextQuestion}>
                  <span>
                    {qIndex >= questions.length - 1 ? "Lihat Hasil" : "Soal Berikutnya"}
                  </span>
                  <IconArrow />
                </Btn>
              </div>
            </WoodSign>
          </Overlay>
        )}

        {screen === "quiz" && feedback === "wrong" && (
          <Overlay key="no">
            <div className="relative w-full max-w-[560px]">
              <Dino
                name="green"
                className="absolute -left-2 bottom-0 z-0 w-[clamp(96px,24vw,210px)] sm:-left-16"
              />
              <Parchment className="relative z-10 ml-[clamp(48px,13vw,110px)] px-5 py-7 text-center sm:px-8">
                <h3 className="sticker sticker-dark text-[clamp(1.85rem,6vw,2.9rem)] leading-none">
                  Ups...
                </h3>
                <p className="mx-auto mt-3 max-w-[320px] text-[clamp(0.98rem,2.8vw,1.24rem)] font-bold leading-snug text-[#6b431f]">
                  Jawaban kamu belum tepat. Pelajari lagi di soal berikutnya!
                </p>

                <div className="mx-auto mt-4 w-fit rounded-2xl border-[3px] border-[#c08a4c] bg-[#f0dcb4] px-5 py-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.55)]">
                  <p className="label-caps text-[clamp(0.58rem,1.7vw,0.74rem)] text-[#8b5f2c]">
                    Jawaban Benar
                  </p>
                  <p className="font-display text-[clamp(1.35rem,4.6vw,2.15rem)] leading-none text-[#2e7d25]">
                    {question.a} × {question.b} = {question.answer}
                  </p>
                </div>

                <div className="mt-5 flex justify-center">
                  <Btn variant="orange" size="md" onClick={nextQuestion}>
                    <span>
                      {qIndex >= questions.length - 1 ? "Lihat Hasil" : "Soal Berikutnya"}
                    </span>
                    <IconArrow />
                  </Btn>
                </div>
              </Parchment>
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* edge decorations that live behind everything */}
      <EdgeDinos screen={screen} hopKey={hopKey} levelIndex={levelIndex} />
    </div>
  );
}

/* ---------------- shared bits ---------------- */

function Overlay({
  children,
  shakeKey = 0,
}: {
  children: ReactNode;
  shakeKey?: number;
}) {
  return (
    <motion.div
      key={shakeKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b2f24]/70 px-5 py-8 backdrop-blur-[3px]"
    >
      {children}
    </motion.div>
  );
}

function IconBtnRound({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="btn3d btn-orange flex h-11 w-11 items-center justify-center rounded-full p-0 sm:h-12 sm:w-12"
    >
      {children}
    </button>
  );
}

function Recap({ results }: { results: Record<number, LevelResult> }) {
  const total = Object.values(results).reduce((sum, r) => sum + r.score, 0);
  return (
    <div className="mt-7 w-full max-w-[560px]">
      <Parchment className="rounded-[22px] px-3 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="label-caps text-[clamp(0.66rem,1.9vw,0.82rem)] text-[#8b5f2c]">
            Rekap Nilai
          </p>
          <p className="text-[clamp(0.66rem,1.9vw,0.82rem)] font-bold text-[#a97b3d]">
            1 soal benar = {POINTS_PER_QUESTION} poin
          </p>
        </div>

        <ul className="mt-3 space-y-1.5">
          {LEVELS.map((lv, i) => {
            const r = results[i];
            return (
              <li
                key={lv.id}
                className={`flex items-center gap-2 rounded-xl px-2 py-1.5 ${
                  r ? "bg-[#f0dcb4]" : "bg-[#f7ead2]/55"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c98a4b] font-display text-[0.82rem] text-[#fff8e8] shadow-[inset_0_-2px_0_rgba(90,50,15,0.35)]">
                  {lv.id}
                </span>
                <span className="min-w-0 flex-1 truncate text-[clamp(0.78rem,2.1vw,0.95rem)] font-bold text-[#6b431f]">
                  Perkalian {lv.range}
                </span>
                <span className="hidden shrink-0 sm:block">
                  <StarRow count={r?.stars ?? 0} size={15} />
                </span>
                <span className="w-[70px] shrink-0 text-right font-display text-[clamp(0.95rem,2.6vw,1.18rem)] leading-none tabular-nums text-[#6b431f]">
                  {r ? r.score : "\u2014"}
                  <span className="text-[0.72em] text-[#a97b3d]">/{MAX_LEVEL_SCORE}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border-[3px] border-[#c08a4c] bg-gradient-to-b from-[#ffd766] to-[#eaa61c] px-4 py-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.55)]">
          <span className="label-caps text-[clamp(0.66rem,1.9vw,0.84rem)] text-[#7a4c0c]">
            Total Nilai
          </span>
          <span className="font-display text-[clamp(1.15rem,3.4vw,1.65rem)] leading-none tabular-nums text-[#6b3d08]">
            {total}/{MAX_TOTAL_SCORE}
          </span>
        </div>
      </Parchment>
    </div>
  );
}

function TopBar({
  muted,
  onMute,
  onGear,
  left,
  compact = false,
  floating = false,
}: {
  muted: boolean;
  onMute: () => void;
  onGear: () => void;
  left?: ReactNode;
  compact?: boolean;
  floating?: boolean;
}) {
  return (
    <div
      className={`flex w-full items-center justify-between gap-3 ${
        floating
          ? "absolute left-4 right-4 top-5 z-20 mx-auto max-w-[1050px]"
          : "max-w-[1050px]"
      } ${compact ? "" : "min-h-[3rem]"}`}
    >
      <div className="flex items-center gap-2.5">
        {left ?? (
          <button
            type="button"
            aria-label="Pengaturan"
            title="Pengaturan"
            onClick={onGear}
            className="btn3d btn-orange flex h-11 w-11 items-center justify-center rounded-full p-0 sm:h-12 sm:w-12"
          >
            <IconGear />
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
        title={muted ? "Nyalakan suara" : "Matikan suara"}
        onClick={onMute}
        className="btn3d btn-orange flex h-11 w-11 items-center justify-center rounded-full p-0 sm:h-12 sm:w-12"
      >
        <IconSound muted={muted} />
      </button>
    </div>
  );
}

function EdgeDinos({
  screen,
  hopKey,
  levelIndex,
}: {
  screen: Screen;
  hopKey: number;
  levelIndex: number;
}) {
  if (screen === "quiz") return null;
  const right = LEVELS[levelIndex]?.dino ?? "red";
  return (
    <>
      <Dino
        key={`l-${screen}`}
        name={screen === "home" ? "green" : screen === "final" ? "purple" : (LEVELS[levelIndex]?.dino ?? "blue")}
        className="absolute bottom-0 left-[-3%] z-[5] w-[clamp(112px,25vw,270px)]"
      />
      <Dino
        key={`r-${screen}-${hopKey}`}
        name={screen === "home" ? "red" : right}
        className={`absolute bottom-0 right-[-3%] z-[5] w-[clamp(112px,25vw,270px)] ${
          hopKey ? "anim-hop" : ""
        }`}
        flip
      />
    </>
  );
}

