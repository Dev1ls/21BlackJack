import { afterEach, describe, expect, it, vi } from 'vitest';
import { es } from '../i18n/locales';
import type { AppState, SavedRound } from '../types/blackjack';
import { MAX_PLAYERS, MIN_PLAYERS } from '../types/blackjack';
import {
  MAX_SAVED_ROUNDS,
  STORAGE_KEY,
  capSavedRounds,
  clearState,
  getDefaultState,
  loadState,
  sanitizeAppState,
  saveState,
} from './storage';

function round(id: string): SavedRound {
  return { id, timestamp: 1, cards: ['A'] };
}

function installMemoryStorage() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
  };
  vi.stubGlobal('localStorage', localStorage);
  return store;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getDefaultState', () => {
  it('starts with Spanish player names', () => {
    const state = getDefaultState();
    expect(state.players[0].name).toBe('Jugador 1');
    expect(state.players.length).toBe(1);
  });

  it('respects player count limits', () => {
    const state = getDefaultState();
    expect(state.players.length).toBeGreaterThanOrEqual(MIN_PLAYERS);
    expect(state.players.length).toBeLessThanOrEqual(MAX_PLAYERS);
  });

  it('uses es naming pattern for default players', () => {
    const state = getDefaultState();
    state.players.forEach((player, index) => {
      expect(player.name).toBe(es.players.playerName(index + 1));
    });
  });
});

describe('capSavedRounds', () => {
  it('keeps the newest rounds when the history is over the cap', () => {
    const rounds = Array.from({ length: MAX_SAVED_ROUNDS + 25 }, (_, index) => round(`r${index}`));
    const capped = capSavedRounds(rounds);
    expect(capped).toHaveLength(MAX_SAVED_ROUNDS);
    expect(capped[0].id).toBe('r25');
    expect(capped.at(-1)?.id).toBe(`r${MAX_SAVED_ROUNDS + 24}`);
  });
});

describe('saveState and loadState', () => {
  it('round-trips a practice session', () => {
    installMemoryStorage();
    const state: AppState = {
      ...getDefaultState(),
      deckCount: 6,
      dealerUpcard: '10',
      savedRounds: [round('kept')],
    };
    expect(saveState(state)).toBe('ok');
    expect(loadState()).toMatchObject({
      deckCount: 6,
      dealerUpcard: '10',
      savedRounds: [round('kept')],
    });
  });

  it('stores only the last 500 rounds', () => {
    installMemoryStorage();
    const savedRounds = Array.from({ length: 600 }, (_, index) => round(`r${index}`));
    expect(saveState({ ...getDefaultState(), savedRounds })).toBe('ok');
    const loaded = loadState();
    expect(loaded.savedRounds).toHaveLength(MAX_SAVED_ROUNDS);
    expect(loaded.savedRounds[0].id).toBe('r100');
    expect(loaded.savedRounds.at(-1)?.id).toBe('r599');
  });

  it('drops saved history and reports trimmed when the full write exceeds quota', () => {
    const store = new Map<string, string>();
    let calls = 0;
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        calls += 1;
        if (calls === 1) throw new Error('QuotaExceededError');
        store.set(key, value);
      },
      removeItem: (key: string) => store.delete(key),
    });

    const result = saveState({ ...getDefaultState(), savedRounds: [round('old')] });
    expect(result).toBe('trimmed');
    expect(JSON.parse(store.get(STORAGE_KEY) ?? '{}').savedRounds).toEqual([]);
  });

  it('does not throw when storage rejects every write', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    });

    expect(saveState(getDefaultState())).toBe('failed');
    expect(() => clearState()).not.toThrow();
  });

  it('returns the default session when saved JSON is corrupt', () => {
    const store = installMemoryStorage();
    store.set(STORAGE_KEY, '{');
    expect(loadState().players[0].name).toBe('Jugador 1');
    expect(loadState().savedRounds).toEqual([]);
  });

  it('sanitizes invalid types instead of passing them to the UI', () => {
    const store = installMemoryStorage();
    store.set(
      STORAGE_KEY,
      JSON.stringify({
        deckCount: 'ocho',
        handPhase: 'flying',
        dealerUpcard: 'Z',
        dealerCard: 'K',
        players: [
          {
            id: 'p1',
            name: 'Ana',
            hands: [{ id: 'h1', cards: ['A', 'nope', 3], status: 'nope' }],
          },
        ],
        savedRounds: [
          { id: 'ok', timestamp: 4, cards: ['Q'] },
          { id: 'bad', cards: 'x' },
          { not: 'a round' },
        ],
        preliminaryDecision: { action: 'FOLD', playerId: 'p1', runningCount: 1, trueCount: 1, handIndex: 0 },
        extraCards: ['2', false],
      }),
    );

    const loaded = loadState();
    expect(loaded.deckCount).toBe(8);
    expect(loaded.handPhase).toBe('opening');
    expect(loaded.dealerUpcard).toBe('K');
    expect(loaded.players[0].hands[0].cards).toEqual(['A']);
    expect(loaded.players[0].hands[0].status).toBe('playing');
    expect(loaded.savedRounds).toEqual([{ id: 'ok', timestamp: 4, cards: ['Q'] }]);
    expect(loaded.preliminaryDecision).toBeNull();
    expect(loaded.extraCards).toEqual(['2']);
  });

  it('falls back to a fresh session when the saved value is not an object', () => {
    expect(sanitizeAppState(null).mePlayerId).toBe('player-1');
    expect(sanitizeAppState(['nope']).savedRounds).toEqual([]);
    expect(sanitizeAppState('hi').deckCount).toBe(8);
  });
});
