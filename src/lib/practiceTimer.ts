export function createTimerSnapshot(elapsedMs: number, totalMs: number) {
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const progress = Math.min(1, elapsedMs / totalMs);
  const isExpired = elapsedMs >= totalMs;

  let urgency: 'ok' | 'warn' | 'critical' | 'expired' = 'ok';
  if (isExpired) urgency = 'expired';
  else if (remainingMs <= totalMs * 0.2) urgency = 'critical';
  else if (remainingMs <= totalMs * 0.4) urgency = 'warn';

  return {
    totalMs,
    elapsedMs,
    remainingMs,
    progress,
    urgency,
    isExpired,
  };
}

export type TimerPresetSeconds = 10 | 15 | 20;

export const TIMER_PRESETS: TimerPresetSeconds[] = [10, 15, 20];

export function presetToMs(seconds: TimerPresetSeconds): number {
  return seconds * 1000;
}

export function formatRemainingSeconds(remainingMs: number): string {
  if (remainingMs <= 0) return '0';
  return (Math.ceil(remainingMs / 100) / 10).toFixed(1);
}

export function formatElapsedSeconds(elapsedMs: number): string {
  return (Math.round(elapsedMs / 100) / 10).toFixed(1);
}

export function canStartPracticeTimer(
  dealerUpcard: unknown,
  playerCards: unknown[],
): boolean {
  return dealerUpcard != null && playerCards.length >= 2;
}

export interface PracticeFinishResult {
  finishedInTime: boolean;
  elapsedMs: number;
  budgetMs: number;
  marginMs: number;
}

export function evaluatePracticeFinish(
  elapsedMs: number,
  budgetMs: number,
): PracticeFinishResult {
  return {
    finishedInTime: elapsedMs <= budgetMs,
    elapsedMs,
    budgetMs,
    marginMs: budgetMs - elapsedMs,
  };
}

export function timerBarColor(urgency: ReturnType<typeof createTimerSnapshot>['urgency']): string {
  switch (urgency) {
    case 'expired':
      return 'bg-red-600';
    case 'critical':
      return 'bg-red-500';
    case 'warn':
      return 'bg-amber-500';
    default:
      return 'bg-emerald-500';
  }
}

export function timerBorderColor(urgency: ReturnType<typeof createTimerSnapshot>['urgency']): string {
  switch (urgency) {
    case 'expired':
      return 'border-red-600';
    case 'critical':
      return 'border-red-500';
    case 'warn':
      return 'border-amber-500';
    default:
      return 'border-emerald-600';
  }
}
