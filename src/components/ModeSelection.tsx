import { cn } from "@/lib/utils";
import { User, Users } from "lucide-react";

type GameMode = "1-player" | "2-player";

interface ModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelection = ({ onSelectMode }: ModeSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stadium-dark via-background to-stadium-light py-8 px-4 overflow-hidden relative flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-25%] w-[150%] h-[150%] bg-gradient-radial from-glow-green/10 via-transparent to-transparent" />
        <div className="absolute bottom-[-50%] right-[-25%] w-[100%] h-[100%] bg-gradient-radial from-glow-gold/5 via-transparent to-transparent" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4 float">
          <span className="text-glow">🏏 Hand Cricket</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12">
          Choose your game mode
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* 1 Player Mode */}
          <button
            onClick={() => onSelectMode("1-player")}
            className={cn(
              "group glass-card p-8 rounded-3xl cursor-pointer",
              "hover:scale-105 transition-all duration-300",
              "hover:shadow-lg hover:shadow-primary/20",
              "border-2 border-transparent hover:border-primary/50"
            )}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">1 Player</h3>
            <p className="text-muted-foreground text-sm">
              Play against the computer
            </p>
          </button>

          {/* 2 Player Mode */}
          <button
            onClick={() => onSelectMode("2-player")}
            className={cn(
              "group glass-card p-8 rounded-3xl cursor-pointer",
              "hover:scale-105 transition-all duration-300",
              "hover:shadow-lg hover:shadow-accent/20",
              "border-2 border-transparent hover:border-accent/50"
            )}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <Users className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">2 Players</h3>
            <p className="text-muted-foreground text-sm">
              Take turns batting against each other
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
