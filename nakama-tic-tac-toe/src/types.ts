export interface MatchState {
  id: string;
  board: (string | null)[];
  players: { X: string | null; O: string | null };
  playerNames: { [id: string]: string };
  currentTurn: 'X' | 'O';
  status: 'WAITING' | 'PLAYING' | 'FINISHED' | 'DRAW';
  winner: string | null;
  winningLine: number[] | null;
}
