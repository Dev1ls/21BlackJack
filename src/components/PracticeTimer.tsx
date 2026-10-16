import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n';
import { ACTION_COLORS } from '../lib/blackjack';
import {
  TIMER_PRESETS,
  canStartPracticeTimer,
  createTimerSnapshot,
  evaluatePracticeFinish,
  formatElapsedSeconds,
  formatRemainingSeconds,
  presetToMs,
  timerBarColor,
  timerBorderColor,
  type PracticeFinishResult,
  type TimerPresetSeconds,
} from '../lib/practiceTimer';
import { timeoutFallbackAction } from '../lib/tableTiming';
import type { CardRank, StrategyAction } from '../types/blackjack';

interface PracticeTimerProps {
  dealerUpcard: CardRank | null;
  playerCards: CardRank[];
  handTotal: number;
  recommendedAction: StrategyAction | null;
}

type TimerPhase = 'idle' | 'running' | 'done' | 'expired';

export function PracticeTimer({
  dealerUpcard,
  playerCards,
  handTotal,
  recommendedAction,
}: PracticeTimerProps) {
  const { t } = useLocale();
  const [preset, setPreset] = useState<TimerPresetSeconds>(10);
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<PracticeFinishResult | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const budgetMs = presetToMs(preset);
  const ready = canStartPracticeTimer(dealerUpcard, playerCards);
  const snapshot = createTimerSnapshot(elapsedMs, budgetMs);
  const timeoutAction = timeoutFallbackAction(handTotal);

  useEffect(() => {
    if (phase !== 'running') return;

    const tick = () => {
      if (startedAtRef.current == null) return;
      const nextElapsed = performance.now() - startedAtRef.current;
      setElapsedMs(nextElapsed);
      if (nextElapsed >= budgetMs) {
        setPhase('expired');
        setResult(evaluatePracticeFinish(nextElapsed, budgetMs));
      }
    };

    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [phase, budgetMs]);

  useEffect(() => {
    setPhase('idle');
    setElapsedMs(0);
    setResult(null);
    startedAtRef.current = null;
  }, [dealerUpcard, playerCards, preset]);

  const handleStart = () => {
    if (!ready) return;
    startedAtRef.current = performance.now();
    setElapsedMs(0);
    setResult(null);
    setPhase('running');
  };

  const handleReady = () => {
    if (phase !== 'running' || startedAtRef.current == null) return;
    const finalElapsed = performance.now() - startedAtRef.current;
    setElapsedMs(finalElapsed);
    setResult(evaluatePracticeFinish(finalElapsed, budgetMs));
    setPhase('done');
  };

  const handleReset = () => {
    startedAtRef.current = null;
    setElapsedMs(0);
    setResult(null);
    setPhase('idle');
  };

  return (
    <section
      className={`space-y-3 rounded-xl border-2 bg-gray-900/40 p-4 ${timerBorderColor(snapshot.urgency)}`}
    >
      <div>
        <h2 className="text-lg font-semibold text-orange-200">{t.practiceTimer.title}</h2>
        <p className="mt-1 text-sm text-gray-400">{t.practiceTimer.description}</p>
      </div>

      {!ready && (
        <p className="rounded-lg bg-gray-800/80 px-3 py-2 text-sm text-gray-500">
          {t.practiceTimer.waiting}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-400">{t.practiceTimer.presetLabel}</span>
        {TIMER_PRESETS.map((sec) => (
          <button
            key={sec}
            type="button"
            disabled={phase === 'running'}
            onClick={() => setPreset(sec)}
            aria-pressed={preset === sec}
            aria-label={t.a11y.timerSeconds(sec)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${
              preset === sec ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>

      {phase === 'running' && (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold tabular-nums text-white">
              {formatRemainingSeconds(snapshot.remainingMs)}s
            </span>
            <span className="text-sm text-gray-400">{t.practiceTimer.runningHint}</span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-gray-800"
            role="progressbar"
            aria-label={t.a11y.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(snapshot.progress * 100)}
          >
            <div
              className={`h-full transition-all duration-100 ${timerBarColor(snapshot.urgency)}`}
              style={{ width: `${snapshot.progress * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {phase === 'idle' && (
          <button
            type="button"
            onClick={handleStart}
            disabled={!ready}
            className="rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold disabled:opacity-40"
          >
            {t.practiceTimer.start}
          </button>
        )}
        {phase === 'running' && (
          <button
            type="button"
            onClick={handleReady}
            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold"
          >
            {t.practiceTimer.ready}
          </button>
        )}
        {(phase === 'done' || phase === 'expired') && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl bg-gray-700 px-4 py-3 text-sm font-bold"
          >
            {t.practiceTimer.tryAgain}
          </button>
        )}
      </div>

      {phase === 'done' && result?.finishedInTime && recommendedAction && (
        <div className="rounded-lg border border-emerald-700 bg-emerald-950/50 px-3 py-3 text-sm">
          <p className="font-semibold text-emerald-300">
            {t.practiceTimer.success(formatElapsedSeconds(result.elapsedMs))}
          </p>
          <p className="mt-1 text-gray-300">
            {t.practiceTimer.recommended(t.actions[recommendedAction])}
          </p>
        </div>
      )}

      {phase === 'expired' && (
        <div className="space-y-2 rounded-lg border border-red-800 bg-red-950/40 px-3 py-3 text-sm">
          <p className="font-semibold text-red-300">{t.practiceTimer.timeout}</p>
          <p className="text-gray-300">
            {t.practiceTimer.autoPlay(t.actions[timeoutAction])}
          </p>
          {recommendedAction && (
            <p className="text-gray-300">
              {t.practiceTimer.recommended(t.actions[recommendedAction])}
            </p>
          )}
          {recommendedAction && timeoutAction !== recommendedAction && (
            <p className="rounded bg-amber-900/40 px-2 py-1 text-amber-200">
              {t.practiceTimer.mismatch}
            </p>
          )}
          {timeoutAction && (
            <span
              className={`inline-block rounded-lg px-3 py-1 text-xs font-bold text-white ${ACTION_COLORS[timeoutAction]}`}
            >
              AUTO: {t.actions[timeoutAction]}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
