import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Pen, Volume2, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getAudioForLetter } from "@/data/tuluLetterAudio";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import WritingPractice from "./WritingPractice";
import { api } from "@/services/api";
import { letterToTransliteration } from "@/data/tuluLetters";


// ✅ Practice data
const vowels = [
  { letter: "ಅ", transliteration: "a", pronunciation: "a", example: "ಅರಿ", image: "/images/Vowels/a.png" },
  { letter: "ಆ", transliteration: "ā", pronunciation: "aa", example: "ಆಜಾ", image: "/images/Vowels/aa.png" },
  { letter: "ಇ", transliteration: "i", pronunciation: "i", example: "ಇಲೆ", image: "/images/Vowels/i.png" },
  { letter: "ಈ", transliteration: "ī", pronunciation: "ii", example: "ಈದು", image: "/images/Vowels/ii.png" },
  { letter: "ಉ", transliteration: "u", pronunciation: "u", example: "ಉಲೆ", image: "/images/Vowels/u.png" },
  { letter: "ಊ", transliteration: "ū", pronunciation: "uu", example: "ಊಡ", image: "/images/Vowels/uu.png" },
  { letter: "ಋ", transliteration: "ṛ", pronunciation: "r", example: "ಋಷಿ", image: "/images/Vowels/r.png" },
  { letter: "ೠ", transliteration: "ṝ", pronunciation: "rr", example: "ೠಕ್ಷ", image: "/images/Vowels/rr.png" },
  { letter: "ಎ", transliteration: "e", pronunciation: "e", example: "ಎರು", image: "/images/Vowels/e.png" },
  { letter: "ಏ", transliteration: "ē", pronunciation: "ee", example: "ಏಳು", image: "/images/Vowels/ee.png" },
  { letter: "ಎೕ", transliteration: "ē", pronunciation: "e_", example: "ಏಕ್ಕಲೆ", image: "/images/Vowels/e_.png" },
  { letter: "ಏೕ", transliteration: "ē̄", pronunciation: "ee_", example: "ಏಲ", image: "/images/Vowels/ee_.png" },
  { letter: "ಐ", transliteration: "ai", pronunciation: "ai", example: "ಐನು", image: "/images/Vowels/ai.png" },
  { letter: "ಒ", transliteration: "o", pronunciation: "o", example: "ಒಡು", image: "/images/Vowels/o.png" },
  { letter: "ಓ", transliteration: "ō", pronunciation: "oo", example: "ಓಲು", image: "/images/Vowels/oo.png" },
  { letter: "ಔ", transliteration: "au", pronunciation: "au", example: "ಔಗು", image: "/images/Vowels/au.png" },
  { letter: "ಅಂ", transliteration: "aṃ", pronunciation: "am", example: "ಅಂಬಟೆ", image: "/images/Vowels/am.png" },
  { letter: "ಅಃ", transliteration: "aḥ", pronunciation: "ah", example: "ಅಃ", image: "/images/Vowels/ah.png" }
];

