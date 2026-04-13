import React from 'react';
import { MatchState } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { X, Circle } from 'lucide-react';

interface GameBoardProps {
  match: MatchState;
  onMove: (index: number) => void;
  mySymbol: 'X' | 'O' | null;
}

export default function GameBoard({ match, onMove, mySymbol }: GameBoardProps) {
  const isMyTurn = match.currentTurn === mySymbol && match.status === 'PLAYING';

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-[320px] aspect-square p-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/3 left-0 w-full h-px bg-white" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-white" />
        <div className="absolute left-1/3 top-0 w-px h-full bg-white" />
        <div className="absolute left-2/3 top-0 w-px h-full bg-white" />
      </div>

      {match.board.map((cell, i) => {
        const isWinningCell = match.winningLine?.includes(i);
        
        return (
          <button
            key={i}
            disabled={!isMyTurn || cell !== null}
            onClick={() => onMove(i)}
            className={cn(
              "relative flex items-center justify-center bg-black/40 border border-zinc-800/50 rounded-lg transition-all duration-200 group",
              isMyTurn && cell === null && "hover:bg-zinc-800/50 hover:border-orange-500/30 cursor-pointer",
              !isMyTurn && "cursor-not-allowed",
              isWinningCell && "bg-orange-500/10 border-orange-500/50"
            )}
          >
            {cell === 'X' && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className={cn("text-orange-500", isWinningCell && "text-orange-400")}
              >
                <X size={48} strokeWidth={2.5} />
              </motion.div>
            )}
            {cell === 'O' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn("text-zinc-300", isWinningCell && "text-white")}
              >
                <Circle size={40} strokeWidth={2.5} />
              </motion.div>
            )}
            
            {/* Hover Preview */}
            {isMyTurn && cell === null && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity">
                {mySymbol === 'X' ? <X size={48} /> : <Circle size={40} />}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
