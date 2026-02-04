import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getAudioForLetter } from "@/data/tuluLetterAudio";
import WritingPractice from "./WritingPractice";

// ✅ Tulu Lipi letters
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

// ✅ NEW: Tulu Numbers
const numbers = [
  { letter: "೦", transliteration: "0", pronunciation: "zero", example: "೦ (sone)", image: "/images/Numbers/0.png" },
  { letter: "೧", transliteration: "1", pronunciation: "one", example: "೧ (Onji)", image: "/images/Numbers/1.png" },
  { letter: "೨", transliteration: "2", pronunciation: "two", example: "೨ (Rad)", image: "/images/Numbers/2.png" },
  { letter: "೩", transliteration: "3", pronunciation: "three", example: "೩ (Muji)", image: "/images/Numbers/3.png" },
  { letter: "೪", transliteration: "4", pronunciation: "four", example: "೪ (Nal)", image: "/images/Numbers/4.png" },
  { letter: "೫", transliteration: "5", pronunciation: "five", example: "೫ (Ain)", image: "/images/Numbers/5.png" },
  { letter: "೬", transliteration: "6", pronunciation: "six", example: "೬ (Aaji)", image: "/images/Numbers/6.png" },
  { letter: "೭", transliteration: "7", pronunciation: "seven", example: "೭ (Aelu)", image: "/images/Numbers/7.png" },
  { letter: "೮", transliteration: "8", pronunciation: "eight", example: "೮ (Yenuma)", image: "/images/Numbers/8.png" },
  { letter: "೯", transliteration: "9", pronunciation: "nine", example: "೯ (Orumba)", image: "/images/Numbers/9.png" },
  { letter: "೧೦", transliteration: "10", pronunciation: "ten", example: "೧೦ (Pth)", image: "/images/Numbers/10.png" },
  { letter: "೧೦೦", transliteration: "100", pronunciation: "hundred", example: "೧೦೦ (Nudhu)", image: "/images/Numbers/100.png" }
];

interface LetterCardProps {
  letter: string;
  transliteration: string;
  pronunciation: string;
  example: string;
  image?: string;
  isCompleted?: boolean;
  onPractice?: () => void;
}

const LetterCard = ({
  letter,
  transliteration,
  pronunciation,
  example,
  image,
  isCompleted,
  onPractice,
}: LetterCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const audioSrc = getAudioForLetter(letter);

  return (
    <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.2 }}>
      <Card
        className="p-6 hover:shadow-card transition-all duration-300 cursor-pointer bg-gradient-card border-border/50 relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isCompleted && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </motion.div>
        )}

        <div className="text-center">
          {image ? (
            <motion.img
              src={image}
              alt={letter}
              className="w-24 h-24 mx-auto mb-4 rounded-lg object-contain shadow-md"
              whileHover={{ scale: 1.05 }}
            />
          ) : (
            <motion.div
              className="text-6xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent"
              whileHover={{ scale: 1.1 }}
            >
              {letter}
            </motion.div>
          )}

          <div className="text-lg font-semibold text-foreground mb-2">{transliteration}</div>

          <Badge variant="secondary" className="mb-4">
            {pronunciation}
          </Badge>

          <div className="text-sm text-muted-foreground mb-4 min-h-[40px]">{example}</div>

          <div className="flex gap-2 justify-center mt-4">
            <AudioPlayer
              audioSrc={audioSrc || ""}
              letter={letter}
              variant="outline"
              size="sm"
              className="rounded-full border-primary/20 hover:bg-primary/5 text-primary"
            />
            <Button size="sm" variant="default" className="gap-2 rounded-full" onClick={onPractice}>
              <BookOpen className="w-4 h-4" />
              Practice
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const Learn = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedLetterData, setSelectedLetterData] = useState<{ letter: string; transliteration: string; image?: string } | null>(null);

  const totalItems = vowels.length + consonants.length + numbers.length;

  const handlePracticeClick = (letter: string) => {
    setSelectedLetter(letter);
    // Find the letter data
    const allLetters = [...vowels, ...consonants, ...numbers];
    const letterData = allLetters.find(l => l.letter === letter);
    if (letterData) {
      setSelectedLetterData({
        letter: letterData.letter,
        transliteration: letterData.transliteration,
        image: letterData.image,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-12 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-700 drop-shadow-sm">
            Learn Tulu Lipi
          </h1>
          <p className="text-muted-foreground text-lg">
            Master the beautiful Tulu script letter by letter. Click "Practice" to trace and learn.
          </p>
        </div>
      </section>

      {/* Letters */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="vowels" className="w-full">
            <div className="flex justify-center mb-8">
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

            <TabsContent value="vowels">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vowels.map((vowel, i) => (
                  <LetterCard
                    key={i}
                    {...vowel}
                    isCompleted={i < 3}
                    onPractice={() => handlePracticeClick(vowel.letter)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="consonants">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {consonants.map((cons, i) => (
                  <LetterCard
                    key={i}
                    {...cons}
                    isCompleted={i < 2}
                    onPractice={() => handlePracticeClick(cons.letter)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="numbers">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {numbers.map((num, i) => (
                  <LetterCard
                    key={i}
                    {...num}
                    isCompleted={false}
                    onPractice={() => handlePracticeClick(num.letter)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ✅ Practice Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-2xl relative max-w-md w-full"
            >
              <button
                onClick={() => {
                  setSelectedLetter(null);
                  setSelectedLetterData(null);
                }}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                ✖
              </button>
              {selectedLetterData && (
                <WritingPractice
                  letter={selectedLetterData.letter}
                  image={selectedLetterData.image}
                  transliteration={selectedLetterData.transliteration}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-card shadow-card border-border/50">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-700 mb-2">
                5 / {totalItems}
              </div>
              <p className="text-muted-foreground mb-6">Items Learned</p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learn;