import { es } from '../i18n/locales';
import type { CardRank, StrategyAction } from '../types/blackjack';
import { getStrategy } from './blackjack';
import { calculateCountStats } from './count';

/**
 * Límites del cronómetro de práctica (10, 15 y 20 s).
 * Son metas de un ejercicio de velocidad, no una invitación a usar la app en una mesa real.
 */
export const CASINO_DECISION_WINDOW = {
  typicalSeconds: 10,
  commonMaxSeconds: 15,
  extendedSeconds: 20,
} as const;

export const DEFAULT_DECISION_BUDGET_MS =
  CASINO_DECISION_WINDOW.typicalSeconds * 1000;

export const COMMON_MAX_DECISION_BUDGET_MS =
  CASINO_DECISION_WINDOW.commonMaxSeconds * 1000;

/** Tiempo estimado por toque en pantalla al registrar una carta o botón */
export const TAP_ESTIMATES_MS = {
  fast: 400,
  average: 700,
  slow: 1200,
} as const;

/** Tiempo estimado para leer la recomendación durante el ejercicio */
export const GLANCE_AT_SCREEN_MS = {
  fast: 800,
  average: 1500,
  slow: 2500,
} as const;

export type InputSpeed = keyof typeof TAP_ESTIMATES_MS;

export interface TurnInputPlan {
  /** Toques para dealer + cartas propias + botones de acción */
  cardTaps: number;
  /** Usar campo de texto (ej. "10,6") en lugar de botones */
  usesTextInput?: boolean;
  extraCardTaps?: number;
  lockPreliminary?: boolean;
}

export function estimateTurnInputTimeMs(
  plan: TurnInputPlan,
  speed: InputSpeed = 'average',
): number {
  const tapMs = TAP_ESTIMATES_MS[speed];
  const glanceMs = GLANCE_AT_SCREEN_MS[speed];

  let total = plan.cardTaps * tapMs;
  if (plan.usesTextInput) {
    const textMs = speed === 'fast' ? 2000 : speed === 'average' ? 3500 : 5000;
    total += textMs;
  }
  if (plan.extraCardTaps) total += plan.extraCardTaps * tapMs;
  if (plan.lockPreliminary) total += tapMs;
  total += glanceMs;
  return total;
}

export interface TurnScenario {
  deckCount: number;
  savedRoundCards: CardRank[][];
  dealerCard: CardRank;
  playerCards: CardRank[];
  extraVisibleCards?: CardRank[];
  otherPlayersCards?: CardRank[][];
}

export interface TurnDecisionResult {
  strategyAction: StrategyAction;
  trueCount: number;
  runningCount: number;
  elapsedMs: number;
}

/** Simula el pipeline de la app: conteo + estrategia para una mano */
export function resolveTurnDecision(scenario: TurnScenario): TurnDecisionResult {
  const start = performance.now();

  const allSeen: CardRank[] = scenario.savedRoundCards.flat();
  allSeen.push(scenario.dealerCard, ...scenario.playerCards);
  if (scenario.otherPlayersCards) {
    for (const hand of scenario.otherPlayersCards) {
      allSeen.push(...hand);
    }
  }
  if (scenario.extraVisibleCards) {
    allSeen.push(...scenario.extraVisibleCards);
  }

  const stats = calculateCountStats(scenario.deckCount, allSeen);
  const strategy = getStrategy(
    scenario.playerCards,
    scenario.dealerCard,
    stats.trueCount,
    es,
  );

  return {
    strategyAction: strategy.action,
    trueCount: stats.trueCount,
    runningCount: stats.runningCount,
    elapsedMs: performance.now() - start,
  };
}

/**
 * Referencia del ejercicio cuando se acaba el tiempo:
 * pedir con 11 o menos y plantarse con 12 o más.
 */
export function timeoutFallbackAction(handTotal: number): 'HIT' | 'STAND' {
  return handTotal <= 11 ? 'HIT' : 'STAND';
}

/** La lógica de la app debe ser instantánea; el límite real lo pone el humano */
export const LOGIC_TIME_BUDGET_MS = 50;
export const STRESSED_LOGIC_TIME_BUDGET_MS = 100;
