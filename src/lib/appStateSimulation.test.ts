import { describe, expect, it } from 'vitest';
import {
  applyPlayerUpdates,
  getActiveHandEntry,
  getMePlayer,
} from './handPhase';
import { getDefaultState } from './storage';
import type { AppState, CardRank, Player } from '../types/blackjack';

/** Simula el patrón stale de App.tsx (closure + setState por patch). */
function createStaleAppModel() {
  let renderState = getDefaultState();
  const pending: Array<(prev: AppState) => AppState> = [];

  const flush = () => {
    for (const fn of pending) {
      renderState = fn(renderState);
    }
    pending.length = 0;
    return renderState;
  };

  const queuePatch = (patch: Partial<AppState>) => {
    pending.push((prev) => ({ ...prev, ...patch }));
  };

  const updateMePlayers = (players: Player[], activeHandIndex = renderState.activeHandIndex) => {
    queuePatch(applyPlayerUpdates(renderState, players, activeHandIndex));
  };

  const handleMeAddCard = (card: CardRank) => {
    const me = getMePlayer(renderState);
    const activeEntry = me ? getActiveHandEntry(me, renderState.activeHandIndex) : null;
    if (!me || !activeEntry) return;
    const { index } = activeEntry;
    const players = renderState.players.map((p) => {
      if (p.id !== me.id) return p;
      return {
        ...p,
        hands: p.hands.map((h, hi) =>
          hi !== index ? h : { ...h, cards: [...h.cards, card] },
        ),
      };
    });
    updateMePlayers(players);
  };

  const handleSetUpcard = (card: CardRank | null) => {
    pending.push((prev) => {
      const next = { ...prev, dealerUpcard: card };
      if (!card) next.handPhase = 'opening';
      return { ...next, ...applyPlayerUpdates(next, next.players) };
    });
  };

  return {
    get renderState() {
      return renderState;
    },
    handleMeAddCard,
    handleSetUpcard,
    flush,
  };
}

describe('simulación React: closure obsoleto en App.tsx', () => {
  it('dos toques rápidos sin re-render pierden la primera carta', () => {
    const app = createStaleAppModel();
    app.handleMeAddCard('10');
    app.handleMeAddCard('7');
    const state = app.flush();
    expect(getMePlayer(state)!.hands[0].cards).toEqual(['7']);
  });

  it('dealer tras dos toques rápidos deja solo la última carta', () => {
    const app = createStaleAppModel();
    app.handleMeAddCard('10');
    app.handleMeAddCard('7');
    app.handleSetUpcard('6');
    const state = app.flush();
    expect(getMePlayer(state)!.hands[0].cards).toEqual(['7']);
  });
});

/** Simula el patrón corregido (setState funcional con prev). */
function createFixedAppModel() {
  const pending: Array<(prev: AppState) => AppState> = [];
  let renderState = getDefaultState();

  const flush = () => {
    for (const fn of pending) {
      renderState = fn(renderState);
    }
    pending.length = 0;
    return renderState;
  };

  const applyPlayersUpdate = (
    build: (prev: AppState) => { players: Player[]; activeHandIndex?: number },
  ) => {
    pending.push((prev) => {
      const { players, activeHandIndex = prev.activeHandIndex } = build(prev);
      return { ...prev, ...applyPlayerUpdates(prev, players, activeHandIndex) };
    });
  };

  const handleMeAddCard = (card: CardRank) => {
    applyPlayersUpdate((prev) => {
      const me = getMePlayer(prev);
      if (!me) return { players: prev.players };
      const entry = getActiveHandEntry(me, prev.activeHandIndex);
      if (!entry) return { players: prev.players };
      const { index } = entry;
      const players = prev.players.map((p) => {
        if (p.id !== me.id) return p;
        return {
          ...p,
          hands: p.hands.map((h, hi) =>
            hi !== index ? h : { ...h, cards: [...h.cards, card] },
          ),
        };
      });
      return { players };
    });
  };

  const handleSetUpcard = (card: CardRank | null) => {
    pending.push((prev) => {
      const next = { ...prev, dealerUpcard: card };
      if (!card) next.handPhase = 'opening';
      return { ...next, ...applyPlayerUpdates(next, next.players) };
    });
  };

  return { handleMeAddCard, handleSetUpcard, flush };
}

describe('simulación corregida: setState funcional', () => {
  it('conserva ambas cartas con toques rápidos y dealer', () => {
    const app = createFixedAppModel();
    app.handleMeAddCard('10');
    app.handleMeAddCard('7');
    app.handleSetUpcard('6');
    const state = app.flush();
    expect(getMePlayer(state)!.hands[0].cards).toEqual(['10', '7']);
  });
});
