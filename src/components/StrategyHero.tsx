import { useLocale } from '../i18n';
import { ACTION_COLORS } from '../lib/blackjack';
import type { CountStats } from '../lib/count';
import type { CardRank, HandPhase, StrategyAction } from '../types/blackjack';

interface StrategyHeroProps {
  handPhase: HandPhase;
  dealerUpcard: CardRank | null;
  playerCards: CardRank[];
  handTotal: number;
  action: StrategyAction | null;
  reason: string | null;
  stats: CountStats;
  compact?: boolean;
}

export function StrategyHero({
  handPhase,
  dealerUpcard,
  playerCards,
  handTotal,
  action,
  reason,
  stats,
  compact = false,
}: StrategyHeroProps) {
  const { t } = useLocale();

  let message = '';
  if (handPhase === 'opening') {
    message = !dealerUpcard
      ? t.strategy.needDealer
      : playerCards.length < 2
        ? t.strategy.needCards
        : '';
  } else if (handPhase === 'playerTurn' && action === 'HIT') {
    message = t.strategy.tapToHit;
  } else if (handPhase === 'dealerReveal') {
    message = t.strategy.waitingReveal;
  } else if (handPhase === 'dealerDraw') {
    message = t.strategy.waitingDraw;
  } else if (handPhase === 'roundEnd') {
    message = t.strategy.roundEnd;
  } else if (handPhase === 'playerTurn' && action && !['HIT', 'STAND', 'DOUBLE', 'SPLIT'].includes(action)) {
    message = t.strategy.handDone;
  }

  const showAction =
    handPhase === 'playerTurn' &&
    action &&
    ['HIT', 'STAND', 'DOUBLE', 'SPLIT'].includes(action);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`rounded-xl border-2 border-emerald-600 bg-gray-900/90 ${compact ? 'p-3' : 'p-4'} shadow-lg shadow-emerald-900/20`}
    >
      <p className="mb-2 text-xs uppercase tracking-wide text-emerald-400">{t.strategy.title}</p>

      {showAction && action ? (
        <div className="text-center">
          <span
            className={`inline-block rounded-2xl px-6 py-4 text-3xl font-black text-white sm:text-4xl ${ACTION_COLORS[action]}`}
          >
            {t.actions[action]}
          </span>
          {reason && <p className="mt-2 text-sm text-gray-400">{reason}</p>}
          <p className="mt-1 text-xs text-gray-300">
            {t.strategy.cards} {playerCards.join(', ') || '—'} · {t.strategy.total} {handTotal}
          </p>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-400">{message || t.strategy.waitingDealer}</p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-700 pt-3 text-center text-xs">
        <div>
          <p className="text-gray-300">{t.counter.runningCount}</p>
          <p className="text-lg font-bold">{stats.runningCount.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-gray-300">{t.counter.trueCount}</p>
          <p className="text-lg font-bold">{stats.trueCount.toFixed(1)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-300">{t.counter.betting}</p>
          <p className="font-bold text-amber-300">{t.betting[stats.bettingSuggestion]}</p>
        </div>
      </div>
    </div>
  );
}
