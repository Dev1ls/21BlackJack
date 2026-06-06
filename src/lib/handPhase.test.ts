import { describe, expect, it } from 'vitest';
import {
  allMyHandsDone,
  collectCurrentRoundCards,
  migrateLegacyState,
  syncHandPhase,
} from './handPhase';
import type { AppState } from '../types/blackjack';
import { getDefaultState } from './storage';

describe('collectCurrentRoundCards', () => {
  it('incluye upcard siempre', () => {
    const state: AppState = {
      ...getDefaultState(),
      dealerUpcard: '6',
    };
    expect(collectCurrentRoundCards(state)).toEqual(['6']);
  });

  it('no incluye hole card hasta que se revela', () => {
    const state: AppState = {
      ...getDefaultState(),
      dealerUpcard: '10',
      dealerHoleCard: '5',
      dealerHoleRevealed: false,
    };
    expect(collectCurrentRoundCards(state)).toEqual(['10']);
  });

  it('incluye hole card y draw cards cuando corresponde', () => {
    const state: AppState = {
      ...getDefaultState(),
      dealerUpcard: '10',
      dealerHoleCard: '5',
      dealerHoleRevealed: true,
      dealerDrawCards: ['K'],
    };
    expect(collectCurrentRoundCards(state)).toEqual(['10', '5', 'K']);
  });
});

describe('migrateLegacyState', () => {
  it('migra dealerCard a dealerUpcard', () => {
    const state = migrateLegacyState({
      ...getDefaultState(),
      dealerCard: 'A',
    } as never);
    expect(state.dealerUpcard).toBe('A');
  });
});

describe('syncHandPhase', () => {
  it('pasa a playerTurn con upcard y 2 cartas', () => {
    const base = getDefaultState();
    const state: AppState = {
      ...base,
      dealerUpcard: '6',
      players: base.players.map((p, i) =>
        i === 0
          ? {
              ...p,
              hands: [{ id: 'h1', cards: ['10', '7'], status: 'playing' }],
            }
          : p,
      ),
    };
    expect(syncHandPhase(state)).toBe('playerTurn');
  });

  it('pasa a dealerReveal cuando todas mis manos terminaron', () => {
    const base = getDefaultState();
    const state: AppState = {
      ...base,
      dealerUpcard: '6',
      players: base.players.map((p, i) =>
        i === 0
          ? {
              ...p,
              hands: [{ id: 'h1', cards: ['10', '7'], status: 'stood' }],
            }
          : p,
      ),
    };
    expect(syncHandPhase(state)).toBe('dealerReveal');
  });
});

describe('allMyHandsDone', () => {
  it('espera tercera carta en doble', () => {
    const base = getDefaultState();
    const player = {
      ...base.players[0],
      hands: [{ id: 'h1', cards: ['9', '2'] as import('../types/blackjack').CardRank[], status: 'doubled' as const }],
    };
    expect(allMyHandsDone(player)).toBe(false);
    player.hands[0].cards.push('10');
    expect(allMyHandsDone(player)).toBe(true);
  });
});
