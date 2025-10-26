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

// Sample Tulu Lipi data - In production, this would come from a database
const vowels = [
  { letter: "ಅ", transliteration: "a", pronunciation: "ah", example: "ಅಮ್ಮ (Mother)" },
  { letter: "ಆ", transliteration: "ā", pronunciation: "aa", example: "ಆಕಾಶ (Sky)" },
  { letter: "ಇ", transliteration: "i", pronunciation: "i", example: "ಇಲ್ಲಿ (Here)" },
  { letter: "ಈ", transliteration: "ī", pronunciation: "ee", example: "ಈಜು (Swim)" },
  { letter: "ಉ", transliteration: "u", pronunciation: "u", example: "ಉಪ್ಪು (Salt)" },
  { letter: "ಊ", transliteration: "ū", pronunciation: "oo", example: "ಊರು (Village)" },
  { letter: "ಎ", transliteration: "e", pronunciation: "e", example: "ಎಲೆ (Leaf)" },
  { letter: "ಏ", transliteration: "ē", pronunciation: "ay", example: "ಏನು (What)" },
  { letter: "ಒ", transliteration: "o", pronunciation: "o", example: "ಒಳ್ಳೆ (Good)" },
  { letter: "ಓ", transliteration: "ō", pronunciation: "oh", example: "ಓಟ (Run)" },
];

const consonants = [
  { letter: "ಕ", transliteration: "ka", pronunciation: "ka", example: "ಕಣ್ಣು (Eye)" },
  { letter: "ಖ", transliteration: "kha", pronunciation: "kha", example: "ಖತ್ರಿ (Danger)" },
  { letter: "ಗ", transliteration: "ga", pronunciation: "ga", example: "ಗಾಳಿ (Wind)" },
  { letter: "ಘ", transliteration: "gha", pronunciation: "gha", example: "ಘಟನೆ (Event)" },
  { letter: "ಚ", transliteration: "cha", pronunciation: "cha", example: "ಚಂದ್ರ (Moon)" },
  { letter: "ಛ", transliteration: "chha", pronunciation: "chha", example: "ಛಾಯಾ (Shadow)" },
  { letter: "ಜ", transliteration: "ja", pronunciation: "ja", example: "ಜಲ (Water)" },
  { letter: "ಝ", transliteration: "jha", pronunciation: "jha", example: "ಝರಿ (Waterfall)" },
  { letter: "ಟ", transliteration: "ṭa", pronunciation: "ta", example: "ಟೊಕ್ಕು (Top)" },
  { letter: "ಠ", transliteration: "ṭha", pronunciation: "tha", example: "ಠೇವಣಿ (Deposit)" },
  { letter: "ಡ", transliteration: "ḍa", pronunciation: "da", example: "ಡಬ್ಬಿ (Box)" },
  { letter: "ಢ", transliteration: "ḍha", pronunciation: "dha", example: "ಢಾಣಿ (Shield)" },
];

interface LetterCardProps {
  letter: string;
  transliteration: string;
  pronunciation: string;
  example: string;
  isCompleted?: boolean;
  onPractice?: () => void;
}

const LetterCard = ({ letter, transliteration, pronunciation, example, isCompleted, onPractice }: LetterCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const audioSrc = getAudioForLetter(letter);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="p-6 hover:shadow-card transition-all duration-300 cursor-pointer bg-gradient-card border-border/50 relative overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2"
          >
            <CheckCircle2 className="w-5 h-5 text-success" />
          </motion.div>
        )}
        
        <div className="text-center">
          {/* Large Letter Display */}
          <motion.div
            className="text-6xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
          >
            {letter}
          </motion.div>

          {/* Transliteration */}
          <div className="text-lg font-semibold text-foreground mb-2">
            {transliteration}
          </div>

          {/* Pronunciation Badge */}
          <Badge variant="secondary" className="mb-4">
            {pronunciation}
          </Badge>

          {/* Example Word */}
          <div className="text-sm text-muted-foreground mb-4 min-h-[40px]">
            {example}
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-2 justify-center"
              >
                {audioSrc && (
                  <AudioPlayer
                    audioSrc={audioSrc}
                    letter={letter}
                    variant="outline"
                    size="sm"
                  />
                )}
                <Button
                  size="sm"
                  variant="default"
                  className="gap-2"
                  onClick={onPractice}
                >
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
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent animate-fade-in">
              Learn Tulu Lipi
            </h1>
            <p className="text-muted-foreground text-lg animate-slide-up">
              Master the beautiful Tulu script letter by letter. Click on any letter to see stroke order and hear pronunciation.
            </p>
          </div>
        </div>
      </section>

      {/* Letters Section */}
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

            <TabsContent value="vowels" className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Vowels (ಸ್ವರಗಳು)</h2>
                <p className="text-muted-foreground">
                  Learn the {vowels.length} vowel sounds in Tulu Lipi
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vowels.map((vowel, index) => (
                  <div
                    key={vowel.letter}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <LetterCard
                      {...vowel}
                      isCompleted={index < 3}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="consonants" className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Consonants (ವ್ಯಂಜನಗಳು)</h2>
                <p className="text-muted-foreground">
                  Learn the consonant sounds in Tulu Lipi
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {consonants.map((consonant, index) => (
                  <div
                    key={consonant.letter}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <LetterCard
                      {...consonant}
                      isCompleted={index < 2}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-card shadow-card border-border/50">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                5 / {vowels.length + consonants.length}
              </div>
              <p className="text-muted-foreground mb-6">Letters Learned</p>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(5 / (vowels.length + consonants.length)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-hero h-full rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Keep going! You're making great progress.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learn;