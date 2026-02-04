import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Gamepad2, Heart, Zap, Play, Check, X, ArrowRight } from "lucide-react";
import { vowelAudio, consonantAudio } from "@/data/tuluLetterAudio";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

// ----- CONFIG -----
const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 10;

// ----- DATA MODEL -----
type Item = {
  id: string;
  letter: string;
  transliteration: string;
  imageFile?: string;
  kind: "vowel" | "consonant" | "number";
};

// Image Maps (Same as before)
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

        // Game over trigger handled by render logic
        setIndex(i => i + 1);
      }
    }, 1200);
  };

  const quizOver = started && (index >= questions.length || lives <= 0);
  const current = questions[index];

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center">

      {/* HEADER */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 max-w-2xl"
      >
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 inline-block">
          Tulu Mastery
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient">Tulu Lipi Challenge</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Master the ancient script through play. Keep your streak alive!
        </p>
      </motion.div>

      {/* VIEW: START SCREEN */}
      {!started && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-4xl grid md:grid-cols-2 gap-8"
        >
          <div className="glass-panel rounded-3xl p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-primary" /> How to Play
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Answer quickly</h3>
                  <p className="text-sm text-muted-foreground">Select the correct transliteration for the Tulu character.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold">Watch your lives</h3>
                  <p className="text-sm text-muted-foreground">You have {MAX_LIVES} lives. Wrong answers cost a heart.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">Choose Mode</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'vowels', label: 'Vowels', desc: 'Master Swaras' },
                { id: 'consonants', label: 'Consonants', desc: 'Learn Vyanjanas' },
                { id: 'numbers', label: 'Numbers', desc: 'Count in Tulu' },
                { id: 'hybrid', label: 'Mixed', desc: 'Full Challenge', full: true }
              ].map((mode: any) => (
                <button
                  key={mode.id}
                  onClick={() => startQuiz(mode.id)}
                  className={`
                                group relative overflow-hidden rounded-2xl p-4 text-left transition-all hover:scale-[1.02]
                                ${mode.full ? 'col-span-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-white dark:bg-zinc-900 border hover:border-primary/50'}
                            `}
                >
                  <span className="relative z-10 flex flex-col h-full justify-between">
                    <span className={`text-lg font-bold ${mode.full ? 'text-white' : 'text-foreground'}`}>{mode.label}</span>
                    <span className={`text-xs ${mode.full ? 'text-white/80' : 'text-muted-foreground'}`}>{mode.desc}</span>
                  </span>
                  <div className={`absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity ${mode.full ? 'text-white' : 'text-primary'}`}>
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* VIEW: ACTIVE QUIZ */}
      {started && !quizOver && current && (
        <div className="w-full max-w-2xl">
          {/* Stats Bar */}
          <div className="flex justify-between items-center mb-6 glass-card px-6 py-3 rounded-full">
            <div className="flex items-center gap-2 text-destructive font-bold">
              <Heart className="fill-current w-5 h-5" /> <span>{lives}</span>
            </div>
            <div className="flex-1 mx-8 relative h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(index / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-primary font-bold">
              <Trophy className="w-5 h-5" /> <span>{score}</span>
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={index}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-panel rounded-3xl p-8 md:p-12 mb-8 text-center"
          >
            <div className="mb-8 relative flex justify-center">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-50" />
              {current.imageSrc && (
                <img
                  src={current.imageSrc}
                  alt="Identify this character"
                  className="w-40 h-40 md:w-56 md:h-56 object-contain relative z-10 drop-shadow-2xl"
                />
              )}
            </div>

            <h3 className="text-xl font-medium text-muted-foreground mb-8">What symbol is this?</h3>

            <div className="grid grid-cols-2 gap-4">
              {current.options.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = opt === current.correct;
                const showState = showAnswer;

                let variantStyle = "bg-white dark:bg-zinc-800 hover:border-primary border-transparent";
                if (showState) {
                  if (isCorrect) variantStyle = "bg-green-500 text-white border-green-600 shadow-lg shadow-green-500/30";
                  else if (isSelected) variantStyle = "bg-red-500 text-white border-red-600";
                  else variantStyle = "opacity-50";
                }

                return (
                  <button
                    key={opt}
                    disabled={showAnswer}
                    onClick={() => handleAnswer(opt)}
                    className={`
                                    h-16 rounded-xl font-bold text-xl border-2 transition-all duration-200 transform
                                    ${variantStyle}
                                    ${!showAnswer && "active:scale-95 hover:-translate-y-1"}
                                `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* VIEW: RESULTS */}
      {started && quizOver && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel rounded-3xl p-12 max-w-lg w-full text-center"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-primary" />
          </div>

          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-8">You showed great mastery of Tulu Lipi.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-muted/50">
              <div className="text-sm text-muted-foreground uppercase text-xs font-bold tracking-wider">Score</div>
              <div className="text-3xl font-bold text-primary">{score}</div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/50">
              <div className="text-sm text-muted-foreground uppercase text-xs font-bold tracking-wider">Streak</div>
              <div className="text-3xl font-bold text-foreground">{streak}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStarted(false)}>
              Back Home
            </Button>
            <Button size="lg" className="flex-1 h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/25" onClick={() => startQuiz(category)}>
              Play Again
            </Button>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default Quiz;
