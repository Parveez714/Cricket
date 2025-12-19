import { useState, useCallback } from "react";
import { HandButton } from "./HandButton";
import { ScoreCard } from "./ScoreCard";
import { ResultDisplay } from "./ResultDisplay";
import { GameHistory } from "./GameHistory";
import { WicketModal } from "./WicketModal";
import { WinnerModal } from "./WinnerModal";
import { ModeSelection } from "./ModeSelection";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSoundEffects } from "@/hooks/useSoundEffects";

type GameMode = "1-player" | "2-player" | null;

interface HistoryEntry {
  playerHand: number;
  computerHand: number;
  result: "run" | "out";
  runsScored: number;
}

export const HandCricket = () => {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [playerHand, setPlayerHand] = useState<number | null>(null);
  const [computerHand, setComputerHand] = useState<number | null>(null);
  const [result, setResult] = useState<"run" | "out" | null>(null);
  const [runsScored, setRunsScored] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isOut, setIsOut] = useState(false);
  const [showWicket, setShowWicket] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { playClick, playScore, playOut } = useSoundEffects();

  const currentScore = currentPlayer === 1 ? player1Score : player2Score;
  const setCurrentScore = currentPlayer === 1 ? setPlayer1Score : setPlayer2Score;

  const playHand = useCallback((value: number) => {
    if (isOut || isPlaying) return;
    
    playClick();
    setIsPlaying(true);
    
    // Generate opponent's hand (1-6)
    const opponent = Math.floor(Math.random() * 6) + 1;
    
    setPlayerHand(value);
    setComputerHand(opponent);

    if (value === opponent) {
      // Out!
      setResult("out");
      setRunsScored(0);
      setIsOut(true);
      setHistory(prev => [...prev, { playerHand: value, computerHand: opponent, result: "out", runsScored: 0 }]);
      
      setTimeout(() => {
        playOut();
        setShowWicket(true);
        setIsPlaying(false);
      }, 300);
    } else {
      // Scored runs
      setTimeout(() => {
        playScore(value);
      }, 100);
      setResult("run");
      setRunsScored(value);
      setCurrentScore(prev => prev + value);
      setHistory(prev => [...prev, { playerHand: value, computerHand: opponent, result: "run", runsScored: value }]);
      setIsPlaying(false);
    }
  }, [isOut, isPlaying, playClick, playScore, playOut, setCurrentScore]);

  const handleWicketClose = useCallback(() => {
    setShowWicket(false);
    
    if (gameMode === "2-player" && currentPlayer === 1) {
      // Switch to player 2
      setCurrentPlayer(2);
      setPlayerHand(null);
      setComputerHand(null);
      setResult(null);
      setRunsScored(0);
      setHistory([]);
      setIsOut(false);
      setIsPlaying(false);
    } else if (gameMode === "2-player" && currentPlayer === 2) {
      // Game over - show winner
      setShowWinner(true);
    } else {
      // 1-player mode - reset game
      resetGame();
    }
  }, [gameMode, currentPlayer]);

  const resetGame = useCallback(() => {
    playClick();
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setPlayerHand(null);
    setComputerHand(null);
    setResult(null);
    setRunsScored(0);
    setHistory([]);
    setIsOut(false);
    setShowWicket(false);
    setShowWinner(false);
    setIsPlaying(false);
  }, [playClick]);

  const handleWinnerClose = useCallback(() => {
    resetGame();
    setGameMode(null);
  }, [resetGame]);

  const handleBackToMenu = useCallback(() => {
    playClick();
    resetGame();
    setGameMode(null);
  }, [playClick, resetGame]);

  // Show mode selection if no mode selected
  if (!gameMode) {
    return <ModeSelection onSelectMode={setGameMode} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stadium-dark via-background to-stadium-light py-8 px-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-25%] w-[150%] h-[150%] bg-gradient-radial from-glow-green/10 via-transparent to-transparent" />
        <div className="absolute bottom-[-50%] right-[-25%] w-[100%] h-[100%] bg-gradient-radial from-glow-gold/5 via-transparent to-transparent" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={handleBackToMenu}
          className={cn(
            "absolute top-0 left-0 flex items-center gap-2 px-4 py-2 rounded-xl",
            "text-muted-foreground hover:text-foreground",
            "transition-colors duration-300"
          )}
        >
          <ArrowLeft className="w-5 h-5" />
          Menu
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-2 float">
            <span className="text-glow">🏏 Hand Cricket</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {gameMode === "2-player" 
              ? `Player ${currentPlayer}'s Turn - Match the opponent = OUT!`
              : "Match the computer's hand = OUT!"
            }
          </p>
        </div>

        {/* Score Display */}
        <div className="flex justify-center gap-4 mb-8">
          {gameMode === "2-player" ? (
            <>
              <ScoreCard 
                label="Player 1" 
                score={player1Score} 
                isOut={currentPlayer === 2 || (currentPlayer === 1 && isOut)}
                highlight={currentPlayer === 1 && result === "run"}
                active={currentPlayer === 1}
              />
              <ScoreCard 
                label="Player 2" 
                score={player2Score} 
                isOut={currentPlayer === 2 && isOut}
                highlight={currentPlayer === 2 && result === "run"}
                active={currentPlayer === 2}
                target={currentPlayer === 2 ? player1Score + 1 : undefined}
              />
            </>
          ) : (
            <ScoreCard 
              label="Your Score" 
              score={player1Score} 
              isOut={isOut}
              highlight={result === "run"}
            />
          )}
        </div>

        {/* Result Display */}
        <div className="mb-8">
          <ResultDisplay
            playerHand={playerHand}
            computerHand={computerHand}
            result={result}
            runsScored={runsScored}
          />
        </div>

        {/* Hand Buttons */}
        <div className="mb-8">
          <p className="text-center text-muted-foreground mb-4 text-sm uppercase tracking-wider">
            {gameMode === "2-player" ? `Player ${currentPlayer} - Pick your hand` : "Pick your hand"}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <HandButton
                key={value}
                value={value}
                onClick={playHand}
                disabled={isOut || isPlaying}
              />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={resetGame}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl",
              "bg-destructive/20 text-destructive font-semibold",
              "hover:bg-destructive hover:text-destructive-foreground",
              "transition-all duration-300 hover:scale-105"
            )}
          >
            <RotateCcw className="w-5 h-5" />
            Reset Game
          </button>
        </div>

        {/* History */}
        <GameHistory history={history} />

        {/* Wicket Modal */}
        <WicketModal
          isOpen={showWicket}
          onClose={handleWicketClose}
          finalScore={currentScore}
          playerLabel={gameMode === "2-player" ? `Player ${currentPlayer}` : undefined}
          showNextPlayer={gameMode === "2-player" && currentPlayer === 1}
        />

        {/* Winner Modal (2-player only) */}
        <WinnerModal
          isOpen={showWinner}
          onClose={handleWinnerClose}
          player1Score={player1Score}
          player2Score={player2Score}
        />
      </div>
    </div>
  );
};
