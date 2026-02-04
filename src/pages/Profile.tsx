import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trophy, Flame, BookOpen, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Profile {
  full_name: string;
  avatar_url: string;
  learning_streak: number;
  total_letters_learned: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  achievement_type: string;
  earned_at: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // Simulate fetch
    setTimeout(() => {
      setProfile({
        full_name: user.name || "",
        avatar_url: "",
        learning_streak: 0,
        total_letters_learned: 0
      });
      setFullName(user.name || "");
      setAchievements([]);
      setLoading(false);
    }, 500);

  }, [user, navigate]);

  /*
  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } else {
      setProfile(data);
      setFullName(data.full_name || "");
    }
    setLoading(false);
  };
  */

  /*
  const fetchAchievements = async () => { ... }
  */

  const handleUpdateProfile = async () => {
    if (!user) return;

    // TODO: Update backend
    toast.success("Profile updated locally (backend pending)");
    setProfile(prev => prev ? ({ ...prev, full_name: fullName }) : null);
    setEditing(false);

    /*
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);
    */
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="p-8 mb-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-2xl bg-gradient-hero text-red-700 font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                {editing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile} variant="hero">
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => {
                          setEditing(false);
                          setFullName(profile?.full_name || "");
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <h1 className="text-3xl font-bold">
                        {profile?.full_name || "User"}
                      </h1>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditing(true)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground mb-4">{user?.email}</p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <Badge variant="secondary" className="gap-2 py-2 px-4">
                        <Flame className="w-4 h-4 text-accent" />
                        {profile?.learning_streak || 0} Day Streak
                      </Badge>
                      <Badge variant="secondary" className="gap-2 py-2 px-4">
                        <BookOpen className="w-4 h-4 text-primary" />
                        {profile?.total_letters_learned || 0} Letters Learned
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              <Button variant="destructive" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Achievements Section */}
          <Card className="p-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">My Achievements</h2>
            </div>

            {achievements.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  No achievements yet. Keep learning to unlock them!
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-card transition-shadow border-border/50">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
