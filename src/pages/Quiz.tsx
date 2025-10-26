import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Gamepad2 } from "lucide-react";

const Quiz = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Quizzes & Challenges
            </h1>
            <p className="text-muted-foreground text-lg">
              Test your knowledge with fun, gamified challenges
            </p>
          </div>

          <Card className="p-12 text-center bg-gradient-card shadow-card border-border/50 animate-scale-in">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
                <Gamepad2 className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground mb-8">
                Exciting quizzes, mini-games, and challenges are on the way. 
                Earn points, badges, and compete with other learners!
              </p>
              <Button variant="hero" className="gap-2">
                <Trophy className="w-5 h-5" />
                Get Notified
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
