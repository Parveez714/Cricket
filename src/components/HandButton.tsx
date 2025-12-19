import { cn } from "@/lib/utils";

interface HandButtonProps {
  value: number;
  onClick: (value: number) => void;
  disabled?: boolean;
}

const handEmojis = ["✊", "☝️", "✌️", "🤟", "🖐️", "🤙", "👊"];

export const HandButton = ({ value, onClick, disabled }: HandButtonProps) => {
  return (
    <button
      onClick={() => onClick(value)}
      disabled={disabled}
      className={cn(
        "hand-button w-20 h-20 md:w-24 md:h-24 rounded-2xl",
        "bg-gradient-to-br from-card/60 to-card/30",
        "backdrop-blur-xl border-2 border-border/40",
        "flex flex-col items-center justify-center gap-1",
        "shadow-lg shadow-black/20",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0",
        "group"
      )}
    >
      <span className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-125">
        {handEmojis[value]}
      </span>
      <span className="text-sm font-bold text-primary">{value}</span>
    </button>
  );
};
