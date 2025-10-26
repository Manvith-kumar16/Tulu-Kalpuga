import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Pen, Volume2 } from "lucide-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getAudioForLetter } from "@/data/tuluLetterAudio";
import { motion } from "framer-motion";

const practiceLetter = "ಅ";

const Practice = () => {
  const [selectedLetter] = useState(practiceLetter);
  const audioSrc = getAudioForLetter(selectedLetter);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Practice Writing
            </h1>
            <p className="text-muted-foreground text-lg">
              Master your handwriting with interactive practice boards
            </p>
          </div>

          <Card className="p-8 bg-gradient-card shadow-card border-border/50 animate-scale-in mb-6">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">
                Letter Practice
              </Badge>
              <motion.div
                className="text-9xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {selectedLetter}
              </motion.div>
              <div className="flex gap-4 justify-center mb-6">
                {audioSrc && (
                  <AudioPlayer
                    audioSrc={audioSrc}
                    letter={selectedLetter}
                    variant="default"
                    size="lg"
                  />
                )}
                <Button variant="outline" size="lg" className="gap-2">
                  <Pen className="w-5 h-5" />
                  Practice Writing
                </Button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-lg font-semibold mb-4">How to Practice:</h3>
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
                      Use the writing board to practice the letter strokes
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Perfect</p>
                    <p className="text-sm text-muted-foreground">
                      Repeat until you can write it confidently
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 text-center bg-gradient-card shadow-card border-border/50">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-4">Interactive Writing Board</h3>
              <p className="text-muted-foreground mb-6">
                Interactive writing board with AI-powered feedback is under development.
                You'll soon be able to practice writing each letter with real-time guidance.
              </p>
              <Button variant="hero" className="gap-2">
                <Target className="w-5 h-5" />
                Join Waitlist
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Practice;