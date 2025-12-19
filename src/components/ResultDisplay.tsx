import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  playerHand: number | null;
  computerHand: number | null;
  result: "run" | "out" | null;
  runsScored: number;
}

const handEmojis = ["✊", "☝️", "✌️", "🤟", "🖐️", "🤙", "👊"];

export const ResultDisplay = ({ playerHand, computerHand, result, runsScored }: ResultDisplayProps) => {
  if (playerHand === null || computerHand === null) {
    return (
      <div className="glass-card rounded-2xl p-6 md:p-8 text-center">
        <p className="text-lg md:text-xl text-muted-foreground">
          Choose your hand to play! 🏏
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-center gap-6 md:gap-12">
        {/* Player Hand */}
        <div className="text-center bounce-in">
          <p className="text-sm text-muted-foreground mb-2">You</p>
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <span className="text-5xl md:text-6xl">{handEmojis[playerHand]}</span>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{playerHand}</p>
        </div>

        {/* VS */}
        <div className="text-2xl md:text-3xl font-bold text-muted-foreground">VS</div>

        {/* Computer Hand */}
        <div className="text-center bounce-in" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground mb-2">Computer</p>
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <span className="text-5xl md:text-6xl">{handEmojis[computerHand]}</span>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{computerHand}</p>
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 text-center">
        {result === "run" ? (
          <div className="score-pop inline-flex items-center gap-2 bg-primary/20 text-primary px-6 py-3 rounded-full">
            <span className="text-2xl md:text-3xl font-extrabold">+{runsScored}</span>
            <span className="text-lg md:text-xl">runs!</span>
          </div>
        ) : (
          <div className={cn(
            "inline-flex items-center gap-2 bg-destructive/20 text-destructive px-6 py-3 rounded-full",
            "shake"
          )}>
            <span className="text-2xl md:text-3xl font-extrabold">OUT!</span>
            <span className="text-2xl">🏏💥</span>
          </div>
        )}
      </div>
    </div>
  );
};
