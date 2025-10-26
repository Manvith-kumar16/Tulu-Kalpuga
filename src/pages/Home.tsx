import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Target, Trophy, Sparkles, Play, Check } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description: "Learn Tulu Lipi with animated stroke-by-stroke guides",
    },
    {
      icon: Target,
      title: "Practice Writing",
      description: "Master each letter with AI-powered feedback",
    },
    {
      icon: Trophy,
      title: "Gamified Quizzes",
      description: "Test your knowledge with fun challenges",
    },
    {
      icon: Sparkles,
      title: "Track Progress",
      description: "Earn badges and celebrate your achievements",
    },
  ];

  const stats = [
    { value: "42", label: "Letters" },
    { value: "100+", label: "Lessons" },
    { value: "50+", label: "Quizzes" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Preserve • Learn • Share</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent animate-slide-up">
              Master Tulu Lipi Script
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up [animation-delay:100ms]">
              An interactive platform to learn, write, and preserve the beautiful Tulu script. 
              Start your journey into this ancient language with AI-powered guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:200ms]">
              <Link to="/learn">
                <Button variant="hero" size="lg" className="gap-2 text-base">
                  <Play className="w-5 h-5" />
                  Start Learning Free
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" size="lg" className="gap-2 text-base">
                  <BookOpen className="w-5 h-5" />
                  Explore Lessons
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="animate-scale-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive platform designed for effective learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-border/50 bg-gradient-card animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4 shadow-soft">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-8 md:p-12 text-center bg-gradient-card shadow-card border-border/50">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join thousands of learners preserving and celebrating the Tulu language
            </p>
            <Link to="/learn">
              <Button variant="hero" size="lg" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Start Learning Now
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
