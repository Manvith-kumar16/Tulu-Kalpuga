import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Gamepad2, Heart, Zap } from "lucide-react";
import { vowelAudio, consonantAudio } from "@/data/tuluLetterAudio";

// ----- CONFIG -----
const TOTAL_QUESTIONS = 10;
const MAX_LIVES = 3;

// ----- DATA MODEL -----
type Item = {
  id: string;
  letter: string; // actual Tulu letter character (or numeral)
  transliteration: string; // Latin transliteration label for options
  imageFile?: string; // path under public/
  kind: "vowel" | "consonant" | "number";
};

// Minimal mapping from transliteration -> image file name in public/images
const vowelImageMap: Record<string, string> = {
  "a": "/images/Vowels/a.png",
  "ā": "/images/Vowels/AA.png",
  "i": "/images/Vowels/i.png",
  "ī": "/images/Vowels/ii.png",
  "u": "/images/Vowels/u.png",
  "ū": "/images/Vowels/uu.png",
  "e": "/images/Vowels/e.png",
  "ē": "/images/Vowels/ee.png",
  "ai": "/images/Vowels/Ai.png",
  "o": "/images/Vowels/o.png",
  "ō": "/images/Vowels/oo.png",
};

const consonantImageMap: Record<string, string> = {
  "ka": "/images/Consonants/ka.png",
  "kha": "/images/Consonants/kha.png",
  "ga": "/images/Consonants/ga.png",
  "gha": "/images/Consonants/gha.png",
  "cha": "/images/Consonants/cha.png",
  "ja": "/images/Consonants/ja.png",
  "ta": "/images/Consonants/ta.png",
  "taa": "/images/Consonants/taa.png",
  "da": "/images/Consonants/da.png",
  "daa": "/images/Consonants/daa.png",
  "dha": "/images/Consonants/dha.png",
  "dhaa": "/images/Consonants/dhaa.png",
  "pa": "/images/Consonants/Pa.png",
  "pha": "/images/Consonants/pha.png",
  "ba": "/images/Consonants/Ba.png",
  "bha": "/images/Consonants/Bha.png",
  "ma": "/images/Consonants/Ma.png",
  "ya": "/images/Consonants/Ya.png",
  "ra": "/images/Consonants/Ra.png",
  "la": "/images/Consonants/La.png",
  "ḷa": "/images/Consonants/LLa.png",
  "va": "/images/Consonants/Va.png",
  "sha": "/images/Consonants/Sha.png",
  "ṣha": "/images/Consonants/SHha.png",
  "sa": "/images/Consonants/Sa.png",
  "ha": "/images/Consonants/Ha.png",
  "na": "/images/Consonants/Na.png",
  "ṅa": "/images/Consonants/nga.png",
  "ña": "/images/Consonants/nya.png",
  "r̥a": "/images/Consonants/raa.png",
  "l̥a": "/images/Consonants/laa.png",
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

// Build items from existing data, attaching images and keeping the actual Tulu letter
const vowelItems: Item[] = vowelAudio.map((v, idx) => ({
  id: `v_${idx}_${v.transliteration}`,
  letter: v.letter,
  transliteration: v.transliteration,
  imageFile: vowelImageMap[v.transliteration],
  kind: "vowel",
})).filter(v => !!v.imageFile);

const consonantItems: Item[] = consonantAudio.map((c, idx) => ({
  id: `c_${idx}_${c.transliteration}`,
  letter: c.letter,
  transliteration: c.transliteration,
  imageFile: consonantImageMap[c.transliteration],
  kind: "consonant",
})).filter(c => !!c.imageFile);

const allItems = [...vowelItems, ...consonantItems, ...numberItems];

// ----- Helpers -----
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickN<T>(arr: T[], n: number, exclude?: (t: T) => boolean): T[] {
  const pool = exclude ? arr.filter(a => !exclude(a)) : [...arr];
  return shuffle(pool).slice(0, n);
}

// Question shape
type Question = {
  prompt: string;
  correct: string; // will hold the correct transliteration
  options: string[]; // transliteration options
  displayLetter?: string; // actual Tulu letter character to show
  imageSrc?: string; // image representing the letter
};

// Main component accepts optional category prop (supports 'hybrid' and legacy 'mixed')
const Quiz: React.FC<{ category?: "vowels" | "consonants" | "numbers" | "mixed" | "hybrid" }> = ({ category = "hybrid" }) => {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const initialCategory: "vowels" | "consonants" | "numbers" | "hybrid" = (category === "mixed" ? "hybrid" : (category as any));
  const [selectedCategory, setSelectedCategory] = useState<"vowels" | "consonants" | "numbers" | "hybrid">(initialCategory);

  // Filter items by selected category
  const items = useMemo(() => {
    if (selectedCategory === "vowels") return vowelItems;
    if (selectedCategory === "consonants") return consonantItems;
    if (selectedCategory === "numbers") return numberItems;
    return allItems; // hybrid (or legacy mixed)
  }, [selectedCategory]);

  const buildQuestions = (pool: Item[]): Question[] => {
    const base = shuffle(pool);
    const qs: Question[] = [];

    for (let i = 0; i < Math.min(TOTAL_QUESTIONS, base.length); i++) {
      const it = base[i];

      // Image-based question: show the Tulu letter (text) and its image, ask for transliteration
      const distractors = pickN(pool, 3, a => a.transliteration === it.transliteration).map(d => d.transliteration);
      const options = shuffle([it.transliteration, ...distractors]);
      qs.push({
        prompt: "Which transliteration matches this Tulu letter image?",
        correct: it.transliteration,
        options,
        imageSrc: it.imageFile,
      });
    }

    return qs;
  };

  const startQuiz = () => {
    setQuestions(buildQuestions(items));
    setStarted(true);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setLives(MAX_LIVES);
    setSelected(null);
    setShowAnswer(false);
  };

  const current = questions[index];
  const quizOver = started && (index >= questions.length || lives <= 0);

  const handleAnswer = (choice: string | null) => {
    if (!current) return;

    const isCorrect = choice === current.correct;
    setSelected(choice);
    setShowAnswer(true);

    if (isCorrect) {
      const base = 10;
      const bonus = streak >= 2 ? 5 : 0;
      setScore(s => s + base + bonus);
      setStreak(s => s + 1);
    } else {
      setLives(l => l - 1);
      setStreak(0);
    }

    setTimeout(() => {
      setSelected(null);
      setShowAnswer(false);
      setIndex(i => i + 1);
    }, 900);
  };

  // Progress value (0..100)
  const progressValue = ((index) / TOTAL_QUESTIONS) * 100;

  // Render helper for Tulu glyphs — wrap letters in a font container
  const Glyph: React.FC<{ k: string; large?: boolean }> = ({ k, large = false }) => (
    <span className={`font-tulu ${large ? "text-4xl" : "text-xl"} select-none`} aria-hidden>
      {k}
    </span>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">Tulu Lipi Quiz</h1>
            <p className="text-muted-foreground">Practice letters from the selected category. No timer — relaxed learning.</p>
          </div>

          {!started && (
            <Card className="p-8 text-center bg-gradient-card shadow-card border-border/50 animate-scale-in">
              <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Gamepad2 className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">How it works</h2>
              <ul className="text-muted-foreground mb-6 space-y-1 text-sm">
                <li>• {TOTAL_QUESTIONS} questions from your chosen category</li>
                <li>• No timer — take your time</li>
                <li>• {MAX_LIVES} hearts — wrong answers cost a heart</li>
                <li>• Streaks give bonus points</li>
              </ul>

              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button variant={selectedCategory === "vowels" ? "default" : "outline"} onClick={() => setSelectedCategory("vowels")}>Vowels</Button>
                  <Button variant={selectedCategory === "consonants" ? "default" : "outline"} onClick={() => setSelectedCategory("consonants")}>Consonants</Button>
                  <Button variant={selectedCategory === "numbers" ? "default" : "outline"} onClick={() => setSelectedCategory("numbers")}>Numbers</Button>
                  <Button variant={selectedCategory === "hybrid" ? "default" : "outline"} onClick={() => setSelectedCategory("hybrid")}>Hybrid</Button>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="topic-select" className="text-sm text-muted-foreground">Or pick topic:</label>
                  <select
                    id="topic-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="px-3 py-2 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="vowels">Vowels</option>
                    <option value="consonants">Consonants</option>
                    <option value="numbers">Numbers</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <Button variant="hero" size="lg" onClick={startQuiz}><Trophy className="w-5 h-5" /> Start Quiz</Button>
              </div>
            </Card>
          )}

          {started && !quizOver && current && (
            <div className="space-y-4 animate-fade-in">
              <Card className="p-4 bg-gradient-card border-border/50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-destructive animate-pulse" />
                    <span className="font-medium">{lives}</span>
                  </div>

                  <div className="flex-1 max-w-sm">
                    <Progress value={progressValue} />
                    <div className="text-xs text-muted-foreground mt-1 text-center">Question {Math.min(index + 1, TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-medium">Streak {streak}</span>
                  </div>

                  <div className="text-sm font-semibold">Score: <span className="text-foreground">{score}</span></div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-card shadow-card border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{current.prompt}</h3>
                  <Badge variant="secondary">{selectedCategory === "vowels" ? "Vowels" : selectedCategory === "consonants" ? "Consonants" : selectedCategory === "numbers" ? "Numbers" : "Hybrid"}</Badge>
                </div>


                {current.imageSrc && (
                  <div className="text-center mb-4">
                    <div className="inline-flex flex-col items-center justify-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={current.imageSrc} alt="Tulu letter" className="w-28 h-28 object-contain rounded-xl bg-muted/20" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {current.options.map((opt) => {
                    const isCorrect = showAnswer && opt === current.correct;
                    const isWrong = showAnswer && selected === opt && selected !== current.correct;

                    return (
                      <Button
                        key={opt}
                        variant={(isCorrect || isWrong) ? "default" : "outline"}
                        className={`h-14 text-base rounded-xl font-semibold transition-all duration-300 transform
                          hover:scale-[1.04] hover:shadow-[0_10px_30px_rgba(255,140,0,0.18)]
                          ${isCorrect ? "bg-emerald-500 text-white scale-[1.06] shadow-[0_0_30px_rgba(16,185,129,0.45)] animate-pulse border-0" : ""}
                          ${isWrong ? "bg-rose-500 text-white scale-[1.02] shadow-[0_0_30px_rgba(244,63,94,0.45)] animate-pulse border-0" : ""}`}
                        onClick={() => !showAnswer && handleAnswer(opt)}
                        disabled={showAnswer}
                      >
                        <span>{opt}</span>
                      </Button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div />
                  <div className="text-sm text-muted-foreground">Tip: look at the shape of the letter and relate it to the transliteration</div>
                </div>
              </Card>
            </div>
          )}

          {started && quizOver && (
            <Card className="p-10 text-center bg-gradient-card shadow-card border-border/50 animate-scale-in">
              <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Trophy className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground mb-6">You scored <span className="font-semibold text-foreground">{score}</span> points.</p>
              <div className="flex items-center justify-center gap-3 mb-6">
                <Badge variant="secondary">Best Streak: {streak}</Badge>
                <Badge variant="secondary">Lives Left: {Math.max(lives, 0)}</Badge>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button variant="default" onClick={startQuiz}>Play Again</Button>
                <Button variant="outline" onClick={() => setStarted(false)}>Back</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
