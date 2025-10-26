import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings as SettingsIcon, Moon, Sun, Bell, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchSettings();
  }, [user, navigate]);

  const fetchSettings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("theme_preference, notifications_enabled, sound_effects_enabled")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching settings:", error);
    } else {
      setNotifications(data.notifications_enabled);
      setSoundEffects(data.sound_effects_enabled);
      if (data.theme_preference) {
        setTheme(data.theme_preference as "light" | "dark" | "system");
      }
    }
    setLoading(false);
  };

  const updateSetting = async (key: string, value: boolean | string) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ [key]: value })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update setting");
      console.error(error);
    } else {
      toast.success("Setting updated");
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateSetting("theme_preference", newTheme);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Customize your learning experience
            </p>
          </div>

          {/* Appearance Settings */}
          <Card className="p-6 mb-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex items-center gap-2 mb-6">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {(["light", "dark", "system"] as const).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === themeOption
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {themeOption === "light" && (
                        <Sun className="w-6 h-6" />
                      )}
                      {themeOption === "dark" && (
                        <Moon className="w-6 h-6" />
                      )}
                      {themeOption === "system" && (
                        <SettingsIcon className="w-6 h-6" />
                      )}
                      <span className="text-sm font-medium capitalize">
                        {themeOption}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Notifications Settings */}
          <Card className="p-6 mb-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about your progress and achievements
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={(checked) => {
                    setNotifications(checked);
                    updateSetting("notifications_enabled", checked);
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Sound Settings */}
          <Card className="p-6 bg-gradient-card shadow-card border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <Volume2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Audio</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sound">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for interactions and achievements
                  </p>
                </div>
                <Switch
                  id="sound"
                  checked={soundEffects}
                  onCheckedChange={(checked) => {
                    setSoundEffects(checked);
                    updateSetting("sound_effects_enabled", checked);
                  }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
