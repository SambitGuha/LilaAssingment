import React from 'react';
import { MatchState } from '../types';
import { cn } from '../lib/utils';
import { Terminal, Shield, AlertCircle, RotateCcw } from 'lucide-react';

interface MatchStatusProps {
  match: MatchState;
  mySymbol: 'X' | 'O' | null;
  onReset: () => void;
}

export default function MatchStatus({ match, mySymbol, onReset }: MatchStatusProps) {
  const isMyTurn = match.currentTurn === mySymbol && match.status === 'PLAYING';
  const opponentSymbol = mySymbol === 'X' ? 'O' : 'X';
  const opponentName = match.playerNames[match.players[opponentSymbol] || ''] || 'Waiting...';

  return (
    <div className="w-full max-w-[320px] space-y-4">
      {/* Player Info Bar */}
      <div className="flex justify-between gap-2">
        <div className={cn(
          "flex-1 p-3 rounded-lg border bg-zinc-900 transition-all",
          match.currentTurn === 'X' ? "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]" : "border-zinc-800"
        )}>
          <div className="text-[9px] font-mono uppercase text-zinc-500 mb-1 flex items-center gap-1">
            <Shield size={10} /> Operator X
          </div>
          <div className="text-sm font-bold text-white truncate">
            {match.playerNames[match.players.X || ''] || '---'}
            {mySymbol === 'X' && <span className="ml-2 text-[10px] text-orange-500">(YOU)</span>}
          </div>
        </div>

        <div className={cn(
          "flex-1 p-3 rounded-lg border bg-zinc-900 transition-all",
          match.currentTurn === 'O' ? "border-zinc-300/50 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "border-zinc-800"
        )}>
          <div className="text-[9px] font-mono uppercase text-zinc-500 mb-1 flex items-center gap-1 text-right justify-end">
            Operator O <Shield size={10} />
          </div>
          <div className="text-sm font-bold text-white truncate text-right">
            {match.playerNames[match.players.O || ''] || '---'}
            {mySymbol === 'O' && <span className="mr-2 text-[10px] text-zinc-400">(YOU)</span>}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="p-4 bg-black border border-zinc-800 rounded-lg font-mono">
        <div className="flex items-start gap-3">
          <Terminal size={16} className="text-orange-500 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="text-[10px] uppercase text-zinc-500 tracking-widest">System Output</div>
            <div className="text-xs text-zinc-300 leading-relaxed">
              {match.status === 'WAITING' && (
                <span className="animate-pulse">Waiting for second operator to establish link...</span>
              )}
              {match.status === 'PLAYING' && (
                <span>
                  {isMyTurn ? (
                    <span className="text-orange-400 font-bold underline decoration-orange-500/30 underline-offset-4">Your turn. Select target cell.</span>
                  ) : (
                    <span>Opponent is calculating move...</span>
                  )}
                </span>
              )}
              {match.status === 'FINISHED' && (
                <div className="space-y-2">
                  <div className="text-white font-bold">
                    MATCH TERMINATED. WINNER: <span className="text-orange-500 uppercase">{match.playerNames[match.players[match.winner as 'X' | 'O'] || ''] || match.winner}</span>
                  </div>
                  <button 
                    onClick={onReset}
                    className="flex items-center gap-2 text-[10px] text-orange-500 hover:text-orange-400 transition-colors uppercase font-bold"
                  >
                    <RotateCcw size={12} /> Re-initialize Match
                  </button>
                </div>
              )}
              {match.status === 'DRAW' && (
                <div className="space-y-2">
                  <div className="text-zinc-400 font-bold italic">MATCH STALEMATE. NO WINNER DETECTED.</div>
                  <button 
                    onClick={onReset}
                    className="flex items-center gap-2 text-[10px] text-orange-500 hover:text-orange-400 transition-colors uppercase font-bold"
                  >
                    <RotateCcw size={12} /> Re-initialize Match
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Warning */}
      <div className="flex items-center gap-2 px-2 text-[9px] font-mono text-zinc-600 uppercase">
        <AlertCircle size={10} />
        <span>Authoritative Server Validation Active</span>
      </div>
    </div>
  );
}
