import "./styles/main.scss";

import { getThemeCards, getThemeFront, getThemeLabel } from "./assets";
import {
  calculateResult,
  createGameState,
  finishMismatch,
  getBoardColumns,
  getPlayerLabel,
  isGameComplete,
  selectCard,
} from "./game";
import type {
  BoardSize,
  Card,
  CardSelection,
  GameState,
  LayoutId,
  PlayerId,
  Settings,
  ThemeId,
} from "./model";
import gameOverTemplate from "./views/game-over.html?raw";
import gameTemplate from "./views/game.html?raw";
import homeTemplate from "./views/home.html?raw";
import settingsTemplate from "./views/settings.html?raw";

const APP_ROOT = document.getElementById("app") as HTMLElement;
const DEFAULT_SETTINGS: Settings = {
  boardSize: 16,
  theme: "coding",
  layout: "classic",
  player: "blue",
};
const MISMATCH_DELAY_MS = 1200;
const GAME_OVER_DELAY_MS = 700;
const CARD_ID_RADIX = 10;

type ActionName =
  | "go-home"
  | "go-settings"
  | "start-game"
  | "exit-game"
  | "back-to-game"
  | "confirm-exit-game"
  | "new-round"
  | "change-settings";
type SettingName = "player" | "boardSize" | "layout" | "theme";

let settings: Settings = { ...DEFAULT_SETTINGS };
let gameState: GameState | null = null;
let mismatchTimer: number | null = null;
let gameOverTimer: number | null = null;

/** Starts the application and installs delegated event handling. */
export function init(): void {
  APP_ROOT.addEventListener("click", handleRootClick);
  renderHome();
}

/** Renders the home screen. */
function renderHome(): void {
  clearTimers();
  gameState = null;
  document.body.dataset.screen = "home";
  applyVisualSettings();
  APP_ROOT.innerHTML = homeTemplate;
}

/** Renders the settings screen. */
function renderSettings(): void {
  clearTimers();
  gameState = null;
  document.body.dataset.screen = "settings";
  APP_ROOT.innerHTML = settingsTemplate;
  applyVisualSettings();
  syncSettingsControls();
}

/** Renders a new game board. */
function renderGame(): void {
  clearTimers();
  const cardAssets = getThemeCards(settings.theme);
  gameState = createGameState(settings.boardSize, cardAssets);
  document.body.dataset.screen = "game";
  APP_ROOT.innerHTML = gameTemplate;
  applyVisualSettings();
  renderBoard();
  updateGameHud();
}

/** Renders the final result screen. */
function renderGameOver(): void {
  clearTimers();
  document.body.dataset.screen = "gameOver";
  APP_ROOT.innerHTML = gameOverTemplate;
  applyVisualSettings();
  updateGameOver();
}

/** Opens the exit confirmation without changing the active game. */
function showExitGameConfirmation(): void {
  const dialog = APP_ROOT.querySelector<HTMLDialogElement>("#exit-game-confirmation");
  if (!dialog || dialog.open) {
    return;
  }
  dialog.showModal();
  dialog.querySelector<HTMLButtonElement>("[data-action='back-to-game']")?.focus();
}

/** Closes the exit confirmation when it is open. */
function closeExitGameConfirmation(): void {
  const dialog = APP_ROOT.querySelector<HTMLDialogElement>("#exit-game-confirmation");
  if (dialog?.open) {
    dialog.close();
  }
}

/** Handles clicks from any rendered screen. */
function handleRootClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const actionElement = target.closest<HTMLElement>("[data-action]");
  if (actionElement) {
    if (actionElement instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    handleAction(parseAction(actionElement.dataset.action));
    return;
  }
  const settingElement = target.closest<HTMLElement>("[data-setting]");
  if (settingElement) {
    handleSettingClick(settingElement);
    return;
  }
  const cardElement = target.closest<HTMLButtonElement>(".memory-card");
  if (cardElement) {
    handleCardClick(cardElement);
  }
}

/** Parses a known action name. */
function parseAction(value: string | undefined): ActionName | null {
  if (value === "go-home") {
    return "go-home";
  }
  if (value === "go-settings") {
    return "go-settings";
  }
  if (value === "start-game") {
    return "start-game";
  }
  if (value === "exit-game") {
    return "exit-game";
  }
  if (value === "back-to-game") {
    return "back-to-game";
  }
  if (value === "confirm-exit-game") {
    return "confirm-exit-game";
  }
  if (value === "new-round") {
    return "new-round";
  }
  if (value === "change-settings") {
    return "change-settings";
  }
  return null;
}

