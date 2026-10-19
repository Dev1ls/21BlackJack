import { es } from '../i18n/locales';
import type { AppState, CardRank, HandPhase, HandStatus, Player, PlayerHand, PreliminaryDecision, SavedRound, StrategyAction } from '../types/blackjack';
import { CARD_RANKS, DEFAULT_DECK_COUNT, DEFAULT_PLAYER_COUNT, MAX_PLAYERS } from '../types/blackjack';
import { migrateLegacyState } from './handPhase';

export const STORAGE_KEY = 'bj-live-helper-state';

/** Keep the newest rounds so a long practice session cannot grow without a limit. */
export const MAX_SAVED_ROUNDS = 500;

const HAND_PHASES: readonly HandPhase[] = [
  'opening',
  'playerTurn',
  'dealerReveal',
  'dealerDraw',
  'roundEnd',
];

const HAND_STATUSES: readonly HandStatus[] = ['playing', 'stood', 'doubled', 'bust', 'blackjack'];

const STRATEGY_ACTIONS: readonly StrategyAction[] = [
  'HIT',
  'STAND',
  'DOUBLE',
  'SPLIT',
  'BUST',
  'BLACKJACK',
  '21',
  'INSURANCE',
];

const CARD_SET = new Set<string>(CARD_RANKS);

export type SaveResult = 'ok' | 'trimmed' | 'failed';

function createDefaultPlayers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: es.players.playerName(i + 1),
    hands: [
      {
        id: `hand-${i + 1}-1`,
        cards: [] as CardRank[],
        status: 'playing' as const,
      },
    ],
  }));
}

export function getDefaultState(): AppState {
  const players = createDefaultPlayers(DEFAULT_PLAYER_COUNT);
  return {
    deckCount: DEFAULT_DECK_COUNT,
    players,
    mePlayerId: players[0].id,
    activeHandIndex: 0,
    dealerUpcard: null,
    dealerHoleCard: null,
    dealerHoleRevealed: false,
    dealerDrawCards: [],
    handPhase: 'opening',
    extraCards: [],
    savedRounds: [],
    preliminaryDecision: null,
  };
}

export function capSavedRounds<T>(rounds: T[]): T[] {
  if (rounds.length <= MAX_SAVED_ROUNDS) return rounds;
  return rounds.slice(rounds.length - MAX_SAVED_ROUNDS);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isCard(value: unknown): value is CardRank {
  return typeof value === 'string' && CARD_SET.has(value);
}

function sanitizeCards(value: unknown): CardRank[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isCard);
}

function sanitizePlayers(value: unknown): Player[] {
  if (!Array.isArray(value)) return [];
  const players: Player[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.id !== 'string' || item.id.length === 0) continue;
    const name = typeof item.name === 'string' && item.name.trim() ? item.name : es.players.playerName(players.length + 1);
    const handsRaw = Array.isArray(item.hands) ? item.hands : [];
    const hands: PlayerHand[] = [];
    for (const hand of handsRaw) {
      if (!isRecord(hand) || typeof hand.id !== 'string' || hand.id.length === 0) continue;
      const status = HAND_STATUSES.includes(hand.status as HandStatus)
        ? (hand.status as HandStatus)
        : 'playing';
      hands.push({ id: hand.id, cards: sanitizeCards(hand.cards), status });
    }
    if (hands.length === 0) {
      hands.push({ id: `${item.id}-hand`, cards: [], status: 'playing' });
    }
    players.push({ id: item.id, name, hands });
  }
  return players;
}

function sanitizeRounds(value: unknown): SavedRound[] {
  if (!Array.isArray(value)) return [];
  const rounds: SavedRound[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    const cards = sanitizeCards(item.cards);
    if (cards.length === 0) continue;
    rounds.push({
      id: typeof item.id === 'string' && item.id ? item.id : `round-${rounds.length}`,
      timestamp: typeof item.timestamp === 'number' && Number.isFinite(item.timestamp) ? item.timestamp : 0,
      cards,
    });
  }
  return rounds;
}

