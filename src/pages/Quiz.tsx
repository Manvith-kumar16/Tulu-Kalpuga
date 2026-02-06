import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gamepad2, Heart, Zap, Play, Check, X, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { vowelAudio, consonantAudio } from "@/data/tuluLetterAudio";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

// ----- CONFIG -----
const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 5; // Reduced lives for higher stakes feeling

// ----- DATA MODEL -----
type Item = {
  id: string;
  letter: string;
  transliteration: string;
  imageFile?: string;
  kind: "vowel" | "consonant" | "number";
};

// Image Maps
const vowelImageMap: Record<string, string> = {
  "a": "/images/Vowels/a.png", "ā": "/images/Vowels/AA.png", "i": "/images/Vowels/i.png",
  "ī": "/images/Vowels/ii.png", "u": "/images/Vowels/u.png", "ū": "/images/Vowels/uu.png",
  "e": "/images/Vowels/e.png", "ē": "/images/Vowels/ee.png", "ai": "/images/Vowels/Ai.png",
  "o": "/images/Vowels/o.png", "ō": "/images/Vowels/oo.png",
};
const consonantImageMap: Record<string, string> = {
  "ka": "/images/Consonants/ka.png", "kha": "/images/Consonants/kha.png", "ga": "/images/Consonants/ga.png",
  "gha": "/images/Consonants/gha.png", "cha": "/images/Consonants/cha.png", "ja": "/images/Consonants/ja.png",
  "ta": "/images/Consonants/ta.png", "taa": "/images/Consonants/taa.png", "da": "/images/Consonants/da.png", "daa": "/images/Consonants/daa.png",
  "dha": "/images/Consonants/dha.png", "dhaa": "/images/Consonants/dhaa.png",
  "pa": "/images/Consonants/Pa.png", "pha": "/images/Consonants/pha.png", "ba": "/images/Consonants/Ba.png",
  "bha": "/images/Consonants/Bha.png", "ma": "/images/Consonants/Ma.png",
  "ya": "/images/Consonants/Ya.png", "ra": "/images/Consonants/Ra.png", "la": "/images/Consonants/La.png",
  "ḷa": "/images/Consonants/LLa.png", "va": "/images/Consonants/Va.png",
  "sha": "/images/Consonants/Sha.png", "ṣha": "/images/Consonants/SHha.png", "sa": "/images/Consonants/Sa.png",
  "ha": "/images/Consonants/Ha.png", "na": "/images/Consonants/Na.png", "ṅa": "/images/Consonants/nga.png",
  "ña": "/images/Consonants/nya.png", "r̥a": "/images/Consonants/raa.png", "l̥a": "/images/Consonants/laa.png",
  "gya": "/images/Consonants/Gya.png",
};
const numberItems: Item[] = [
  { id: "n_0", letter: "0", transliteration: "0", imageFile: "/images/Numbers/0.png", kind: "number" },
  { id: "n_1", letter: "1", transliteration: "1", imageFile: "/images/Numbers/1.png", kind: "number" },
  { id: "n_2", letter: "2", transliteration: "2", imageFile: "/images/Numbers/2.png", kind: "number" },
  { id: "n_3", letter: "3", transliteration: "3", imageFile: "/images/Numbers/3.png", kind: "number" },
  { id: "n_4", letter: "4", transliteration: "4", imageFile: "/images/Numbers/4.png", kind: "number" },
  { id: "n_5", letter: "5", transliteration: "5", imageFile: "/images/Numbers/5.png", kind: "number" },
];

const vowelItems: Item[] = vowelAudio.map((v, idx) => ({ id: `v_${idx}`, letter: v.letter, transliteration: v.transliteration, imageFile: vowelImageMap[v.transliteration], kind: "vowel" as const })).filter(v => !!v.imageFile);
const consonantItems: Item[] = consonantAudio.map((c, idx) => ({ id: `c_${idx}`, letter: c.letter, transliteration: c.transliteration, imageFile: consonantImageMap[c.transliteration], kind: "consonant" as const })).filter(c => !!c.imageFile);
const allItems = [...vowelItems, ...consonantItems, ...numberItems];

// Helpers
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }
function pickN<T>(arr: T[], n: number, exclude?: (t: T) => boolean): T[] {
  const pool = exclude ? arr.filter(a => !exclude(a)) : [...arr];
  return shuffle(pool).slice(0, n);
}

type Question = {
  prompt: string;
  correct: string;
  options: string[];
  imageSrc?: string;
};

