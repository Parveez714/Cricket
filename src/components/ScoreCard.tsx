import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  score: number;
  isOut?: boolean;
  highlight?: boolean;
  active?: boolean;
  target?: number;
}

export const ScoreCard = ({ label, score, isOut, highlight, active, target }: ScoreCardProps) => {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-4 md:p-6 min-w-[140px] md:min-w-[180px] transition-all duration-500",
        highlight && "pulse-glow ring-2 ring-primary",
        isOut && "ring-2 ring-destructive",
        active && "ring-2 ring-accent scale-105"
      )}
    >
      <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </p>
      <div className="flex flex-col items-center justify-center gap-1 mt-2">
        <span
          className={cn(
            "text-4xl md:text-6xl font-extrabold transition-all duration-300",
            highlight ? "text-primary text-glow" : "text-foreground",
            isOut && "text-destructive",
            active && "text-accent"
          )}
        >
          {score}
        </span>
        {isOut && (
          <span className="text-xs md:text-sm font-bold text-destructive bg-destructive/20 px-2 py-1 rounded-full">
            OUT
          </span>
        )}
        {target && !isOut && (
          <span className="text-xs text-muted-foreground">
            Target: {target}
          </span>
        )}
      </div>
    </div>
  );
};