function sanitizePreliminary(value: unknown): PreliminaryDecision | null {
  if (!isRecord(value)) return null;
  if (!STRATEGY_ACTIONS.includes(value.action as StrategyAction)) return null;
  if (typeof value.playerId !== 'string' || value.playerId.length === 0) return null;
  if (typeof value.runningCount !== 'number' || !Number.isFinite(value.runningCount)) return null;
  if (typeof value.trueCount !== 'number' || !Number.isFinite(value.trueCount)) return null;
  if (typeof value.handIndex !== 'number' || !Number.isFinite(value.handIndex) || value.handIndex < 0) {
    return null;
  }
  return {
    action: value.action as StrategyAction,
    runningCount: value.runningCount,
    trueCount: value.trueCount,
    playerId: value.playerId,
    handIndex: Math.floor(value.handIndex),
  };
}

/** Drop corrupt or outdated fields instead of rendering them. */
export function sanitizeAppState(parsed: unknown): AppState {
  const defaults = getDefaultState();
  if (!isRecord(parsed)) return defaults;

  const players = sanitizePlayers(parsed.players).slice(0, MAX_PLAYERS);
  const usedPlayers = players.length > 0 ? players : defaults.players;
  const requestedMe = typeof parsed.mePlayerId === 'string' ? parsed.mePlayerId : null;
  const mePlayerId = usedPlayers.some((player) => player.id === requestedMe)
    ? requestedMe
    : usedPlayers[0].id;

  const deckCount =
    typeof parsed.deckCount === 'number' && Number.isFinite(parsed.deckCount)
      ? Math.min(8, Math.max(1, Math.round(parsed.deckCount)))
      : defaults.deckCount;

  const activeHandIndex =
    typeof parsed.activeHandIndex === 'number' &&
    Number.isFinite(parsed.activeHandIndex) &&
    parsed.activeHandIndex >= 0
      ? Math.floor(parsed.activeHandIndex)
      : 0;

  const handPhase = HAND_PHASES.includes(parsed.handPhase as HandPhase)
    ? (parsed.handPhase as HandPhase)
    : 'opening';

  try {
    const migrated = migrateLegacyState({
      ...defaults,
      deckCount,
      players: usedPlayers,
      mePlayerId,
      activeHandIndex,
      dealerUpcard: isCard(parsed.dealerUpcard) ? parsed.dealerUpcard : null,
      dealerCard: isCard(parsed.dealerCard) ? parsed.dealerCard : null,
      dealerHoleCard: isCard(parsed.dealerHoleCard) ? parsed.dealerHoleCard : null,
      dealerHoleRevealed: parsed.dealerHoleRevealed === true,
      dealerDrawCards: sanitizeCards(parsed.dealerDrawCards),
      handPhase,
      extraCards: sanitizeCards(parsed.extraCards),
      savedRounds: capSavedRounds(sanitizeRounds(parsed.savedRounds)),
      preliminaryDecision: sanitizePreliminary(parsed.preliminaryDecision),
    });

    return {
      ...migrated,
      deckCount: Math.min(8, Math.max(1, Math.round(migrated.deckCount) || defaults.deckCount)),
      players: migrated.players.length > 0 ? migrated.players.slice(0, MAX_PLAYERS) : defaults.players,
      savedRounds: capSavedRounds(migrated.savedRounds),
    };
  } catch {
    return defaults;
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return sanitizeAppState(JSON.parse(raw));
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppState): SaveResult {
  const prepared: AppState = {
    ...state,
    savedRounds: capSavedRounds(state.savedRounds),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prepared));
    return 'ok';
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prepared, savedRounds: [] }));
      return 'trimmed';
    } catch {
      return 'failed';
    }
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Private mode or a blocked storage API should not crash the reset. */
  }
}