const Quiz: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [category, setCategory] = useState<"vowels" | "consonants" | "numbers" | "hybrid">("hybrid");

  // Prevent scroll when quiz is active to ensure fit-to-screen
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const buildQuestions = (pool: Item[]) => {
    const base = shuffle(pool);
    const qs: Question[] = [];
    for (let i = 0; i < Math.min(TOTAL_QUESTIONS, base.length); i++) {
      const it = base[i];
      const distractors = pickN(pool, 3, a => a.transliteration === it.transliteration).map(d => d.transliteration);
      qs.push({
        prompt: "Match the character",
        correct: it.transliteration,
        options: shuffle([it.transliteration, ...distractors]),
        imageSrc: it.imageFile,
      });
    }
    return qs;
  };

  const startQuiz = (cat: typeof category) => {
    let pool = allItems;
    if (cat === "vowels") pool = vowelItems;
    if (cat === "consonants") pool = consonantItems;
    if (cat === "numbers") pool = numberItems;

    setQuestions(buildQuestions(pool));
    setCategory(cat);
    setStarted(true);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setLives(MAX_LIVES);
    setSelected(null);
    setShowAnswer(false);
  };

  const handleAnswer = (choice: string) => {
    if (showAnswer) return;
    const current = questions[index];
    const isCorrect = choice === current.correct;
    setSelected(choice);
    setShowAnswer(true);

    if (isCorrect) {
      setScore(s => s + 10 + (streak >= 2 ? 5 : 0));
      setStreak(s => s + 1);
    } else {
      setLives(l => l - 1);
      setStreak(0);
    }

    setTimeout(() => {
      if (index < questions.length - 1 && lives > (isCorrect ? 0 : 1)) {
        setIndex(i => i + 1);
        setSelected(null);
        setShowAnswer(false);
      } else {
        // Quiz is over
        const finalScore = score + (isCorrect ? 10 + (streak >= 2 ? 5 : 0) : 0);
        api.logQuiz(finalScore, questions.length * 10).catch(console.error);
        setScore(finalScore);

        // Ensure index goes out of bounds to trigger result screen
        setIndex(i => i + 1);
      }
    }, 1200);
  };

  const quizOver = started && (index >= questions.length || lives <= 0);
  const current = questions[index];

  return (
    // Main container locking height to viewport minus header (approx)
    <div className="relative h-[calc(100vh-4rem)] bg-[#FFFDF7] dark:bg-zinc-950 overflow-hidden flex flex-col items-center justify-center font-sans text-amber-950 dark:text-amber-50">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-orange-400/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 w-full h-64 bg-gradient-to-t from-amber-100/40 to-transparent dark:from-amber-900/20" />
      </div>

      {/* HEADER (Always visible but minimal) */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 w-full max-w-4xl px-6 flex justify-between items-center z-20"
      >
        {!started && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Tulu Mastery</span>
          </div>
        )}

        {started && !quizOver && (
          <div className="w-full">
            {/* Game HUD */}
            <div className="flex items-center justify-between gap-4 w-full">

              {/* Lives */}
              <div className="flex items-center gap-1.5 bg-white/50 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-200/50 shadow-sm">
                <Heart className={`w-5 h-5 ${lives > 0 ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                <span className="font-bold text-red-600 dark:text-red-400">{lives}</span>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 max-w-md relative h-3 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((index) / TOTAL_QUESTIONS) * 100}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </div>

              {/* Score */}
              <div className="flex items-center gap-1.5 bg-white/50 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-200/50 shadow-sm">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-amber-700 dark:text-amber-400">{score}</span>
              </div>

            </div>
          </div>
        )}
      </motion.nav>

      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">

        {/* VIEW: START SCREEN */}
        <AnimatePresence mode="wait">
          {!started && (
            <motion.div
              key="start-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center w-full"
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-br from-amber-600 to-orange-700 bg-clip-text text-transparent drop-shadow-sm">
                Tulu Lipi Challenge
              </h1>
              <p className="text-xl text-amber-800/60 dark:text-amber-200/60 mb-12 max-w-lg mx-auto leading-relaxed">
                Test your knowledge of the ancient script. Race against time and keep your streak alive!
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {[
                  { id: 'vowels', label: 'Vowels', desc: 'Swaras', icon: 'Aa' },
                  { id: 'consonants', label: 'Consonants', desc: 'Vyanjanas', icon: 'Ka' },
                  { id: 'numbers', label: 'Numbers', desc: 'Counting', icon: '123' },
                  { id: 'hybrid', label: 'Mixed', desc: 'Full Test', icon: '★', full: true }
                ].map((mode: any) => (
                  <motion.button
                    key={mode.id}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startQuiz(mode.id)}
                    className={`
                            relative overflow-hidden rounded-3xl p-6 text-left transition-all shadow-xl
                            ${mode.full
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-orange-500/30 ring-2 ring-orange-400/50'
                        : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 shadow-amber-900/5 hover:border-amber-400/50'
                      }
                        `}
                  >
                    <div className={`text-4xl font-bold mb-4 opacity-20 ${mode.full ? 'text-white' : 'text-amber-900'}`}>
                      {mode.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-1">{mode.label}</h3>
                      <p className={`text-sm ${mode.full ? 'text-white/80' : 'text-muted-foreground'}`}>{mode.desc}</p>
                    </div>
                    <div className={`absolute bottom-4 right-4 p-2 rounded-full ${mode.full ? 'bg-white/20' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                      <Play className={`w-4 h-4 ${mode.full ? 'fill-white text-white' : 'fill-amber-600 text-amber-600'}`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* VIEW: ACTIVE QUIZ */}
          {started && !quizOver && current && (
            <motion.div
              key="question-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm md:max-w-3xl flex flex-col md:flex-row items-center gap-8 md:gap-16"
            >
              {/* Visual Card Side */}
              <div className="flex-1 w-full relative group">
                <div className="absolute inset-0 bg-amber-400/30 rounded-[3rem] blur-2xl transform group-hover:scale-105 transition-transform duration-700 opacity-60" />
                <motion.div
                  key={current.correct}
                  initial={{ rotateY: -10, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 10, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/40 shadow-2xl shadow-amber-900/10 rounded-[2.5rem] p-12 aspect-square flex items-center justify-center overflow-hidden"
                >
                  {current.imageSrc && (
                    <img
                      src={current.imageSrc}
                      alt="Identify this character"
                      className="w-full h-full object-contain filter drop-shadow-xl transform transition-transform group-hover:scale-110 duration-500"
                    />
                  )}
                  <div className="absolute bottom-6 text-sm font-semibold tracking-widest uppercase text-amber-900/40 dark:text-amber-100/40">
                    Identify
                  </div>
                </motion.div>
              </div>

              {/* Options Side */}
              <div className="flex-1 w-full space-y-8">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-amber-950 dark:text-amber-50">What is this?</h2>
                  <p className="text-amber-800/60 dark:text-amber-200/60">Select the correct matching sound.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {current.options.map((opt) => {
                    const isSelected = selected === opt;
                    const isCorrect = opt === current.correct;
                    const state = showAnswer
                      ? isCorrect ? 'correct' : isSelected ? 'wrong' : 'dim'
                      : 'default';

                    return (
                      <motion.button
                        key={opt}
                        disabled={showAnswer}
                        onClick={() => handleAnswer(opt)}
                        whileHover={!showAnswer ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!showAnswer ? { scale: 0.98 } : {}}
                        className={`
                                        h-20 rounded-2xl text-2xl font-bold shadow-lg transition-all duration-300 relative overflow-hidden border-2
                                        ${state === 'default' ? 'bg-white dark:bg-zinc-800 border-white/50 text-amber-950 dark:text-amber-50 hover:border-amber-400 hover:shadow-orange-200/50' : ''}
                                        ${state === 'correct' ? 'bg-green-500 border-green-400 text-white shadow-green-500/40 scale-105 z-10' : ''}
                                        ${state === 'wrong' ? 'bg-red-500 border-red-400 text-white shadow-red-500/40 shake' : ''}
                                        ${state === 'dim' ? 'bg-gray-100 dark:bg-zinc-900 text-gray-400 border-transparent opacity-50 blur-[1px]' : ''}
                                    `}
                      >
                        <span className="relative z-10">{opt}</span>
                        {/* Particle burst could go here */}
                        {state === 'correct' && (
                          <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1.5 }}
                            className="absolute inset-0 bg-white/20 rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: RESULTS */}
          {started && quizOver && (
            <motion.div
              key="result-screen"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl p-12 rounded-[3rem] shadow-2xl text-center max-w-md w-full border border-white/50 relative overflow-hidden"
            >
              {/* Victory Burst Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 animate-pulse pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-lg shadow-orange-500/40 mb-8 mx-auto">
                  <Trophy className="w-12 h-12 text-white" />
                </div>

                <h2 className="text-4xl font-black mb-2 text-amber-950 dark:text-amber-50">Score: {score}</h2>
                <div className="flex justify-center items-center gap-2 mb-8 text-amber-700 dark:text-amber-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium text-lg">Amazing Effort!</span>
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <p className="text-xs uppercase font-bold text-amber-500 mb-1">Total</p>
                    <p className="text-2xl font-bold">{TOTAL_QUESTIONS}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-2xl border border-amber-100 dark:border-amber-800">
                    <p className="text-xs uppercase font-bold text-amber-500 mb-1">Streak</p>
                    <p className="text-2xl font-bold">{streak}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => startQuiz(category)} className="w-full h-14 text-lg rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-orange-500/20">
                    <RotateCcw className="w-5 h-5 mr-2" /> Play Again
                  </Button>
                  <Button variant="ghost" onClick={() => setStarted(false)} className="w-full h-14 text-base rounded-2xl text-amber-800 hover:bg-amber-100/50">
                    Back to Menu
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Quiz;
