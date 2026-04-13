import { useState, useEffect } from 'react';
import { socket } from './lib/socket';
import { MatchState } from './types';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import MatchStatus from './components/MatchStatus';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut } from 'lucide-react';

export default function App() {
  const [match, setMatch] = useState<MatchState | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [matchId, setMatchId] = useState('');

  useEffect(() => {
    socket.on('match_update', (updatedMatch: MatchState) => {
      setMatch(updatedMatch);
    });

    return () => {
      socket.off('match_update');
    };
  }, []);

  const handleJoin = (id: string, name: string) => {
    setMatchId(id);
    setPlayerName(name);
    socket.emit('join_match', { matchId: id, playerName: name });
  };

  const handleMove = (index: number) => {
    if (matchId) {
      socket.emit('make_move', { matchId, index });
    }
  };

  const handleReset = () => {
    if (matchId) {
      socket.emit('reset_match', matchId);
    }
  };

  const handleLeave = () => {
    setMatch(null);
    setMatchId('');
    // Optionally emit a leave event
  };

  const mySymbol = match?.players.X === socket.id ? 'X' : (match?.players.O === socket.id ? 'O' : null);

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        <AnimatePresence mode="wait">
          {!match ? (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <Lobby onJoin={handleJoin} />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center space-y-8"
            >
              <div className="flex items-center justify-between w-full max-w-[320px]">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white italic tracking-tighter">
                    MATCH: <span className="text-orange-500">{match.id}</span>
                  </h2>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    Live Connection
                  </div>
                </div>
                <button
                  onClick={handleLeave}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                  title="Leave Match"
                >
                  <LogOut size={20} />
                </button>
              </div>

              <GameBoard 
                match={match} 
                onMove={handleMove} 
                mySymbol={mySymbol} 
              />

              <MatchStatus 
                match={match} 
                mySymbol={mySymbol} 
                onReset={handleReset} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-auto pt-12 text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em] text-center">
          &copy; 2026 NAKAMA SYSTEMS &bull; ENCRYPTED CHANNEL &bull; {new Date().toLocaleTimeString()}
        </footer>
      </main>
    </div>
  );
}
