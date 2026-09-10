import type {
  BoardSize,
  Card,
  CardSelection,
  GameResult,
  GameState,
  PlayerId,
} from "./model";

const MATCH_SCORE = 1;

/** Creates a fresh game state for the selected board. */
export function createGameState(
  boardSize: BoardSize,
  cardAssets: readonly string[],
): GameState {
  return {
    cards: createDeck(boardSize, cardAssets),
    currentPlayer: "blue",
    scores: { blue: 0, orange: 0 },
    firstSelectionId: null,
    inputLocked: false,
    complete: false,
  };
}

/** Builds and shuffles a deck with the requested number of cards. */
export function createDeck(
  boardSize: BoardSize,
  cardAssets: readonly string[],
): Card[] {
  const pairCount = boardSize / 2;
  const selectedAssets = cardAssets.slice(0, pairCount);
  const cards = createCards(selectedAssets);
  return shuffleCards(cards);
}

/** Creates two card instances for every selected asset. */
function createCards(cardAssets: readonly string[]): Card[] {
  let nextId = 1;
  const cards: Card[] = [];
  cardAssets.forEach((asset, pairIndex) => {
    cards.push(createCard(nextId++, pairIndex, asset));
    cards.push(createCard(nextId++, pairIndex, asset));
  });
  return cards;
}

/** Creates one typed card instance. */
function createCard(id: number, pairId: number, asset: string): Card {
  return { id, pairId, asset, faceUp: false, matched: false };
}

/** Randomizes card order with an in-place Fisher-Yates shuffle. */
function shuffleCards(cards: Card[]): Card[] {
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }
  return cards;
}

/** Selects a card and resolves the second selection when needed. */
export function selectCard(
  state: GameState,
  cardId: number,
): CardSelection {
  if (state.complete || state.inputLocked) {
    return { kind: "invalid" };
  }
  const card = findCard(state, cardId);
  if (!card || card.faceUp || card.matched) {
    return { kind: "invalid" };
  }
  if (state.firstSelectionId === null) {
    return openFirstCard(state, card);
  }
  return openSecondCard(state, card);
}

/** Opens the first selected card. */
function openFirstCard(state: GameState, card: Card): CardSelection {
  card.faceUp = true;
  state.firstSelectionId = card.id;
  return { kind: "opened", card };
}

/** Resolves a match or locks a mismatch for later flip-back. */
function openSecondCard(state: GameState, card: Card): CardSelection {
  const firstCard = findCard(state, state.firstSelectionId);
  if (!firstCard) {
    return { kind: "invalid" };
  }
  card.faceUp = true;
  state.inputLocked = true;
  if (firstCard.pairId === card.pairId) {
    return resolveMatch(state, firstCard, card);
  }
  return {
    kind: "mismatch",
    cards: [firstCard, card],
    nextPlayer: getOtherPlayer(state.currentPlayer),
  };
}

/** Marks a match, scores it, and leaves the current player active. */
function resolveMatch(
  state: GameState,
  firstCard: Card,
  secondCard: Card,
): CardSelection {
  firstCard.matched = true;
  secondCard.matched = true;
  state.scores[state.currentPlayer] += MATCH_SCORE;
  state.firstSelectionId = null;
  state.inputLocked = false;
  state.complete = isGameComplete(state);
  return { kind: "matched", cards: [firstCard, secondCard] };
}

/** Closes a mismatch and passes the turn. */
export function finishMismatch(
  state: GameState,
  cardIds: readonly number[],
): void {
  state.cards.forEach((card) => {
    if (cardIds.includes(card.id)) {
      card.faceUp = false;
    }
  });
  state.firstSelectionId = null;
  state.inputLocked = false;
  state.currentPlayer = getOtherPlayer(state.currentPlayer);
}

/** Returns whether every card has been matched. */
export function isGameComplete(state: GameState): boolean {
  return state.cards.every((card) => card.matched);
}

/** Calculates the final winner or draw. */
export function calculateResult(state: GameState): GameResult {
  const blueScore = state.scores.blue;
  const orangeScore = state.scores.orange;
  return {
    winner: blueScore === orangeScore ? null : blueScore > orangeScore ? "blue" : "orange",
    draw: blueScore === orangeScore,
    scores: { ...state.scores },
  };
}

/** Finds a card by its id. */
function findCard(state: GameState, cardId: number | null): Card | null {
  if (cardId === null) {
    return null;
  }
  return state.cards.find((card) => card.id === cardId) ?? null;
}

/** Returns the other player id. */
function getOtherPlayer(player: PlayerId): PlayerId {
  return player === "blue" ? "orange" : "blue";
}

/** Returns the number of columns for a board size. */
export function getBoardColumns(boardSize: BoardSize): number {
  if (boardSize === 24) {
    return 6;
  }
  if (boardSize === 36) {
    return 6;
  }
  return 4;
}

/** Returns a human-readable player label. */
export function getPlayerLabel(player: PlayerId): string {
  return player === "blue" ? "Blue" : "Orange";
}

