import { useLocale } from '../i18n';
import { evaluateHand, getStrategy } from '../lib/blackjack';
import type { CardRank, HandPhase } from '../types/blackjack';

interface PlayerActionsProps {
  handPhase: HandPhase;
  cards: CardRank[];
  handStatus: import('../types/blackjack').HandStatus;
  dealerUpcard: CardRank | null;
  trueCount: number;
  onStand: () => void;
  onSplit: () => void;
  onDouble: () => void;
  onFinishDealer: () => void;
}

export function PlayerActions({
  handPhase,
  cards,
  handStatus,
  dealerUpcard,
  trueCount,
  onStand,
  onSplit,
  onDouble,
  onFinishDealer,
}: PlayerActionsProps) {
  const { t } = useLocale();

  if (handPhase === 'playerTurn' && dealerUpcard && cards.length >= 2) {
    if (handStatus === 'doubled' && cards.length < 3) {
      return (
        <p className="text-center text-sm text-yellow-300">{t.playerActions.doubleHint}</p>
      );
    }

    const evaluation = evaluateHand(cards);
    const strategy = getStrategy(cards, dealerUpcard, trueCount, t);
    const canSplit = evaluation.isPair && cards.length === 2;
    const canDouble = strategy.action === 'DOUBLE' && cards.length === 2;
    const awaitingDoubleCard = cards.length === 2 && strategy.action === 'DOUBLE';

    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onStand}
          className="flex-1 rounded-xl bg-green-700 py-3 text-sm font-bold"
        >
          {t.playerActions.stand}
        </button>
        {canSplit && (
          <button
            type="button"
            onClick={onSplit}
            className="flex-1 rounded-xl bg-purple-700 py-3 text-sm font-bold"
          >
            {t.playerActions.split}
          </button>
        )}
        {canDouble && (
          <button
            type="button"
            onClick={onDouble}
            className="flex-1 rounded-xl bg-yellow-600 py-3 text-sm font-bold text-gray-900"
          >
            {t.playerActions.double}
          </button>
        )}
        {awaitingDoubleCard && (
          <p className="w-full text-center text-xs text-yellow-300">{t.playerActions.doubleHint}</p>
        )}
      </div>
    );
  }

  if (handPhase === 'dealerDraw') {
    return (
      <button
        type="button"
        onClick={onFinishDealer}
        className="w-full rounded-xl bg-gray-700 py-3 text-sm font-bold"
      >
        {t.playerActions.finishDealer}
      </button>
    );
  }

  return null;
}
