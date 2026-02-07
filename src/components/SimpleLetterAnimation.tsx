import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimpleLetterAnimationProps {
    imageSrc: string;
    onComplete?: () => void;
}

export const SimpleLetterAnimation = ({ imageSrc, onComplete }: SimpleLetterAnimationProps) => {
    const [key, setKey] = useState(0);

    const restart = () => {
        setKey((prev) => prev + 1);
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full bg-white/95 rounded-xl z-20">
            <div className="relative w-64 h-64 border border-gray-100 rounded-lg bg-white shadow-sm flex items-center justify-center p-8">
                <motion.img
                    key={key}
                    src={imageSrc}
                    alt="Letter Animation"
                    className="w-full h-full object-contain"
                    initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.5 }}
                    animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    onAnimationComplete={onComplete}
                />

                {/* Ghost image for reference (faint) */}
                <img
                    src={imageSrc}
                    alt="Ghost"
                    className="absolute inset-0 w-full h-full object-contain opacity-10 p-8 pointer-events-none"
                />
            </div>

            <p className="mt-4 text-sm text-muted-foreground animate-pulse">Watching stroke flow...</p>

            <Button variant="ghost" size="sm" onClick={restart} className="mt-2 text-xs">
                <RefreshCw className="w-3 h-3 mr-1" /> Replay
            </Button>
        </div>
    );
};
