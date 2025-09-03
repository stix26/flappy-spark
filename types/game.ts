export type GameState = 'waiting' | 'playing' | 'gameOver';

export interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}