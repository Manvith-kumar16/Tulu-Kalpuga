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
  { letter: "ಅ", transliteration: "a", pronunciation: "a", example: "ಅಮ್ಮ (Mother)", image: "/images/Vowels/a.png" },
  { letter: "ಆ", transliteration: "ā", pronunciation: "aa", example: "ಆಕಾಶ (Sky)", image: "/images/Vowels/AA.png" },
  { letter: "ಇ", transliteration: "i", pronunciation: "i", example: "ಇಲ್ಲಿ (Here)", image: "/images/Vowels/i.png" },
  { letter: "ಈ", transliteration: "ī", pronunciation: "ee", example: "ಈಜು (Swim)", image: "/images/Vowels/ii.png" },
  { letter: "ಉ", transliteration: "u", pronunciation: "u", example: "ಉಪ್ಪು (Salt)", image: "/images/Vowels/u.png" },
  { letter: "ಊ", transliteration: "ū", pronunciation: "oo", example: "ಊರು (Village)", image: "/images/Vowels/uu.png" },
  { letter: "ಋ", transliteration: "ṛ", pronunciation: "ri", example: "ಋತು (Season)", image: "/images/Vowels/r.png" },
  { letter: "ಎ", transliteration: "e", pronunciation: "e", example: "ಎಲೆ (Leaf)", image: "/images/Vowels/e.png" },
  { letter: "ಏ", transliteration: "ē", pronunciation: "ay", example: "ಏನು (What)", image: "/images/Vowels/ee.png" },
  { letter: "ಐ", transliteration: "ai", pronunciation: "ai", example: "ಐದು (Five)", image: "/images/Vowels/Ai.png" },
  { letter: "ಒ", transliteration: "o", pronunciation: "o", example: "ಒಳ್ಳೆ (Good)", image: "/images/Vowels/o.png" },
  { letter: "ಓ", transliteration: "ō", pronunciation: "oh", example: "ಓಟ (Run)", image: "/images/Vowels/oo.png" },
  { letter: "ಔ", transliteration: "au", pronunciation: "ow", example: "ಔಷಧಿ (Medicine)", image: "/images/Vowels/au.png" },
];

