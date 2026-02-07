import { useRef, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Eraser, RefreshCw, Check, AlertTriangle, Eye, EyeOff, Pen } from "lucide-react";
import { api } from "@/services/api";
import StrokeTraceAnimation from "@/components/StrokeTraceAnimation";
import { SimpleLetterAnimation } from "@/components/SimpleLetterAnimation";
import { getStrokePaths } from "@/data/tuluStrokePaths";

interface WritingPracticeProps {
  letter: string;
  image?: string;
  transliteration?: string;
  onClose?: () => void;
}

// Node.js Backend URL (Proxies to ML)
const ML_BACKEND_URL = "https://tulu-kalpuga.onrender.com";

// Mapping from Tulu letters to transliterations (used as fallback)
import { letterToTransliteration } from "@/data/tuluLetters";


const WritingPractice = ({ letter, image, transliteration, onClose }: WritingPracticeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: boolean; predicted: string; score: number } | null>(null);
  const [showStrokes, setShowStrokes] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Check if we have SVG data for this letter
  const svgStrokeData = useMemo(() => getStrokePaths(transliteration || letterToTransliteration[letter] || ""), [letter, transliteration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#2b2b2b";
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context) return;
    const { x, y } = getCursorPosition(e);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const { x, y } = getCursorPosition(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setError(null);
      setResult(null);
    }
  };

  const getExpectedTransliteration = (): string => {
    if (transliteration) return transliteration;
    return letterToTransliteration[letter] || "";
  };

  const checkWriting = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Validate if canvas is empty or has too little content
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let pixelCount = 0;

    // Bounding box logic
    let minX = width, minY = height, maxX = 0, maxY = 0;

    // Check alpha channel (every 4th byte)
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 10) { // If pixel is not transparent (using 10 as threshold for anti-aliasing)
        pixelCount++;

        // Calculate coordinate
        const index = (i - 3) / 4;
        const x = index % width;
        const y = Math.floor(index / width);

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    // Heuristic: Must have at least ~500 filled pixels OR cover a decent area
    // A single dot might have ~30-50 pixels. A small line ~100-200.
    // Let's require at least a small stroke.
    const hasEnoughContent = pixelCount > 400;

    // Also check bounding box size to avoid tiny squiggles
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const hasDecentSize = contentWidth > 20 || contentHeight > 20;

    if (!hasEnoughContent || !hasDecentSize) {
      setError("Please write the full letter!"); // Clearer message
      return;
    }

    const expected = getExpectedTransliteration();

    if (!expected) {
      setError("Could not determine expected transliteration for this letter.");
      return;
    }

    setIsChecking(true);
    setError(null);
    setResult(null);

    try {
      // 2. Process Image: Flatten to White Background first, then Invert for Model
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tCtx = tempCanvas.getContext("2d");

      if (!tCtx) throw new Error("Could not create temp canvas");

      // A. Create Black-on-White version first (Standard Drawing)
      tCtx.fillStyle = "#ffffff";
      tCtx.fillRect(0, 0, width, height);
      tCtx.drawImage(canvas, 0, 0);

      // B. Invert Colors (Make it White-on-Black)
      // Standard ML models (like MNIST) usually expect white text on black background.
      const imgData = tCtx.getImageData(0, 0, width, height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Invert RGB: 255 (white) becomes 0 (black), 0 (black) becomes 255 (white)
        data[i] = 255 - data[i];     // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
        // Alpha (data[i+3]) remains 255
      }

      tCtx.putImageData(imgData, 0, 0);

      const base64Image = tempCanvas.toDataURL("image/png");

      // Send to ML backend
      const response = await fetch(`${ML_BACKEND_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          expected: expected,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      // Boost score by 20% but cap at 96%
      let baseScore = responseData.score || 0;
      let finalScore = Math.min(baseScore + 0.20, 0.96);

      // User requested: Above 85% should always be green (correct)
      const isCorrect = responseData.correct || finalScore >= 0.85;

      setResult({
        correct: isCorrect,
        predicted: responseData.predicted || "",
        score: finalScore,
      });

      // Log progress if correct
      if (isCorrect) {
        try {
          await api.logPractice(letter);
          await api.logLearn(letter);
        } catch (error) {
          console.error("Failed to log progress:", error);
        }
      }
    } catch (err) {
      console.error("Error checking writing:", err);
      setError("Could not connect to ML backend.");
    } finally {
      setIsChecking(false);
    }
  };

  const getCursorPosition = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const strokeGif = `/images/Strokes/${transliteration || letter}.gif`;

  return (
    <div className="flex flex-col relative w-full p-6">
      {/* Header & Close */}
      <div className="flex justify-between items-center mb-2 px-1">
        <motion.h2
          className="text-xl font-bold flex items-center gap-2 text-primary"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span>Practice:</span>
          <span className="text-3xl text-red-600">{letter}</span>
          <span className="text-muted-foreground text-lg font-normal">({getExpectedTransliteration()})</span>
        </motion.h2>

        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-100 -mr-2"
          >
            <span className="text-xl">✕</span>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center">
        {/* Left: Canvas Area */}
        <div className="relative flex-shrink-0">
          <div className="relative border-2 border-slate-100 rounded-xl shadow-inner overflow-hidden bg-slate-50 touch-none">
            {image && showGuide && (
              <img
                src={image}
                alt={letter}
                className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none"
              />
            )}

            {/* Stroke Order Overlay */}
            {showStrokes && (
              <div className="absolute inset-0 bg-white/95 z-20 flex items-center justify-center">
                {svgStrokeData ? (
                  <StrokeTraceAnimation strokeData={svgStrokeData} />
                ) : (
                  <SimpleLetterAnimation imageSrc={image || ""} />
                )}
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="touch-none cursor-crosshair block"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        </div>

        {/* Right: Result & Stats */}
        <div className="w-full md:w-72 flex flex-col">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-300">
                  <Pen className="w-6 h-6" />
                </div>
                <p className="font-medium text-slate-600 mb-1">Your Turn</p>
                <p className="text-xs text-slate-400">Trace the letter on the canvas carefully.</p>
              </motion.div>
            ) : (
              (() => {
                const score = result.score;
                let colorClass = "";
                let strokeColor = "";
                let bgCircleClass = "";
                let title = "";
                let msg = "";

                if (score >= 0.80) {
                  colorClass = "bg-green-50 border-green-100 text-green-700";
                  strokeColor = "#16a34a"; // green-600
                  bgCircleClass = "bg-green-400";
                  title = "Excellent!";
                  msg = "You've mastered this stroke.";
                } else if (score >= 0.50) {
                  colorClass = "bg-yellow-50 border-yellow-100 text-yellow-700";
                  strokeColor = "#ca8a04"; // yellow-600
                  bgCircleClass = "bg-yellow-400";
                  title = "Good Job!";
                  msg = "You're getting there!";
                } else {
                  colorClass = "bg-red-50 border-red-100 text-red-700";
                  strokeColor = "#dc2626"; // red-600
                  bgCircleClass = "bg-red-400";
                  title = "Keep Trying";
                  msg = "Follow the guide and try again.";
                }

                return (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`h-full flex flex-col items-center justify-center p-6 rounded-xl border-2 ${colorClass} text-center relative overflow-hidden`}
                  >
                    {/* Decorative background circle */}
                    <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full opacity-10 ${bgCircleClass}`} />

                    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                      <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/50" />
                        <motion.circle
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 56 - (result.score * 2 * Math.PI * 56) }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          cx="64" cy="64" r="56"
                          stroke={strokeColor}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 56}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold tracking-tight">
                          {(result.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-1">
                      {title}
                    </h3>
                    <p className="text-xs opacity-90 mb-4">
                      {msg}
                    </p>

                    {onClose && (
                      <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="text-xs hover:bg-white/50"
                      >
                        Close & Continue
                      </Button>
                    )}
                  </motion.div>
                );
              })()
            )}
          </AnimatePresence>

          {/* Small error toast inside right panel if needed, or stick below */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2 bg-red-100 text-red-700 rounded text-xs flex items-center gap-1 justify-center"
            >
              <AlertTriangle className="w-3 h-3" />
              {error}
            </motion.div>
          )}
        </div>
      </div>

      {/* Tools / Actions */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button onClick={() => setShowGuide(!showGuide)} variant="ghost" size="sm" className="text-slate-500 h-8 gap-1.5" title="Toggle Guide">
            {showGuide ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">Guide</span>
          </Button>
          <Button onClick={() => setShowStrokes(!showStrokes)} variant="ghost" size="sm" className="text-slate-500 h-8 gap-1.5" title="Toggle Animation">
            {showStrokes ? <span className="font-bold">Stop</span> : <span className="font-bold">Play</span>}
            <span className="hidden sm:inline">Animation</span>
          </Button>
          <Button onClick={clearCanvas} variant="ghost" size="sm" className="text-slate-500 h-8 gap-1.5" title="Clear Canvas">
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>

        <Button
          onClick={checkWriting}
          size="sm"
          className={`gap-2 min-w-[100px] shadow-sm transition-all ${isChecking ? "bg-slate-100 text-slate-400" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            }`}
          disabled={isChecking}
        >
          {isChecking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          {isChecking ? "Checking..." : "Check"}
        </Button>
      </div>
    </div>
  );
};

export default WritingPractice;
