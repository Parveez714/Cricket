import { cn } from "@/lib/utils";

interface HistoryEntry {
  playerHand: number;
  computerHand: number;
  result: "run" | "out";
  runsScored: number;
}

interface GameHistoryProps {
  history: HistoryEntry[];
}

const handEmojis = ["✊", "☝️", "✌️", "🤟", "🖐️", "🤙", "👊"];

export const GameHistory = ({ history }: GameHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6 max-w-md mx-auto">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <span>📜</span> Recent Plays
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {history.slice(-10).map((entry, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all",
              entry.result === "run"
                ? "bg-secondary/50 text-foreground"
                : "bg-destructive/20 text-destructive"
            )}
          >
            <span>{handEmojis[entry.playerHand]}</span>
            <span className="text-muted-foreground">vs</span>
            <span>{handEmojis[entry.computerHand]}</span>
            <span className="ml-1 font-bold">
              {entry.result === "run" ? `+${entry.runsScored}` : "OUT"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