const consonants = [ { letter: "ಕ", transliteration: "ka", pronunciation: "ka", example: "ಕಣ್ಣು (Eye)",image: "/images/Consonants/ka.png" }, { letter: "ಖ", transliteration: "kha", pronunciation: "kha", example: "ಖತ್ರಿ (Danger)",image: "/images/Consonants/kha.png" }, { letter: "ಗ", transliteration: "ga", pronunciation: "ga", example: "ಗಾಳಿ (Wind)",image: "/images/Consonants/ga.png" }, { letter: "ಘ", transliteration: "gha", pronunciation: "gha", example: "ಘಟನೆ (Event)" ,image: "/images/Consonants/gha.png" }, { letter: "ಙ", transliteration: "ṅa", pronunciation: "nga", example: "ಅಂಗ (Part)", image: "/images/Consonants/nga.png" }, { letter: "ಚ", transliteration: "cha", pronunciation: "cha", example: "ಚಂದ್ರ (Moon)",image: "/images/Consonants/ca.png" }, { letter: "ಛ", transliteration: "chha", pronunciation: "chha", example: "ಛಾಯಾ (Shadow)" ,image: "/images/Consonants/cha.png"}, { letter: "ಜ", transliteration: "ja", pronunciation: "ja", example: "ಜಲ (Water)" ,image: "/images/Consonants/ja.png"}, { letter: "ಝ", transliteration: "jha", pronunciation: "jha", example: "ಝರಿ (Waterfall)",image: "/images/Consonants/jha.png" }, { letter: "ಞ", transliteration: "ña", pronunciation: "nya", example: "ಜ್ಞಾನ (Knowledge)", image: "/images/Consonants/nya.png" }, { letter: "ಟ", transliteration: "ṭa", pronunciation: "ta", example: "ಟೊಕ್ಕು (Top)", image: "/images/Consonants/ta.png" }, { letter: "ಠ", transliteration: "ṭha", pronunciation: "tha", example: "ಠೇವಣಿ (Deposit)", image: "/images/Consonants/taa.png" }, { letter: "ಡ", transliteration: "ḍa", pronunciation: "da", example: "ಡಬ್ಬಿ (Box)", image: "/images/Consonants/da.png" }, { letter: "ಢ", transliteration: "ḍha", pronunciation: "dha", example: "ಢಾಣಿ (Shield)" , image: "/images/Consonants/daa.png"}, { letter: "ಣ", transliteration: "ṇa", pronunciation: "na", example: "ಮಣಿಯ (Jewel)", image: "/images/Consonants/na1.png" }, { letter: "ತ", transliteration: "ta", pronunciation: "tha", example: "ತರಕಾರಿ (Vegetable)", image: "/images/Consonants/tha.png" }, { letter: "ಥ", transliteration: "tha", pronunciation: "ttha", example: "ಥಂಡ (Cold)", image: "/images/Consonants/thaa.png" }, { letter: "ದ", transliteration: "da", pronunciation: "da", example: "ದೀಪ (Lamp)", image: "/images/Consonants/dha.png" }, { letter: "ಧ", transliteration: "dha", pronunciation: "dha", example: "ಧನುಷ್ (Bow)", image: "/images/Consonants/dhaa.png" }, { letter: "ನ", transliteration: "na", pronunciation: "na", example: "ನದಿ (River)", image: "/images/Consonants/Na.png" }, { letter: "ಪ", transliteration: "pa", pronunciation: "pa", example: "ಪತ್ರ (Letter)", image: "/images/Consonants/Pa.png" }, { letter: "ಫ", transliteration: "pha", pronunciation: "pha", example: "ಫಲ (Fruit)", image: "/images/Consonants/pha.png" }, { letter: "ಬ", transliteration: "ba", pronunciation: "ba", example: "ಬಳ್ಳಿ (Creeper)", image: "/images/Consonants/Ba.png" }, { letter: "ಭ", transliteration: "bha", pronunciation: "bha", example: "ಭೂಮಿ (Earth)", image: "/images/Consonants/Bha.png" }, { letter: "ಮ", transliteration: "ma", pronunciation: "ma", example: "ಮನೆ (House)", image: "/images/Consonants/Ma.png" }, { letter: "ಯ", transliteration: "ya", pronunciation: "ya", example: "ಯಾನ (Vehicle)", image: "/images/Consonants/Ya.png" }, { letter: "ರ", transliteration: "ra", pronunciation: "ra", example: "ರಾತ್ರಿ (Night)", image: "/images/Consonants/Ra.png" }, { letter: "ಲ", transliteration: "la", pronunciation: "la", example: "ಲೋಟ (Cup)", image: "/images/Consonants/La.png" }, { letter: "ವ", transliteration: "va", pronunciation: "va", example: "ವನ (Forest)", image: "/images/Consonants/Va.png" }, { letter: "ಶ", transliteration: "śa", pronunciation: "sha", example: "ಶಕ್ತಿ (Power)", image: "/images/Consonants/Sha.png" }, { letter: "ಷ", transliteration: "ṣa", pronunciation: "shha", example: "ಷಟ್ಕೋಣ (Hexagon)", image: "/images/Consonants/SHha.png" }, { letter: "ಸ", transliteration: "sa", pronunciation: "sa", example: "ಸಮುದ್ರ (Sea)", image: "/images/Consonants/Sa.png" }, { letter: "ಹ", transliteration: "ha", pronunciation: "ha", example: "ಹಣ್ಣು (Fruit)", image: "/images/Consonants/Ha.png" }, { letter: "ಳ", transliteration: "ḷa", pronunciation: "la", example: "ಬೆಳ್ಳುಳ್ಳಿ (Garlic)", image: "/images/Consonants/LLa.png" }, { letter: "ಕ್ಷ", transliteration: "kṣa", pronunciation: "ksha", example: "ಕ್ಷಮೆ (Forgive)", image: "/images/Consonants/Ksha.png" }, { letter: "ಜ್ಞ", transliteration: "jña", pronunciation: "gya", example: "ಜ್ಞಾನ (Wisdom)", image: "/images/Consonants/ya.png" } ];

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

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-2 justify-center"
              >
                {audioSrc && (
                  <AudioPlayer audioSrc={audioSrc} letter={letter} variant="outline" size="sm" />
                )}
                <Button size="sm" variant="default" className="gap-2" onClick={onPractice}>
                  <BookOpen className="w-4 h-4" />
                  Practice
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

const Learn = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-12 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Learn Tulu Lipi
          </h1>
          <p className="text-muted-foreground text-lg">
            Master the beautiful Tulu script letter by letter. Click “Practice” to trace and learn.
          </p>
        </div>
      </section>

      {/* Letters */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="vowels" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="vowels" className="gap-2">
                  <span>Vowels</span>
                  <Badge variant="secondary">{vowels.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="consonants" className="gap-2">
                  <span>Consonants</span>
                  <Badge variant="secondary">{consonants.length}</Badge>
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
                    onPractice={() => setSelectedLetter(vowel.letter)}
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
                    onPractice={() => setSelectedLetter(cons.letter)}
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
                onClick={() => setSelectedLetter(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                ✖
              </button>
              <WritingPractice
                letter={selectedLetter}
                image={`/images/Vowels/${selectedLetter}.png`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-card shadow-card border-border/50">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                5 / {vowels.length + consonants.length}
              </div>
              <p className="text-muted-foreground mb-6">Letters Learned</p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learn;
