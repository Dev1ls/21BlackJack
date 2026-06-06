import { describe, expect, it } from 'vitest';
import {
  TIMER_PRESETS,
  canStartPracticeTimer,
  createTimerSnapshot,
  evaluatePracticeFinish,
  formatElapsedSeconds,
  formatRemainingSeconds,
  presetToMs,
} from './practiceTimer';
import { CASINO_DECISION_WINDOW } from './tableTiming';

describe('createTimerSnapshot', () => {
  it('empieza en verde con tiempo completo', () => {
    const snap = createTimerSnapshot(0, 10_000);
    expect(snap.urgency).toBe('ok');
    expect(snap.remainingMs).toBe(10_000);
    expect(snap.progress).toBe(0);
  });

  it('pasa a advertencia después del 60% del tiempo', () => {
    expect(createTimerSnapshot(6_000, 10_000).urgency).toBe('warn');
  });

  it('pasa a crítico en el último 20%', () => {
    expect(createTimerSnapshot(8_500, 10_000).urgency).toBe('critical');
  });

  it('marca expirado al llegar a 0', () => {
    const snap = createTimerSnapshot(10_000, 10_000);
    expect(snap.isExpired).toBe(true);
    expect(snap.urgency).toBe('expired');
    expect(snap.remainingMs).toBe(0);
  });
});

describe('canStartPracticeTimer', () => {
  it('requiere dealer y al menos 2 cartas propias', () => {
    expect(canStartPracticeTimer(null, [])).toBe(false);
    expect(canStartPracticeTimer('6', ['10'])).toBe(false);
    expect(canStartPracticeTimer('6', ['10', '7'])).toBe(true);
  });
});

describe('evaluatePracticeFinish', () => {
  it('celebra si terminaste dentro del presupuesto', () => {
    const result = evaluatePracticeFinish(6_200, 10_000);
    expect(result.finishedInTime).toBe(true);
    expect(result.marginMs).toBe(3_800);
  });

  it('falla si te pasaste del límite', () => {
    const result = evaluatePracticeFinish(10_500, 10_000);
    expect(result.finishedInTime).toBe(false);
    expect(result.marginMs).toBe(-500);
  });
});

describe('presets alineados con mesas reales', () => {
  it('incluye 10, 15 y 20 segundos', () => {
    expect(TIMER_PRESETS).toEqual([
      CASINO_DECISION_WINDOW.typicalSeconds,
      CASINO_DECISION_WINDOW.commonMaxSeconds,
      CASINO_DECISION_WINDOW.extendedSeconds,
    ]);
    expect(presetToMs(10)).toBe(10_000);
  });
});

describe('formato de tiempo', () => {
  it('muestra décimas en el countdown', () => {
    expect(formatRemainingSeconds(5_040)).toBe('5.1');
    expect(formatRemainingSeconds(0)).toBe('0');
  });

  it('muestra segundos usados al terminar', () => {
    expect(formatElapsedSeconds(6_240)).toBe('6.2');
  });
});
