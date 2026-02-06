import { Link } from "react-router-dom";
import { Sparkles, Heart, Github, Twitter, Instagram, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Learn",
      links: [
        { label: "Letters", path: "/learn" },
        { label: "Practice", path: "/practice" },
        { label: "Quizzes", path: "/quiz" },
        { label: "Progress", path: "/progress" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Dictionary", path: "#" },
        { label: "Pronunciation Guide", path: "#" },
        { label: "Cultural History", path: "#" },
        { label: "Community Forum", path: "#" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Profile", path: "/profile" },
        { label: "Settings", path: "/settings" },
        { label: "Help Center", path: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="relative bg-muted/20 border-t border-border mt-12 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TuluLip
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Preserving the soul of Tulunadu through technology.
              Join our mission to keep the beautiful script alive for future generations.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4 text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                      >
                        <span className="w-0 group-hover:w-1.5 h-1.5 bg-primary rounded-full transition-all duration-300 mr-0 group-hover:mr-1 opacity-0 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-semibold text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest lessons and cultural stories delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="bg-background border-border" />
              <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} TuluLip. All rights reserved.</p>

          <motion.div
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1 animate-pulse" /> for Tulu culture
          </motion.div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
