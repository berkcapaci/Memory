export type BoardSize = 16 | 24 | 36;
export type PlayerId = "blue" | "orange";
export type ThemeId = "coding" | "projects" | "foods";
export type LayoutId = "classic" | "modern";

export interface Card {
  id: number;
  pairId: number;
  asset: string;
  faceUp: boolean;
  matched: boolean;
}

export interface Settings {
  boardSize: BoardSize;
  theme: ThemeId;
  layout: LayoutId;
  player: PlayerId;
}

export interface GameState {
  cards: Card[];
  currentPlayer: PlayerId;
  scores: Record<PlayerId, number>;
  firstSelectionId: number | null;
  inputLocked: boolean;
  complete: boolean;
}

export interface GameResult {
  winner: PlayerId | null;
  draw: boolean;
  scores: Record<PlayerId, number>;
}

export type CardSelection =
  | { kind: "invalid" }
  | { kind: "opened"; card: Card }
  | { kind: "matched"; cards: [Card, Card] }
  | { kind: "mismatch"; cards: [Card, Card]; nextPlayer: PlayerId };

export interface ThemeAssetDefinition {
  id: ThemeId;
  label: string;
  cards: readonly string[];
  front: string;
}

export type ThemeAssetRecord = Record<ThemeId, ThemeAssetDefinition>;
