import { describe, expect, it } from 'vitest';
import { getCurrentFlowStep, getVisibleFlowSteps } from './flowGuide';
import { getDefaultState } from './storage';
import type { AppState } from '../types/blackjack';

describe('flowGuide', () => {
  it('empieza en setup con baraja nueva vacía', () => {
    expect(getCurrentFlowStep(getDefaultState())).toBe('setup');
  });

  it('pasa a deal cuando hay dealer o cartas pendientes', () => {
    const withDealer: AppState = { ...getDefaultState(), dealerUpcard: '6' };
    expect(getCurrentFlowStep(withDealer)).toBe('deal');
  });

  it('pasa a play en playerTurn', () => {
    const base = getDefaultState();
    const state: AppState = {
      ...base,
      handPhase: 'playerTurn',
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
    expect(getCurrentFlowStep(state)).toBe('play');
  });

  it('hole en dealerReveal', () => {
    expect(getCurrentFlowStep({ ...getDefaultState(), handPhase: 'dealerReveal' })).toBe(
      'hole',
    );
  });

  it('oculta paso others sin jugadores extra', () => {
    expect(getVisibleFlowSteps(false).some((s) => s.id === 'others')).toBe(false);
    expect(getVisibleFlowSteps(true).some((s) => s.id === 'others')).toBe(true);
  });
});
