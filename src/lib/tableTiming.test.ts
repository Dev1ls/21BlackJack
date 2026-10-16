import { describe, expect, it } from 'vitest';
import { evaluateHand } from './blackjack';
import {
  CASINO_DECISION_WINDOW,
  COMMON_MAX_DECISION_BUDGET_MS,
  DEFAULT_DECISION_BUDGET_MS,
  LOGIC_TIME_BUDGET_MS,
  STRESSED_LOGIC_TIME_BUDGET_MS,
  estimateTurnInputTimeMs,
  resolveTurnDecision,
  timeoutFallbackAction,
  type TurnInputPlan,
} from './tableTiming';
import type { CardRank } from '../types/blackjack';

const BASIC_TURN: TurnInputPlan = {
  cardTaps: 3, // dealer + 2 cartas propias
};

describe('Casino decision window (investigado)', () => {
  it('documenta 10 s como ejemplo típico y hasta 15–20 s en algunas mesas', () => {
    expect(CASINO_DECISION_WINDOW.typicalSeconds).toBe(10);
    expect(CASINO_DECISION_WINDOW.commonMaxSeconds).toBe(15);
    expect(CASINO_DECISION_WINDOW.extendedSeconds).toBe(20);
    expect(DEFAULT_DECISION_BUDGET_MS).toBe(10_000);
    expect(COMMON_MAX_DECISION_BUDGET_MS).toBe(15_000);
  });
});

describe('Tiempo humano estimado (toques en pantalla)', () => {
  it('turno básico con botones cabe en ~10 s incluso yendo lento', () => {
    const slowMs = estimateTurnInputTimeMs(BASIC_TURN, 'slow');
    expect(slowMs).toBeLessThan(DEFAULT_DECISION_BUDGET_MS);
  });

  it('turno básico rápido deja margen amplio bajo 10 s', () => {
    const fastMs = estimateTurnInputTimeMs(BASIC_TURN, 'fast');
    expect(fastMs).toBeLessThan(5_000);
  });

  it('simulación con cartas extra de otros jugadores cabe en 15 s yendo lento', () => {
    const simulatedTurn: TurnInputPlan = {
      cardTaps: 3,
      extraCardTaps: 4,
      lockPreliminary: true,
    };
    const slowMs = estimateTurnInputTimeMs(simulatedTurn, 'slow');
    expect(slowMs).toBeLessThan(COMMON_MAX_DECISION_BUDGET_MS);
  });

  it('escribir cartas a mano es más lento que tocar botones', () => {
    const taps = estimateTurnInputTimeMs(BASIC_TURN, 'average');
    const typed = estimateTurnInputTimeMs(
      { cardTaps: 1, usesTextInput: true },
      'average',
    );
    expect(typed).toBeGreaterThan(taps);
  });

  it('un turno muy cargado supera 10 s (y hasta 15 s) si vas lento — usa botones', () => {
    const heavyTurn: TurnInputPlan = {
      cardTaps: 3,
      extraCardTaps: 8,
      lockPreliminary: true,
      usesTextInput: true,
    };
    const slowMs = estimateTurnInputTimeMs(heavyTurn, 'slow');
    expect(slowMs).toBeGreaterThan(DEFAULT_DECISION_BUDGET_MS);
    expect(slowMs).toBeGreaterThan(COMMON_MAX_DECISION_BUDGET_MS);
  });
});

describe('Velocidad de la lógica de la app', () => {
  it('resuelve conteo + estrategia en menos de 50 ms (turno simple)', () => {
    const result = resolveTurnDecision({
      deckCount: 8,
      savedRoundCards: [],
      dealerCard: '6',
      playerCards: ['10', '7'],
    });
    expect(result.strategyAction).toBe('STAND');
    expect(result.elapsedMs).toBeLessThan(LOGIC_TIME_BUDGET_MS);
  });

  it('sigue siendo instantáneo con baraja avanzada y varios jugadores', () => {
    const saved: CardRank[][] = Array.from({ length: 12 }, (_, i) =>
      i % 2 === 0 ? (['5', '6', '10'] as CardRank[]) : (['2', '3', 'K'] as CardRank[]),
    );
    const result = resolveTurnDecision({
      deckCount: 8,
      savedRoundCards: saved,
      dealerCard: '10',
      playerCards: ['8', '8'],
      otherPlayersCards: [
        ['10', '6'],
        ['9', '2'],
        ['5', '5'],
      ],
      extraVisibleCards: ['K', '4', '3', '2'],
    });
    expect(result.strategyAction).toBe('SPLIT');
    expect(result.elapsedMs).toBeLessThan(STRESSED_LOGIC_TIME_BUDGET_MS);
  });

  it('ejecuta 100 turnos seguidos sin superar 10 ms en promedio', () => {
    const samples: number[] = [];
    for (let i = 0; i < 100; i++) {
      const result = resolveTurnDecision({
        deckCount: 8,
        savedRoundCards: [['5', '6', '10']],
        dealerCard: '6',
        playerCards: ['9', '2'],
      });
      samples.push(result.elapsedMs);
    }
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(avg).toBeLessThan(10);
  });
});

describe('Si se acaba el tiempo de práctica', () => {
  it('auto-pide con 11 o menos', () => {
    expect(timeoutFallbackAction(11)).toBe('HIT');
    expect(timeoutFallbackAction(9)).toBe('HIT');
  });

  it('auto-se queda con 12 o más', () => {
    expect(timeoutFallbackAction(12)).toBe('STAND');
    expect(timeoutFallbackAction(16)).toBe('STAND');
  });

  it('coincide con estrategia básica en totales hard comunes', () => {
    const hard16 = evaluateHand(['10', '6']);
    const hard12 = evaluateHand(['10', '2']);
    expect(timeoutFallbackAction(hard16.total)).toBe('STAND');
    expect(timeoutFallbackAction(hard12.total)).toBe('STAND');
  });
});
