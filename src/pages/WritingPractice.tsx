import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eraser, RefreshCw } from "lucide-react";

interface WritingPracticeProps {
  letter: string;
  image?: string;
}

const WritingPractice = ({ letter, image }: WritingPracticeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

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

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.h2
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Practice Writing: {letter}
      </motion.h2>

      <div className="relative border-2 border-border rounded-2xl shadow-md overflow-hidden bg-white">
        {image && (
          <img
            src={image}
            alt={letter}
            className="absolute inset-0 w-full h-full object-contain opacity-30 pointer-events-none"
          />
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

      <div className="flex gap-4 mt-6">
        <Button onClick={clearCanvas} variant="secondary" className="gap-2">
          <Eraser className="w-4 h-4" /> Clear
        </Button>
        <Button onClick={() => alert("Keep practicing!")} variant="default" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    </div>
  );
};

export default WritingPractice;
