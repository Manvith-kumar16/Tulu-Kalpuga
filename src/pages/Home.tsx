import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Target, Trophy, Sparkles, Play, Check, Feather, Users, History } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const Home = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const stats = [
    { value: "50+", label: "Vowels & Consonants" },
    { value: "100+", label: "Interactive Lessons" },
    { value: "1000+", label: "Active Learners" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* 🌟 Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-float" style={{ animationDuration: '15s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }} />
          <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-secondary/10 blur-[80px] rounded-full animate-float" style={{ animationDuration: '18s', animationDelay: '5s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-background/50 backdrop-blur-md border border-primary/20 mb-8 hover:border-primary/40 transition-colors cursor-default shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold tracking-wide text-primary uppercase">
                Reclaim Your Heritage
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-3xl lg:text-5xl font-black mb-6 leading-[1.1] tracking-tight"
            >
              Master the Art of <br />
              <span className="text-gradient drop-shadow-sm">Tulu Lipi</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xs md:text-base text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Embark on a journey to preserve an ancient legacy.
              Learn to read and write the beautiful script of Tulunadu with our modern, AI-powered platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link to="/learn">
                <Button variant="hero" size="xl" className="group text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Start Learning Free
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" size="xl" className="group text-lg px-8 h-14 rounded-full bg-background/50 backdrop-blur-sm border-2 hover:bg-background/80 transition-all duration-300">
                  <BookOpen className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                  Explore Lessons
                </Button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-10 border-t border-border/50 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-foreground mb-1">{stat.value}</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🔮 Features Bento Grid */}
      <section className="py-24 relative bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-xl md:text-3xl font-bold mb-6">Designed for Modern Learning</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              We've combined traditional teaching methods with cutting-edge technology to make learning efficient and fun.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {/* Large Card Left */}
            <motion.div variants={item} className="md:col-span-2 group">
              <Card className="h-full bg-gradient-to-br from-card to-muted p-8 border-border/50 hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-primary/20 transition-colors" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                      <Feather className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Stroke-by-Stroke Guidance</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                      Visualize exactly how to draw each character with our animated stroke guides.
                      Watch, trace, and perfect your handwriting with real-time feedback.
                    </p>
                  </div>
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Lesson 1: Vowels (Swara)</span>
                      <span className="text-sm font-bold text-primary">85%</span>
                    </div>
                    <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_10px_rgba(255,81,47,0.5)]" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Tall Card Right */}
            <motion.div variants={item} className="md:row-span-2 group">
              <Card className="h-full bg-gradient-to-b from-card to-background p-8 border-border/50 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-accent/10 to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Gamified Progress</h3>
                  <p className="text-muted-foreground text-lg mb-8">
                    Stay motivated with streaks, badges, and levels.
                    Every lesson you complete brings you closer to mastery.
                  </p>

                  {/* Mock Achievement List */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-background/40 backdrop-blur-sm border border-border/50 shadow-sm hover:translate-x-1 transition-transform">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-500/10 text-orange-500">
                        <Sparkles className="w-5 h-5 fill-current" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">7 Day Streak</p>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-xl bg-background/40 backdrop-blur-sm border border-border/50 shadow-sm hover:translate-x-1 transition-transform delay-75">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500">
                        <Trophy className="w-5 h-5 fill-current" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold">Level 5</span>
                          <span className="text-muted-foreground">1250 XP</span>
                        </div>
                        <div className="h-1.5 w-full bg-blue-500/10 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-2/3 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-xl bg-background/40 backdrop-blur-sm border border-border/50 shadow-sm hover:translate-x-1 transition-transform delay-100">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-500">
                        <Check className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Review Completed</p>
                        <p className="text-xs text-muted-foreground">You nailed the last quiz!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div variants={item} className="group">
              <Card className="h-full p-8 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 text-green-600">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Practice Mode</h3>
                <p className="text-muted-foreground">
                  Test your memory with instant quizzes and writing challenges.
                </p>
              </Card>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div variants={item} className="group">
              <Card className="h-full p-8 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cultural Focus</h3>
                <p className="text-muted-foreground">
                  Learn not just the script, but the history behind the language.
                </p>
              </Card>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 🚀 CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 clip-path-slant" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-8 text-foreground">
              Ready to verify your <br /><span className="text-primary">Tulu Proficiency?</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join a community of enthusiastic learners and help preserve our linguistic heritage for future generations.
            </p>
            <Link to="/learn">
              <Button size="xl" className="h-16 px-10 text-xl rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground border-none">
                Start My Journey Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
