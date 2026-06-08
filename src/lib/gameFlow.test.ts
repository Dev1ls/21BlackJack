import { describe, expect, it } from 'vitest';
import {
  applyPlayerUpdates,
  canDealerHit,
  getDealerHandCards,
  isDealerHandComplete,
  isInitialDealComplete,
  syncHandPhase,
} from './handPhase';
import type { AppState, CardRank } from '../types/blackjack';
import { getDefaultState } from './storage';
import { getMePlayer } from './handPhase';

function setDealerUpcard(state: AppState, card: CardRank | null): AppState {
  const next = { ...state, dealerUpcard: card };
  if (!card) next.handPhase = 'opening';
  return { ...next, ...applyPlayerUpdates(next, next.players) } as AppState;
}

function addMeCard(state: AppState, card: CardRank): AppState {
  const me = getMePlayer(state)!;
  const players = state.players.map((p) =>
    p.id === me.id
      ? {
          ...p,
          hands: p.hands.map((h, i) =>
            i === 0 ? { ...h, cards: [...h.cards, card] } : h,
          ),
        }
      : p,
  );
  return { ...state, ...applyPlayerUpdates({ ...state, players }, players) } as AppState;
}

function standMe(state: AppState): AppState {
  const me = getMePlayer(state)!;
  const players = state.players.map((p) =>
    p.id === me.id
      ? {
          ...p,
          hands: [{ ...p.hands[0], status: 'stood' as const }],
        }
      : p,
  );
  return { ...state, ...applyPlayerUpdates({ ...state, players }, players) } as AppState;
}

function setHole(state: AppState, card: CardRank): AppState {
  const next: AppState = {
    ...state,
    dealerHoleCard: card,
    dealerHoleRevealed: true,
  };
  next.handPhase = syncHandPhase(next);
  return next;
}

function addDealerDraw(state: AppState, card: CardRank): AppState {
  const drawCards = [...state.dealerDrawCards, card];
  const next: AppState = { ...state, dealerDrawCards: drawCards };
  next.handPhase = syncHandPhase(next);
  return next;
}

describe('bug: dealer primero sin cartas propias', () => {
  it('permanece en opening y permite reparto', () => {
    let state = setDealerUpcard(getDefaultState(), '6');
    expect(state.handPhase).toBe('opening');
    expect(isInitialDealComplete(getMePlayer(state)!)).toBe(false);

    state = addMeCard(state, '10');
    expect(state.handPhase).toBe('opening');

    state = addMeCard(state, '7');
    expect(state.handPhase).toBe('playerTurn');
    expect(getMePlayer(state)!.hands[0].cards).toEqual(['10', '7']);
  });
});

describe('simulación juego 1: 10+7 vs dealer 6, hole 10, pide y llega a 20', () => {
  it('flujo completo hasta roundEnd', () => {
    let state = setDealerUpcard(getDefaultState(), '6');
    state = addMeCard(state, '10');
    state = addMeCard(state, '7');
    expect(state.handPhase).toBe('playerTurn');

    state = standMe(state);
    expect(state.handPhase).toBe('dealerReveal');

    state = setHole(state, '10');
    expect(state.handPhase).toBe('dealerDraw');
    expect(canDealerHit(state)).toBe(true);

    state = addDealerDraw(state, '4');
    expect(state.handPhase).toBe('roundEnd');
    expect(isDealerHandComplete(getDealerHandCards(state))).toBe(true);
  });
});

describe('simulación juego 2: dealer pide hasta 17+', () => {
  it('dealer 6+5=11 pide 6 y queda en 17', () => {
    let state = setDealerUpcard(getDefaultState(), '6');
    state = addMeCard(state, '10');
    state = addMeCard(state, '9');
    state = standMe(state);
    state = setHole(state, '5');
    expect(state.handPhase).toBe('dealerDraw');
    expect(canDealerHit(state)).toBe(true);

    state = addDealerDraw(state, '6');
    expect(state.handPhase).toBe('roundEnd');
    expect(getDealerHandCards(state)).toEqual(['6', '5', '6']);
  });

  it('dealer se pasa y no puede pedir más', () => {
    let state = setDealerUpcard(getDefaultState(), '6');
    state = addMeCard(state, '10');
    state = addMeCard(state, '9');
    state = standMe(state);
    state = setHole(state, '5');
    state = addDealerDraw(state, 'K');
    state = addDealerDraw(state, 'K');
    expect(isDealerHandComplete(getDealerHandCards(state))).toBe(true);
    expect(canDealerHit(state)).toBe(false);
  });
});

describe('isDealerHandComplete', () => {
  it('17+ está completo, 16 no', () => {
    expect(isDealerHandComplete(['10', '7'])).toBe(true);
    expect(isDealerHandComplete(['10', '6'])).toBe(false);
    expect(isDealerHandComplete(['10', '6', '5'])).toBe(true);
    expect(isDealerHandComplete(['10', '6', 'K'])).toBe(true);
  });
});
