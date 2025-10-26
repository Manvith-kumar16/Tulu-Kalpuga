import { Link } from "react-router-dom";
import { Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";

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
      title: "Account",
      links: [
        { label: "Profile", path: "/profile" },
        { label: "Settings", path: "/settings" },
      ],
    },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center shadow-card">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                TuluLip
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              An interactive platform to learn, write, and preserve the beautiful Tulu script.
              Join us in celebrating and continuing this ancient language tradition.
            </p>
            <motion.div
              className="flex items-center gap-1 text-sm text-muted-foreground"
              whileHover={{ scale: 1.05 }}
            >
              Made with <Heart className="w-4 h-4 text-accent fill-accent mx-1" /> for Tulu culture
            </motion.div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} TuluLip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
