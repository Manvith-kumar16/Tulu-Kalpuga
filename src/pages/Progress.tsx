import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, TrendingUp, CheckCircle2, Loader2, Flame, Languages } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { formatDistanceToNow, format, subDays } from "date-fns";
import ContributionGraph from "@/components/ContributionGraph";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Progress = () => {
  const { data: progressData, isLoading, error } = useQuery({
    queryKey: ['progress'],
    queryFn: api.getStats
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Failed to load progress. Please try again later.
      </div>
    )
  }

  // --- Data Processing for Charts ---
  // Generate last 7 days data for the chart
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateKey = format(d, 'yyyy-MM-dd');

    // Find activity count for this day from recentActivity if possible, 
    // or just mock it for now since recentActivity doesn't hold count per day easily without processing
    // For a real app, you'd aggregate `recentActivity` by date here.
    // Let's do a simple count based on `recentActivity` matching the date.
    const count = progressData?.recentActivity?.filter((a: any) =>
      format(new Date(a.date), 'yyyy-MM-dd') === dateKey
    ).length || 0;

    return {
      name: format(d, 'EEE'), // Mon, Tue
      activity: count,
      fullDate: format(d, 'MMM d')
    };
  });

  const stats = [
    {
      label: "Letters Learned",
      value: progressData?.totalLetters?.toString() || "0",
      total: "50",
      icon: Languages,
      color: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-500/20",
      bgIcon: "bg-white/20"
    },
    {
      label: "Current Streak",
      value: `${progressData?.stats?.streak || 0} Days`, // Need to ensure streak is passed from backend in stats or root
      total: "Keep it up!",
      icon: Flame,
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
      bgIcon: "bg-white/20"
    },
    {
      label: "XP Points",
      value: "2850", // Mock XP for now or calculate from stats
      total: "Lvl 3",
      icon: Star,
      color: "from-emerald-500 to-green-500",
      shadow: "shadow-emerald-500/20",
      bgIcon: "bg-white/20"
    },
  ];

  const staticAchievements = [
    { id: 'first_steps', icon: Star, title: "First Steps", description: "Learned your first letter", color: "text-yellow-500" },
    { id: 'vowel_master', icon: Zap, title: "Vowel Master", description: "Completed all vowels", color: "text-blue-500" },
    { id: 'consonant_pro', icon: Trophy, title: "Consonant Pro", description: "Mastered 10 consonants", color: "text-orange-500" },
    { id: 'quick_learner', icon: CheckCircle2, title: "Quick Learner", description: "3-day learning streak", color: "text-green-500" },
  ];

  const achievements = staticAchievements.map(ach => ({
    ...ach,
    earned: progressData?.achievements?.some((a: any) => a.id === ach.id) || false
  }));

  return (
    <div className="min-h-screen bg-background py-16 text-foreground">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
              Your Progress
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground font-medium"
          >
            Overview of your learning journey
          </motion.p>
        </div>

        {/* 📊 Top Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-0 ${stat.shadow} shadow-lg h-32`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90`} />
                <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium opacity-90 text-sm tracking-wide uppercase">{stat.label}</p>
                      <h3 className="text-4xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                    </div>
                    <div className={`p-2 rounded-xl ${stat.bgIcon} backdrop-blur-sm`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                    {stat.label.includes("Streak") ? <Flame className="w-3 h-3 fill-white" /> : <TrendingUp className="w-3 h-3" />}
                    <span>{stat.total}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* 📈 Activity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Learning Activity
                  <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">Last 7 Days</span>
                </h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last7Days}>
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      hide
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: '8px', border: '1px solid var(--border)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                      cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="activity"
                      stroke="#EA580C"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorActivity)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* 🏆 Achievements Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Achievements
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${achievement.earned ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30 opacity-50 grayscale'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-background shadow-sm border border-border/50`}>
                      <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 🗺️ Contribution Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ContributionGraph data={progressData?.stats || { lettersLearned: [], quizScores: [] }} />
        </motion.div>

        {/* 🕒 Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Activity Log</h2>
            <div className="space-y-1">
              {progressData?.recentActivity?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity yet.</p>
                  <p className="text-sm">Complete a lesson to see it here!</p>
                </div>
              ) : (
                progressData?.recentActivity?.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 px-4 hover:bg-muted/50 rounded-lg transition-colors group"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default Progress;
