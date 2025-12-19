import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalScore: number;
  playerLabel?: string;
  showNextPlayer?: boolean;
}

export const WicketModal = ({ isOpen, onClose, finalScore, playerLabel, showNextPlayer }: WicketModalProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-[300px] h-[450px] flex flex-col items-center justify-center">
        {/* Wicket Animation */}
        <div className="relative w-[200px] h-[160px] mb-8">
          {/* Stumps */}
          <div
            className={cn(
              "absolute bottom-0 left-[40px] w-3 h-24 bg-amber-200 rounded-sm",
              showAnimation && "wicket-fall"
            )}
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className={cn(
              "absolute bottom-0 left-[90px] w-3 h-24 bg-amber-200 rounded-sm",
              showAnimation && "wicket-fall"
            )}
            style={{ animationDelay: "0.4s" }}
          />
          <div
            className={cn(
              "absolute bottom-0 left-[140px] w-3 h-24 bg-amber-200 rounded-sm",
              showAnimation && "wicket-fall"
            )}
            style={{ animationDelay: "0.5s" }}
          />

          {/* Bails */}
          <div
            className={cn(
              "absolute bottom-[96px] left-[50px] w-10 h-2 bg-amber-300 rounded-full",
              showAnimation && "bail-fly"
            )}
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className={cn(
              "absolute bottom-[96px] left-[100px] w-10 h-2 bg-amber-300 rounded-full",
              showAnimation && "bail-fly"
            )}
            style={{ animationDelay: "0.35s" }}
          />

          {/* Ball */}
          <div
            className={cn(
              "absolute bottom-8 w-6 h-6 bg-destructive rounded-full shadow-lg",
              showAnimation && "ball-roll"
            )}
          />
        </div>

        {/* Score Display */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-destructive mb-2 shake">
            OUT! 🏏
          </h2>
          {playerLabel && (
            <p className="text-lg font-semibold text-foreground mb-1">{playerLabel}</p>
          )}
          <p className="text-muted-foreground text-lg mb-2">Final Score</p>
          <p className="text-6xl md:text-7xl font-extrabold text-primary text-glow">
            {finalScore}
          </p>
          <p className="text-muted-foreground mt-2">runs</p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={cn(
            "mt-8 px-8 py-4 rounded-2xl font-bold text-lg",
            "bg-gradient-to-r from-primary to-accent text-primary-foreground",
            "hover:scale-105 transition-transform duration-300",
            "shadow-lg shadow-primary/30"
          )}
        >
          {showNextPlayer ? "Player 2's Turn 👉" : "Play Again 🎮"}
        </button>
      </div>
    </div>
  );
};
