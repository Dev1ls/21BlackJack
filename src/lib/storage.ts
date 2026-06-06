import { es } from '../i18n/locales';
import type { AppState } from '../types/blackjack';
import { DEFAULT_DECK_COUNT, DEFAULT_PLAYER_COUNT } from '../types/blackjack';
import { migrateLegacyState } from './handPhase';

const STORAGE_KEY = 'bj-live-helper-state';

function createDefaultPlayers(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: es.players.playerName(i + 1),
    hands: [
      {
        id: `hand-${i + 1}-1`,
        cards: [] as import('../types/blackjack').CardRank[],
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

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return migrateLegacyState({ ...getDefaultState(), ...parsed });
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
