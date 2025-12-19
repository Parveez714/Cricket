import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player1Score: number;
  player2Score: number;
}

export const WinnerModal = ({ isOpen, onClose, player1Score, player2Score }: WinnerModalProps) => {
  if (!isOpen) return null;

  const winner = player1Score > player2Score ? 1 : player2Score > player1Score ? 2 : 0;
  const isTie = winner === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative glass-card p-8 rounded-3xl max-w-md w-full mx-4 text-center bounce-in">
        {/* Trophy Icon */}
        <div className={cn(
          "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center",
          isTie ? "bg-muted" : "bg-glow-gold/30"
        )}>
          <Trophy className={cn(
            "w-12 h-12",
            isTie ? "text-muted-foreground" : "text-glow-gold"
          )} />
        </div>

        {/* Result */}
        <h2 className={cn(
          "text-3xl md:text-4xl font-extrabold mb-6",
          isTie ? "text-muted-foreground" : "text-glow-gold text-glow"
        )}>
          {isTie ? "It's a Tie! 🤝" : `Player ${winner} Wins! 🎉`}
        </h2>

        {/* Score Comparison */}
        <div className="flex justify-center gap-8 mb-8">
          <div className={cn(
            "glass-card p-4 rounded-2xl min-w-[120px]",
            winner === 1 && "ring-2 ring-glow-gold"
          )}>
            <p className="text-sm text-muted-foreground mb-1">Player 1</p>
            <p className="text-4xl font-extrabold text-primary">{player1Score}</p>
            <p className="text-xs text-muted-foreground">runs</p>
          </div>

          <div className="flex items-center text-2xl font-bold text-muted-foreground">
            vs
          </div>

          <div className={cn(
            "glass-card p-4 rounded-2xl min-w-[120px]",
            winner === 2 && "ring-2 ring-glow-gold"
          )}>
            <p className="text-sm text-muted-foreground mb-1">Player 2</p>
            <p className="text-4xl font-extrabold text-accent">{player2Score}</p>
            <p className="text-xs text-muted-foreground">runs</p>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onClose}
          className={cn(
            "px-8 py-4 rounded-2xl font-bold text-lg",
            "bg-gradient-to-r from-primary to-accent text-primary-foreground",
            "hover:scale-105 transition-transform duration-300",
            "shadow-lg shadow-primary/30"
          )}
        >
          Play Again 🎮
        </button>
      </div>
    </div>
  );
};
