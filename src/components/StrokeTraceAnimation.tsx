import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { StrokePath } from "@/data/tuluStrokePaths";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StrokeTraceAnimationProps {
    strokeData: StrokePath;
    onComplete?: () => void;
}

const StrokeTraceAnimation = ({ strokeData, onComplete }: StrokeTraceAnimationProps) => {
    const [key, setKey] = useState(0); // To restart animation

    const restart = () => {
        setKey((prev) => prev + 1);
    };

    const draw: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: i * 0.8, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay: i * 0.8, duration: 0.01 }
            }
        })
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full bg-white/95 rounded-xl z-20">
            <div className="relative w-64 h-64 border border-gray-100 rounded-lg bg-white shadow-sm">
                {/* Grid lines for reference (like the Kanji example) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-100 transform -translate-y-1/2" />
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-red-100 transform -translate-x-1/2" />
                    <div className="absolute top-0 left-0 w-full h-full border border-red-50/50" />

                    {/* Diagonal lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="red" vectorEffect="non-scaling-stroke" strokeWidth="0.5" strokeDasharray="4 2" />
                        <line x1="100" y1="0" x2="0" y2="100" stroke="red" vectorEffect="non-scaling-stroke" strokeWidth="0.5" strokeDasharray="4 2" />
                    </svg>
                </div>

                <svg
                    key={key}
                    viewBox={strokeData.viewBox}
                    className="w-full h-full"
                    style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
                >
                    {/* Background Ghost (Light Grey) */}
                    {strokeData.paths.map((d, i) => (
                        <path
                            key={`bg-${i}`}
                            d={d}
                            fill="none"
                            stroke="#e5e7eb" // gray-200
                            strokeWidth="10"
                        />
                    ))}

                    {/* Animated Stroke (Blue/Active) */}
                    {strokeData.paths.map((d, i) => (
                        <motion.path
                            key={`stroke-${i}`}
                            d={d}
                            fill="none"
                            stroke="#2563eb" // blue-600 (Active stroke color)
                            strokeWidth="10"
                            variants={draw}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                            onAnimationComplete={i === strokeData.paths.length - 1 ? onComplete : undefined}
                        />
                    ))}
                </svg>
            </div>

            <p className="mt-4 text-sm text-muted-foreground animate-pulse">Tracing Stroke Order...</p>

            <Button variant="ghost" size="sm" onClick={restart} className="mt-2 text-xs">
                <RefreshCw className="w-3 h-3 mr-1" /> Replay
            </Button>
        </div>
    );
};

export default StrokeTraceAnimation;
