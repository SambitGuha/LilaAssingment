import React, { useState } from 'react';
import { socket } from '../lib/socket';
import { cn } from '../lib/utils';
import { Hash, User, Play } from 'lucide-react';

interface LobbyProps {
  onJoin: (matchId: string, playerName: string) => void;
}

export default function Lobby({ onJoin }: LobbyProps) {
  const [matchId, setMatchId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchId.trim() && playerName.trim()) {
      onJoin(matchId.trim(), playerName.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic">
          Nakama <span className="text-orange-500">Protocol</span>
        </h1>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Server-Authoritative Matchmaking v1.0
        </p>
      </div>

      <form 
        onSubmit={handleJoin}
        className="w-full max-w-sm p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl space-y-6"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-2">
              <User size={12} /> Operator Identity
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-colors font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-2">
              <Hash size={12} /> Match ID
            </label>
            <input
              type="text"
              placeholder="e.g. ALPHA-9"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-colors font-mono"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-md transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
        >
          <Play size={18} className="fill-current" />
          <span className="uppercase tracking-tight">Initialize Match</span>
        </button>

        <div className="pt-4 border-t border-zinc-800/50">
          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-600 uppercase">
            <span>Status: Ready</span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              Secure Link Established
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
