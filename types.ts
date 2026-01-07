export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  CREATE_MODE = 'CREATE_MODE'
}

export interface LevelData {
  id: number;
  baseEmoji: string;
  targetEmoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridSize: number; // e.g. 3 for 3x3, 5 for 5x5
}

export interface GameStats {
  score: number;
  level: number;
  history: { level: number; timeTaken: number }[];
}

// More challenging levels for a smart 6-year-old
export const FALLBACK_LEVELS: LevelData[] = [
  { id: 1, baseEmoji: '🕐', targetEmoji: '🕑', difficulty: 'medium', gridSize: 5 },
  { id: 2, baseEmoji: '🧐', targetEmoji: '🤓', difficulty: 'medium', gridSize: 6 },
  { id: 3, baseEmoji: '🐱', targetEmoji: '🐯', difficulty: 'medium', gridSize: 6 },
  { id: 4, baseEmoji: '🌑', targetEmoji: '🌚', difficulty: 'hard', gridSize: 7 },
  { id: 5, baseEmoji: '🚍', targetEmoji: '🚌', difficulty: 'hard', gridSize: 8 },
  { id: 6, baseEmoji: '📆', targetEmoji: '📅', difficulty: 'hard', gridSize: 8 },
  { id: 7, baseEmoji: '🍤', targetEmoji: '🦐', difficulty: 'hard', gridSize: 9 },
  { id: 8, baseEmoji: '🅰️', targetEmoji: '🅱️', difficulty: 'hard', gridSize: 9 },
];