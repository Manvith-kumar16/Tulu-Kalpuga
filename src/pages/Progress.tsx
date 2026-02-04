import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, TrendingUp, CheckCircle2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { formatDistanceToNow } from "date-fns";

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

  const stats = [
    {
      label: "Letters Learned",
      value: progressData?.totalLetters?.toString() || "0",
      total: "50", // Approximate total Tulu characters
      percentage: ((progressData?.totalLetters || 0) / 50) * 100
    },
    {
      label: "Practice Sessions",
      value: progressData?.stats?.practiceSessions?.toString() || "0",
      total: "∞",
      percentage: null
    },
    {
      label: "Avg. Quiz Score",
      value: `${progressData?.averageQuizScore || 0}%`,
      total: "100%",
      percentage: progressData?.averageQuizScore || 0
    },
  ];

  // Merge backend achievements with static list for display (or use backend only if fully implemented)
  // For now, let's map the static list and check if they exist in backend achievements
  const staticAchievements = [
    { id: 'first_steps', icon: Star, title: "First Steps", description: "Learned your first letter" },
    { id: 'vowel_master', icon: Target, title: "Vowel Master", description: "Completed all vowels" },
    { id: 'consonant_pro', icon: Trophy, title: "Consonant Pro", description: "Mastered 10 consonants" },
    { id: 'quick_learner', icon: CheckCircle2, title: "Quick Learner", description: "3-day learning streak" },
  ];

  const achievements = staticAchievements.map(ach => ({
    ...ach,
    earned: progressData?.achievements?.some((a: any) => a.id === ach.id) || false
  }));

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-gradient">
              Your Progress
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your learning journey and celebrate achievements
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className="p-6 bg-gradient-card shadow-card border-border/50 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  of {stat.total}
                </div>
                {stat.percentage !== null && (
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-hero h-full rounded-full transition-all duration-500"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Achievements */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              Achievements
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card
                    key={achievement.title}
                    className={`p-6 transition-all duration-300 hover:-translate-y-1 border-border/50 animate-scale-in ${achievement.earned
                      ? "bg-gradient-card shadow-card"
                      : "bg-muted/30 opacity-60"
                      }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${achievement.earned
                          ? "bg-gradient-hero shadow-soft"
                          : "bg-muted"
                          }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${achievement.earned
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                            }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.earned && (
                            <Badge variant="secondary" className="text-xs">
                              Earned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 bg-gradient-card shadow-card border-border/50">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {progressData?.recentActivity?.length === 0 ? (
                <p className="text-muted-foreground">No recent activity yet. Start learning!</p>
              ) : (
                progressData?.recentActivity?.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 bg-gradient-hero rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Progress;
