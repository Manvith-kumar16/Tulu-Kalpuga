import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eraser, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { api } from "@/services/api";

interface WritingPracticeProps {
  letter: string;
  image?: string;
  transliteration?: string;
}

// ML Backend URL - adjust if needed
const ML_BACKEND_URL = "http://localhost:5000";

// Mapping from Tulu letters to transliterations (used as fallback)
const letterToTransliteration: Record<string, string> = {
  "ಅ": "a", "ಆ": "aa", "ಇ": "i", "ಈ": "ii", "ಉ": "u", "ಊ": "uu",
  "ಋ": "r", "ೠ": "rr", "ಎ": "e", "ಏ": "ee", "ಎೕ": "e_", "ಏೕ": "ee_",
  "ಐ": "ai", "ಒ": "o", "ಓ": "oo", "ಔ": "au", "ಅಂ": "am", "ಅಃ": "ah",
  "ಕ": "ka", "ಖ": "kha", "ಗ": "ga", "ಘ": "gha", "ಙ": "nga",
  "ಚ": "ca", "ಛ": "cha", "ಜ": "ja", "ಝ": "jha", "ಞ": "nya",
  "ಟ": "ta", "ಠ": "taa", "ಡ": "da", "ಢ": "daa", "ಣ": "na1",
  "ತ": "tha", "ಥ": "thaa", "ದ": "dha", "ಧ": "dhaa", "ನ": "Na",
  "ಪ": "Pa", "ಫ": "pha", "ಬ": "Ba", "ಭ": "Bha", "ಮ": "Ma",
  "ಯ": "Ya", "ರ": "Ra", "ಲ": "La", "ವ": "Va", "ಶ": "Sha",
  "ಷ": "SHha", "ಸ": "Sa", "ಹ": "Ha", "ಳ": "LLa", "ೞ": "raa", "ಱ": "laa",
  "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4",
  "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9", "೧೦": "10", "೧೦೦": "100"
};

const WritingPractice = ({ letter, image, transliteration }: WritingPracticeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: boolean; predicted: string; score: number } | null>(null);

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
    const expected = getExpectedTransliteration();

    if (!expected) {
      setError("Could not determine expected transliteration for this letter.");
      return;
    }

    setIsChecking(true);
    setError(null);
    setResult(null);

    try {
      // Convert canvas to base64
      const base64Image = canvas.toDataURL("image/png");

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

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        correct: data.correct ?? false,
        predicted: data.predicted || "",
        score: data.score || 0,
      });

      // Log progress if correct
      if (data.correct) {
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

  const tryAgain = () => {
    clearCanvas();
  };

  const getCursorPosition = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const [showStrokes, setShowStrokes] = useState(false);

  // ... (existing functions)

  const strokeGif = `/images/Strokes/${transliteration || letter}.gif`;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Practice Writing:
        {image && (
          <img src={image} alt="Tulu Letter" className="inline-block h-10 w-10 ml-2 align-middle object-contain" />
        )}
      </motion.h2>

      <div className="relative border-2 border-border rounded-2xl shadow-md overflow-hidden bg-white">
        {image && (
          <img
            src={image}
            alt={letter}
            className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none"
          />
        )}

        {/* Stroke Order Overlay */}
        {showStrokes && (
          <div className="absolute inset-0 bg-white/90 z-10 flex items-center justify-center pointer-events-none">
            <img
              src={strokeGif}
              alt="Stroke Order"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                // Add a fallback text or icon here if needed in a parent container, 
                // but for now hiding the broken image is cleaner.
              }}
            />
            <p className="absolute bottom-2 text-xs text-muted-foreground">Watching Stroke Order</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex gap-4 mt-6 flex-wrap justify-center">
        <Button onClick={clearCanvas} variant="secondary" className="gap-2">
          <Eraser className="w-4 h-4" /> Clear
        </Button>
        <Button
          onClick={() => setShowStrokes(!showStrokes)}
          variant="outline"
          className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
        >
          {showStrokes ? "Hide Strokes" : "Watch Strokes"}
        </Button>
        <Button
          onClick={checkWriting}
          variant="default"
          className="gap-2 bg-orange-500 hover:bg-orange-600"
          disabled={isChecking}
        >
          <Check className="w-4 h-4" /> {isChecking ? "Checking..." : "Check"}
        </Button>
        <Button onClick={tryAgain} variant="default" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-lg"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Result Message */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 px-4 py-2 rounded-lg ${result.correct
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
            }`}
        >
          <p className="text-sm font-medium">
            {result.correct
              ? "✓ Correct! Great job!"
              : `Predicted: ${result.predicted} (Expected: ${getExpectedTransliteration()})`}
          </p>
          <p className="text-xs mt-1">Confidence: {(result.score * 100).toFixed(1)}%</p>
        </motion.div>
      )}
    </div>
  );
};

export default WritingPractice;
