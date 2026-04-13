import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface MatchState {
  id: string;
  board: (string | null)[];
  players: { X: string | null; O: string | null };
  playerNames: { [id: string]: string };
  currentTurn: 'X' | 'O';
  status: 'WAITING' | 'PLAYING' | 'FINISHED' | 'DRAW';
  winner: string | null;
  winningLine: number[] | null;
}

const matches = new Map<string, MatchState>();

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  const PORT = 3000;

  // Game Logic Helpers
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  function checkWinner(board: (string | null)[]) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line };
      }
    }
    return null;
  }

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_match', ({ matchId, playerName }) => {
      let match = matches.get(matchId);

      if (!match) {
        match = {
          id: matchId,
          board: Array(9).fill(null),
          players: { X: socket.id, O: null },
          playerNames: { [socket.id]: playerName || 'Player 1' },
          currentTurn: 'X',
          status: 'WAITING',
          winner: null,
          winningLine: null,
        };
        matches.set(matchId, match);
      } else if (match.status === 'WAITING' && match.players.X !== socket.id) {
        match.players.O = socket.id;
        match.playerNames[socket.id] = playerName || 'Player 2';
        match.status = 'PLAYING';
      } else {
        // Spectator or reconnecting
        if (match.players.X === socket.id || match.players.O === socket.id) {
          // Reconnecting - update name if changed
          match.playerNames[socket.id] = playerName || match.playerNames[socket.id];
        }
      }

      socket.join(matchId);
      io.to(matchId).emit('match_update', match);
    });

    socket.on('make_move', ({ matchId, index }) => {
      const match = matches.get(matchId);
      if (!match || match.status !== 'PLAYING') return;

      const playerSymbol = match.players.X === socket.id ? 'X' : (match.players.O === socket.id ? 'O' : null);
      
      // Server-Authoritative Validation
      if (!playerSymbol) return; // Not a player
      if (match.currentTurn !== playerSymbol) return; // Not their turn
      if (match.board[index] !== null) return; // Cell already taken

      // Apply Move
      match.board[index] = playerSymbol;
      
      // Check Win/Draw
      const winResult = checkWinner(match.board);
      if (winResult) {
        match.status = 'FINISHED';
        match.winner = winResult.winner;
        match.winningLine = winResult.line;
      } else if (match.board.every(cell => cell !== null)) {
        match.status = 'DRAW';
      } else {
        // Switch Turn
        match.currentTurn = match.currentTurn === 'X' ? 'O' : 'X';
      }

      io.to(matchId).emit('match_update', match);
    });

    socket.on('reset_match', (matchId) => {
      const match = matches.get(matchId);
      if (!match) return;

      match.board = Array(9).fill(null);
      match.currentTurn = 'X';
      match.status = match.players.O ? 'PLAYING' : 'WAITING';
      match.winner = null;
      match.winningLine = null;

      io.to(matchId).emit('match_update', match);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Handle disconnects gracefully - could mark player as offline
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
