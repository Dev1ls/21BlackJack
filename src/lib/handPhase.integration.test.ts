import { describe, expect, it } from 'vitest';
import {
  applyPlayerUpdates,
  collectCurrentRoundCards,
  getActiveHandEntry,
  getMeHandDisplay,
  getMePlayer,
  syncHandStatus,
} from './handPhase';
import type { AppState, CardRank } from '../types/blackjack';
import { getDefaultState } from './storage';

function withMeCards(state: AppState, cards: CardRank[]): AppState {
  const me = getMePlayer(state)!;
  const players = state.players.map((p) =>
    p.id === me.id
      ? { ...p, hands: [{ ...p.hands[0], cards, status: 'playing' as const }] }
      : p,
  );
  return { ...state, ...applyPlayerUpdates({ ...state, players }, players) };
}

function setDealerUpcard(state: AppState, card: CardRank | null): AppState {
  const next = { ...state, dealerUpcard: card };
  if (!card) next.handPhase = 'opening';
  return { ...next, ...applyPlayerUpdates(next, next.players) };
}

describe('integración: cartas del jugador al registrar dealer', () => {
  it('conserva 2 cartas propias al fijar la upcard del dealer', () => {
    let state = getDefaultState();
    state = withMeCards(state, ['10', '7']);
    expect(getMePlayer(state)!.hands[0].cards).toEqual(['10', '7']);

    state = setDealerUpcard(state, '6');

    const me = getMePlayer(state)!;
    expect(me.hands[0].cards).toEqual(['10', '7']);
    expect(collectCurrentRoundCards(state).sort()).toEqual(['10', '6', '7']);
    expect(state.handPhase).toBe('playerTurn');
  });

  it('conserva cartas si primero se pone dealer y luego las propias', () => {
    let state = setDealerUpcard(getDefaultState(), '10');
    state = withMeCards(state, ['8', '8']);
    expect(getMePlayer(state)!.hands[0].cards).toEqual(['8', '8']);
  });

  it('blackjack sigue mostrando cartas tras dealer (mano terminada para el jugador)', () => {
    let state = withMeCards(getDefaultState(), ['A', 'K']);
    state = setDealerUpcard(state, '6');
    const me = getMePlayer(state)!;
    expect(me.hands[0].cards).toEqual(['A', 'K']);
    expect(me.hands[0].status).toBe('blackjack');
    expect(state.handPhase).toBe('dealerReveal');
  });

  it('getActiveHandEntry null no significa cartas vacías en la mano 0', () => {
    let state = withMeCards(getDefaultState(), ['A', 'K']);
    state = setDealerUpcard(state, '6');
    const me = getMePlayer(state)!;
    expect(getActiveHandEntry(me, 0)).toBeNull();
    expect(getMeHandDisplay(state).cards).toEqual(['A', 'K']);
  });

  it('blackjack no se marca hasta tener upcard del dealer', () => {
    let state = withMeCards(getDefaultState(), ['A', 'K']);
    expect(getMePlayer(state)!.hands[0].status).toBe('playing');
    state = setDealerUpcard(state, '6');
    expect(getMePlayer(state)!.hands[0].status).toBe('blackjack');
  });
});

describe('getMeHandDisplay', () => {
  it('muestra cartas de la mano activa aunque getActiveHandEntry sea null', () => {
    let state = withMeCards(getDefaultState(), ['10', '7']);
    state = setDealerUpcard(state, '6');
    state = {
      ...state,
      players: state.players.map((p, i) =>
        i === 0
          ? {
              ...p,
              hands: [{ ...p.hands[0], status: 'stood' as const }],
            }
          : p,
      ),
      handPhase: 'dealerReveal',
    };
    expect(getMeHandDisplay(state).cards).toEqual(['10', '7']);
  });
});

describe('syncHandStatus sin dealer', () => {
  it('no auto-planta 21 ni blackjack sin upcard', () => {
    const hand = syncHandStatus(
      { id: 'h1', cards: ['A', 'K'], status: 'playing' },
      false,
    );
    expect(hand.status).toBe('playing');
  });
});

describe('applyPlayerUpdates no pierde cartas', () => {
  it('sincroniza estado sin vaciar manos', () => {
    const base = withMeCards(getDefaultState(), ['5', '6']);
    const patch = applyPlayerUpdates(base, base.players);
    expect(patch.players![0].hands[0].cards).toEqual(['5', '6']);
  });
});