/** Executes a screen action. */
function handleAction(action: ActionName | null): void {
  if (!action) {
    return;
  }
  if (action === "go-home") {
    renderHome();
    return;
  }
  if (action === "exit-game") {
    showExitGameConfirmation();
    return;
  }
  if (action === "back-to-game") {
    closeExitGameConfirmation();
    return;
  }
  if (action === "confirm-exit-game") {
    closeExitGameConfirmation();
    renderSettings();
    return;
  }
  if (action === "go-settings" || action === "change-settings") {
    renderSettings();
    return;
  }
  if (action === "start-game" || action === "new-round") {
    renderGame();
  }
}

/** Parses a setting name from a control. */
function parseSettingName(value: string | undefined): SettingName | null {
  if (value === "player" || value === "boardSize" || value === "layout" || value === "theme") {
    return value;
  }
  return null;
}

/** Updates settings from a selected control. */
function handleSettingClick(element: HTMLElement): void {
  const name = parseSettingName(element.dataset.setting);
  const value = element.dataset.value;
  if (!name || !value) {
    return;
  }
  updateSetting(name, value);
}

/** Applies one validated setting value. */
function updateSetting(name: SettingName, value: string): void {
  if (name === "player") {
    settings.player = parsePlayer(value) ?? settings.player;
  } else if (name === "boardSize") {
    settings.boardSize = parseBoardSize(value) ?? settings.boardSize;
  } else if (name === "layout") {
    settings.layout = parseLayout(value) ?? settings.layout;
  } else {
    settings.theme = parseTheme(value) ?? settings.theme;
  }
  applyVisualSettings();
  syncSettingsControls();
}

/** Parses a player id. */
function parsePlayer(value: string): PlayerId | null {
  return value === "blue" || value === "orange" ? value : null;
}

/** Parses a board size. */
function parseBoardSize(value: string): BoardSize | null {
  if (value === "16") {
    return 16;
  }
  if (value === "24") {
    return 24;
  }
  if (value === "36") {
    return 36;
  }
  return null;
}

/** Parses a layout preset id. */
function parseLayout(value: string): LayoutId | null {
  if (value === "classic" || value === "modern") {
    return value;
  }
  return null;
}

/** Parses a theme id. */
function parseTheme(value: string): ThemeId | null {
  if (value === "coding" || value === "projects" || value === "foods") {
    return value;
  }
  return null;
}

/** Applies the theme hook to the document. */
function applyVisualSettings(): void {
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.dataset.layout = settings.layout;
}

/** Synchronizes selected states in the settings form. */
function syncSettingsControls(): void {
  const controls = APP_ROOT.querySelectorAll<HTMLElement>("[data-setting]");
  controls.forEach((control) => {
    const name = parseSettingName(control.dataset.setting);
    const value = control.dataset.value;
    if (!name || !value) {
      return;
    }
    const isSelected = isSettingSelected(name, value);
    control.classList.toggle("is-selected", isSelected);
    control.setAttribute("aria-pressed", String(isSelected));
  });
}

/** Checks whether a setting control matches current state. */
function isSettingSelected(name: SettingName, value: string): boolean {
  if (name === "player") {
    return settings.player === value;
  }
  if (name === "boardSize") {
    return String(settings.boardSize) === value;
  }
  if (name === "layout") {
    return settings.layout === value;
  }
  return settings.theme === value;
}

/** Renders all cards into the board. */
function renderBoard(): void {
  const board = APP_ROOT.querySelector<HTMLElement>("#game-board");
  if (!board || !gameState) {
    return;
  }
  board.style.setProperty("--board-columns", String(getBoardColumns(settings.boardSize)));
  board.dataset.boardSize = String(settings.boardSize);
  const frontAsset = getThemeFront(settings.theme);
  board.replaceChildren(...gameState.cards.map((card) => createCardElement(card, frontAsset)));
}

/** Creates one accessible card button. */
function createCardElement(card: Card, frontAsset: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "memory-card";
  button.dataset.cardId = String(card.id);
  button.disabled = card.matched;
  button.setAttribute("aria-label", getCardLabel(card));
  button.setAttribute("aria-pressed", String(card.faceUp || card.matched));
  const backFace = createCardFace("back", frontAsset, "");
  const frontFace = createCardFace("front", card.asset, getCardLabel(card));
  button.append(backFace, frontFace);
  return button;
}

/** Creates a card face, optionally containing an image. */
function createCardFace(modifier: "back" | "front", source: string, alt: string): HTMLSpanElement {
  const face = document.createElement("span");
  face.className = `card-face card-face--${modifier}`;
  if (source) {
    const image = document.createElement("img");
    image.src = source;
    image.alt = alt;
    face.append(image);
  }
  return face;
}

/** Returns an accessible card label. */
function getCardLabel(card: Card): string {
  if (card.matched) {
    return `Matched ${getThemeLabel(settings.theme)} card ${card.pairId + 1}`;
  }
  if (card.faceUp) {
    return `Revealed ${getThemeLabel(settings.theme)} card ${card.pairId + 1}`;
  }
  return "Hidden memory card";
}

