import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Target, Trophy, Sparkles, Play, Check } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

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
      {/* 🌟 Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        {/* gradient background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.1),transparent_50%)]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Preserve • Learn • Share
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-gradient"
            >
              Master Tulu Lipi Script
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              An interactive platform to learn, write, and preserve the
              beautiful Tulu script. Start your journey into this ancient
              language with AI-powered guidance.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
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
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-red-700">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📘 Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive platform designed for effective learning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="p-6 hover:shadow-card transition-all duration-300 border-border/50 bg-gradient-card h-full">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 shadow-soft">
                      <Icon className="w-6 h-6 text-red-700" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ✅ CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-3xl mx-auto p-8 md:p-12 text-center bg-gradient-card shadow-card border-border/50">
              <motion.div
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Check className="w-8 h-8 text-red-700" />
              </motion.div>

              <h2 className="text-3xl font-bold mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of learners preserving and celebrating the Tulu
                language.
              </p>
              <Link to="/learn">
                <Button variant="hero" size="lg" className="gap-2">
                  <Sparkles className="w-5 h-5" />
                  Start Learning Now
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
