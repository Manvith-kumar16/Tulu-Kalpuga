import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AudioPlayerProps {
  audioSrc: string;
  letter: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
}

export const AudioPlayer = ({
  audioSrc,
  letter,
  variant = "outline",
  size = "sm",
  showLabel = true,
  className = ""
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setAudioError(true);
      setIsLoading(false);
      setIsPlaying(false);
    };
    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audioRef.current.addEventListener("ended", handleEnded);
    audioRef.current.addEventListener("error", handleError);
    audioRef.current.addEventListener("canplay", handleCanPlay);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.removeEventListener("error", handleError);
        audioRef.current.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, []);

  const playAudio = async () => {
    if (!audioRef.current) return;

    if (audioError) {
      toast.error(`Audio file not found for ${letter}. Please add the audio file later.`);
      return;
    }

    try {
      setIsLoading(true);

      if (audioRef.current.src !== audioSrc) {
        audioRef.current.src = audioSrc;
      }

      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error playing audio:", error);
      setAudioError(true);
      setIsLoading(false);
      toast.error(`Audio file not found for ${letter}. Please add the audio file later.`);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={`gap-2 ${className}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      {showLabel && (isPlaying ? "Stop" : "Listen")}
    </Button>
  );
};
