import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Target,
  Trophy,
  BarChart3,
  User as UserIcon,
  Settings,
  LogOut,
  Flame,
  Menu,
  X
} from "lucide-react";
import { TuluLogo } from "./TuluLogo";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const navItems = [
    { path: "/learn", label: "Learn", icon: BookOpen },
    { path: "/practice", label: "Practice", icon: Target },
    { path: "/quiz", label: "Quiz", icon: Trophy },
    { path: "/progress", label: "Progress", icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  // Mock streak for now if not available, default to 0
  const streakCount = user?.streak || 0;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* 🌟 Logo Section */}
          <Link to="/" className="flex items-center gap-2 group relative z-50">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
              <TuluLogo className="w-10 h-10 relative z-10" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent hidden sm:block">
              Tulu Kalpuga
            </span>
          </Link>

          {/* 💻 Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <div className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 🔧 Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4 relative z-50">
            <ThemeToggle />

            {user ? (
              <>
                {/* 🔥 Dynamic Streak Counter */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 text-orange-600 rounded-full border border-orange-500/20 shadow-sm" title="Current Streak">
                  <Flame className={`w-4 h-4 ${streakCount > 0 ? 'fill-orange-600 animate-pulse' : ''}`} />
                  <span className="text-sm font-bold">{streakCount}</span>
                </div>

                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent px-0">
                      <Avatar className="h-9 w-9 border-2 border-primary/20 ring-2 ring-background transition-all hover:ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-orange-600 text-white font-bold text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={signOut}
                      className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="rounded-full px-6 font-semibold bg-gradient-to-r from-primary to-orange-600 hover:shadow-lg hover:opacity-90 transition-all">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-foreground">Current Streak: {streakCount} Days</span>
                </div>
              )}
              <div className="grid gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