const consonants = [
  { letter: "ಕ", transliteration: "ka", pronunciation: "ka", example: "ಕರ (Hand)", image: "/images/Consonants/ka.png" },
  { letter: "ಖ", transliteration: "kha", pronunciation: "kha", example: "ಖಡ್ಗ (Sword)", image: "/images/Consonants/kha.png" },
  { letter: "ಗ", transliteration: "ga", pronunciation: "ga", example: "ಗಗ್ಗರ (Anklet)", image: "/images/Consonants/ga.png" },
  { letter: "ಘ", transliteration: "gha", pronunciation: "gha", example: "ಘಟ (Pot)", image: "/images/Consonants/gha.png" },
  { letter: "ಙ", transliteration: "ṅa", pronunciation: "nga", example: "ಬಣ್ಣ (Colour)", image: "/images/Consonants/nga.png" },
  { letter: "ಚ", transliteration: "ca", pronunciation: "cha", example: "ಚಿಲುಮೆ (Squirrel)", image: "/images/Consonants/ca.png" },
  { letter: "ಛ", transliteration: "cha", pronunciation: "chha", example: "ಛತ್ರ (Umbrella)", image: "/images/Consonants/cha.png" },
  { letter: "ಜ", transliteration: "ja", pronunciation: "ja", example: "ಜಪಮಾಲೆ (Rosary)", image: "/images/Consonants/ja.png" },
  { letter: "ಝ", transliteration: "jha", pronunciation: "jha", example: "ಝರಿ (Drum)", image: "/images/Consonants/jha.png" },
  { letter: "ಞ", transliteration: "ña", pronunciation: "nya", example: "ಞಾ (Letter)", image: "/images/Consonants/nya.png" },
  { letter: "ಟ", transliteration: "ṭa", pronunciation: "ta", example: "ಟಪಾಲು (Post)", image: "/images/Consonants/ta.png" },
  { letter: "ಠ", transliteration: "ṭha", pronunciation: "ṭha", example: "ಠ (Sound)", image: "/images/Consonants/taa.png" },
  { letter: "ಡ", transliteration: "ḍa", pronunciation: "da", example: "ಡಬ್ಬಣ (Stick)", image: "/images/Consonants/da.png" },
  { letter: "ಢ", transliteration: "ḍha", pronunciation: "dha", example: "ಢಮರು (Drum)", image: "/images/Consonants/daa.png" },
  { letter: "ಣ", transliteration: "ṇa", pronunciation: "ṇa", example: "ಣ (Letter)", image: "/images/Consonants/na1.png" },
  { letter: "ತ", transliteration: "ta", pronunciation: "ta", example: "ತುಂಬು (Ant)", image: "/images/Consonants/tha.png" },
  { letter: "ಥ", transliteration: "tha", pronunciation: "tha", example: "ಥರ್ಮಾಸ್ (Thermos)", image: "/images/Consonants/thaa.png" },
  { letter: "ದ", transliteration: "da", pronunciation: "da", example: "ದಡಪಾಳೆ (Cactus)", image: "/images/Consonants/dha.png" },
  { letter: "ಧ", transliteration: "dha", pronunciation: "dha", example: "ಧ (Letter)", image: "/images/Consonants/dhaa.png" },
  { letter: "ನ", transliteration: "na", pronunciation: "na", example: "ನಕ್ಷೆ (Map)", image: "/images/Consonants/Na.png" },
  { letter: "ಪ", transliteration: "pa", pronunciation: "pa", example: "ಪಗಡಿ (Turban)", image: "/images/Consonants/Pa.png" },
  { letter: "ಫ", transliteration: "pha", pronunciation: "pha", example: "ಫಲ (Fruit)", image: "/images/Consonants/pha.png" },
  { letter: "ಬ", transliteration: "ba", pronunciation: "ba", example: "ಬಚ್ಚಿರೆ (Leaf)", image: "/images/Consonants/Ba.png" },
  { letter: "ಭ", transliteration: "bha", pronunciation: "bha", example: "ಭರಣಿ (Jar)", image: "/images/Consonants/Bha.png" },
  { letter: "ಮ", transliteration: "ma", pronunciation: "ma", example: "ಮಡಲು (Palm Leaf)", image: "/images/Consonants/Ma.png" },
  { letter: "ಯ", transliteration: "ya", pronunciation: "ya", example: "ಯಮ (God of Death)", image: "/images/Consonants/Ya.png" },
  { letter: "ರ", transliteration: "ra", pronunciation: "ra", example: "ರಾಕ್ಷಸ (Demon)", image: "/images/Consonants/Ra.png" },
  { letter: "ಲ", transliteration: "la", pronunciation: "la", example: "ಲತ್ತನೆ (Grass)", image: "/images/Consonants/La.png" },
  { letter: "ವ", transliteration: "va", pronunciation: "va", example: "ವನಸ (Vegetable)", image: "/images/Consonants/Va.png" },
  { letter: "ಶ", transliteration: "śa", pronunciation: "sha", example: "ಶರ್ಬತ್ (Juice)", image: "/images/Consonants/Sha.png" },
  { letter: "ಷ", transliteration: "ṣa", pronunciation: "ṣa", example: "ಷಣ್ಮುಖೆ (Ṣaṇmukhe)", image: "/images/Consonants/SHha.png" },
  { letter: "ಸ", transliteration: "sa", pronunciation: "sa", example: "ಸರಪೋಲಿ (Chain)", image: "/images/Consonants/Sa.png" },
  { letter: "ಹ", transliteration: "ha", pronunciation: "ha", example: "ಹ (Letter)", image: "/images/Consonants/Ha.png" },
  { letter: "ಳ", transliteration: "ḷa", pronunciation: "ḷa", example: "ಳ (Letter)", image: "/images/Consonants/LLa.png" },
  { letter: "ೞ", transliteration: "ṟa", pronunciation: "ṟa", example: "ೞ (Letter)", image: "/images/Consonants/raa.png" },
  { letter: "ಱ", transliteration: "ḻa", pronunciation: "ḻa", example: "ḻ (Letter)", image: "/images/Consonants/laa.png" }
];

