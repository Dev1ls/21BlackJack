import { describe, expect, it } from 'vitest';
import { es } from '../i18n/locales';
import { getDefaultState } from './storage';
import { MAX_PLAYERS, MIN_PLAYERS } from '../types/blackjack';

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