/** Handles a card button click. */
function handleCardClick(button: HTMLButtonElement): void {
  const cardId = parseCardId(button.dataset.cardId);
  if (cardId === null || !gameState) {
    return;
  }
  handleSelection(selectCard(gameState, cardId));
}

/** Parses a numeric card id. */
function parseCardId(value: string | undefined): number | null {
  if (!value) {
    return null;
  }
  const cardId = Number.parseInt(value, CARD_ID_RADIX);
  return Number.isNaN(cardId) ? null : cardId;
}

/** Applies a game logic selection result. */
function handleSelection(selection: CardSelection): void {
  if (selection.kind === "invalid") {
    return;
  }
  if (selection.kind === "opened") {
    updateCardElement(selection.card);
  } else {
    selection.cards.forEach((card) => updateCardElement(card));
  }
  updateGameHud();
  if (selection.kind === "matched" && gameState && isGameComplete(gameState)) {
    scheduleGameOver();
  }
  if (selection.kind === "mismatch") {
    scheduleMismatch(selection.cards.map((card) => card.id));
  }
}

/** Updates one card's DOM state. */
function updateCardElement(card: Card): void {
  const button = APP_ROOT.querySelector<HTMLButtonElement>(`[data-card-id="${card.id}"]`);
  if (!button) {
    return;
  }
  const revealed = card.faceUp || card.matched;
  button.classList.toggle("is-flipped", revealed);
  button.classList.toggle("is-matched", card.matched);
  button.disabled = card.matched;
  button.setAttribute("aria-pressed", String(revealed));
  button.setAttribute("aria-label", getCardLabel(card));
}

/** Updates scores, turn, board label, and remaining pairs. */
function updateGameHud(): void {
  if (!gameState) {
    return;
  }
  setText("[data-score='blue']", String(gameState.scores.blue));
  setText("[data-score='orange']", String(gameState.scores.orange));
  setText("[data-current-player]", getPlayerLabel(gameState.currentPlayer));
  setText("[data-board-label]", getBoardLabel());
  setText("[data-pairs-left]", String(getPairsLeft()));
}

/** Returns the current board description. */
function getBoardLabel(): string {
  const dimensions = settings.boardSize === 24 ? "4 × 6" : settings.boardSize === 36 ? "6 × 6" : "4 × 4";
  return `${dimensions} · ${getThemeLabel(settings.theme)}`;
}

/** Returns the number of unmatched pairs. */
function getPairsLeft(): number {
  if (!gameState) {
    return 0;
  }
  const matchedCards = gameState.cards.filter((card) => card.matched).length;
  return gameState.cards.length / 2 - matchedCards / 2;
}

/** Schedules mismatch flip-back. */
function scheduleMismatch(cardIds: readonly number[]): void {
  clearMismatchTimer();
  mismatchTimer = window.setTimeout(() => resolveMismatch(cardIds), MISMATCH_DELAY_MS);
}

/** Flips mismatched cards back and passes the turn. */
function resolveMismatch(cardIds: readonly number[]): void {
  if (!gameState) {
    return;
  }
  finishMismatch(gameState, cardIds);
  gameState.cards.forEach((card) => updateCardElement(card));
  updateGameHud();
}

/** Schedules the result screen after the final match. */
function scheduleGameOver(): void {
  clearGameOverTimer();
  gameOverTimer = window.setTimeout(renderGameOver, GAME_OVER_DELAY_MS);
}

/** Updates the result screen content. */
function updateGameOver(): void {
  if (!gameState) {
    return;
  }
  const result = calculateResult(gameState);
  setText("[data-result-message]", getResultMessage(result.draw, result.winner));
  setText("[data-final-score='blue']", String(result.scores.blue));
  setText("[data-final-score='orange']", String(result.scores.orange));
}

/** Returns the final result message. */
function getResultMessage(draw: boolean, winner: PlayerId | null): string {
  if (draw) {
    return "The round ends in a draw.";
  }
  return `${getPlayerLabel(winner ?? "blue")} wins this round.`;
}

/** Sets text on the first matching element. */
function setText(selector: string, value: string): void {
  const element = APP_ROOT.querySelector<HTMLElement>(selector);
  if (element) {
    element.textContent = value;
  }
}

/** Clears the mismatch timer. */
function clearMismatchTimer(): void {
  if (mismatchTimer !== null) {
    window.clearTimeout(mismatchTimer);
    mismatchTimer = null;
  }
}

/** Clears the game-over timer. */
function clearGameOverTimer(): void {
  if (gameOverTimer !== null) {
    window.clearTimeout(gameOverTimer);
    gameOverTimer = null;
  }
}

/** Clears all pending timers. */
function clearTimers(): void {
  clearMismatchTimer();
  clearGameOverTimer();
}