const numbers = [
  { letter: "೦", transliteration: "0", pronunciation: "zero", example: "೦ (Zero)", image: "/images/Numbers/0.png" },
  { letter: "೧", transliteration: "1", pronunciation: "one", example: "೧ (One)", image: "/images/Numbers/1.png" },
  { letter: "೨", transliteration: "2", pronunciation: "two", example: "೨ (Two)", image: "/images/Numbers/2.png" },
  { letter: "೩", transliteration: "3", pronunciation: "three", example: "೩ (Three)", image: "/images/Numbers/3.png" },
  { letter: "೪", transliteration: "4", pronunciation: "four", example: "೪ (Four)", image: "/images/Numbers/4.png" },
  { letter: "೫", transliteration: "5", pronunciation: "five", example: "೫ (Five)", image: "/images/Numbers/5.png" },
  { letter: "೬", transliteration: "6", pronunciation: "six", example: "೬ (Six)", image: "/images/Numbers/6.png" },
  { letter: "೭", transliteration: "7", pronunciation: "seven", example: "೭ (Seven)", image: "/images/Numbers/7.png" },
  { letter: "೮", transliteration: "8", pronunciation: "eight", example: "೮ (Eight)", image: "/images/Numbers/8.png" },
  { letter: "೯", transliteration: "9", pronunciation: "nine", example: "೯ (Nine)", image: "/images/Numbers/9.png" }
];

const Practice = () => {
  const [selectedCategory, setSelectedCategory] = useState<"vowels" | "consonants" | "numbers">("vowels");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPractice, setShowPractice] = useState(false);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  // Get current items based on category
  const getCurrentItems = () => {
    switch (selectedCategory) {
      case "vowels":
        return vowels;
      case "consonants":
        return consonants;
      case "numbers":
        return numbers;
      default:
        return vowels;
    }
  };

  const currentItems = getCurrentItems();
  const currentLetter = currentItems[currentIndex];
  const audioSrc = getAudioForLetter(currentLetter.letter);

  const handleNext = () => {
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowPractice(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowPractice(false);
    }
  };

  const handleCategoryChange = (category: "vowels" | "consonants" | "numbers") => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setShowPractice(false);
  };

  const markAsCompleted = async () => {
    setCompletedItems(prev => new Set(prev).add(currentLetter.letter));
    try {
      await api.logLearn(currentLetter.letter);
    } catch (err) {
      console.error("Failed to log completion", err);
    }
  };

  const isCompleted = completedItems.has(currentLetter.letter);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-12 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-700 drop-shadow-sm">
            Practice Writing
          </h1>
          <p className="text-muted-foreground text-lg">
            Master your handwriting with interactive practice boards
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={(v) => handleCategoryChange(v as any)} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-2xl grid-cols-3">
                <TabsTrigger value="vowels" className="gap-2">
                  <span>Vowels</span>
                  <Badge variant="secondary">{vowels.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="consonants" className="gap-2">
                  <span>Consonants</span>
                  <Badge variant="secondary">{consonants.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="numbers" className="gap-2">
                  <span>Numbers</span>
                  <Badge variant="secondary">{numbers.length}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Progress: {currentIndex + 1} / {currentItems.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentIndex + 1) / currentItems.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-hero h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / currentItems.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Practice Area */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${currentIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 bg-gradient-card shadow-card border-border/50 mb-6">
                  <div className="text-center mb-8">
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-success/10 rounded-full"
                      >
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span className="text-success font-medium">Completed!</span>
                      </motion.div>
                    )}

                    <Badge variant="secondary" className="mb-4">
                      {selectedCategory === "vowels" && "Vowel"}
                      {selectedCategory === "consonants" && "Consonant"}
                      {selectedCategory === "numbers" && "Number"}
                    </Badge>

                    {currentLetter.image && (
                      <motion.img
                        src={currentLetter.image}
                        alt={currentLetter.letter}
                        className="w-48 h-48 mx-auto mb-6 rounded-lg object-contain shadow-md"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}





                    <div className="text-2xl font-semibold mb-2">{currentLetter.transliteration}</div>
                    <div className="text-lg text-muted-foreground mb-6">{currentLetter.example}</div>

                    <div className="flex gap-4 justify-center mb-6">
                      {audioSrc && (
                        <AudioPlayer
                          audioSrc={audioSrc}
                          letter={currentLetter.letter}
                          variant="default"
                          size="lg"
                        />
                      )}
                      <Button
                        variant={showPractice ? "secondary" : "hero"}
                        size="lg"
                        className="gap-2"
                        onClick={() => setShowPractice(!showPractice)}
                      >
                        <Pen className="w-5 h-5" />
                        {showPractice ? "Hide Practice" : "Start Practice"}
                      </Button>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                      </Button>

                      <Button
                        variant="success"
                        size="lg"
                        onClick={markAsCompleted}
                        disabled={isCompleted}
                        className="gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        {isCompleted ? "Completed" : "Mark Complete"}
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleNext}
                        disabled={currentIndex === currentItems.length - 1}
                        className="gap-2"
                      >
                        Next
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Practice Canvas */}
                  <AnimatePresence>
                    {showPractice && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-border pt-8 mt-8"
                      >
                        <WritingPractice
                          letter={currentLetter.letter}
                          image={currentLetter.image}
                          transliteration={letterToTransliteration[currentLetter.letter]}
                        />
                      
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* How to Practice Guide */}
                <Card className="p-6 bg-gradient-card shadow-card border-border/50">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    How to Practice
                  </h3>
                  <div className="grid gap-4 text-left">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Volume2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Listen</p>
                        <p className="text-sm text-muted-foreground">
                          Click the Listen button to hear the correct pronunciation
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Pen className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Practice</p>
                        <p className="text-sm text-muted-foreground">
                          Use the writing board to trace and practice the strokes
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Complete</p>
                        <p className="text-sm text-muted-foreground">
                          Mark as complete when you're confident with the letter
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-gradient-card shadow-card border-border/50">
              <div className="text-3xl font-bold text-red-700 mb-2">
                {completedItems.size}
              </div>
              <p className="text-muted-foreground">Items Completed</p>
            </Card>
            <Card className="p-6 text-center bg-gradient-card shadow-card border-border/50">
              <div className="text-3xl font-bold text-red-700 mb-2">
                {currentIndex + 1}
              </div>
              <p className="text-muted-foreground">Current Position</p>
            </Card>
            <Card className="p-6 text-center bg-gradient-card shadow-card border-border/50">
              <div className="text-3xl font-bold text-red-700 mb-2">
                {vowels.length + consonants.length + numbers.length}
              </div>
              <p className="text-muted-foreground">Total Items</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Practice;