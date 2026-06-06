import { useLocale } from '../i18n';
import type { CountStats } from '../lib/count';
import type { CardRank, HandPhase, HandStatus, StrategyAction } from '../types/blackjack';
import { PlayerActions } from './PlayerActions';
import { StrategyHero } from './StrategyHero';

interface MobileStrategyBarProps {
  open: boolean;
  onToggle: () => void;
  handPhase: HandPhase;
  dealerUpcard: CardRank | null;
  playerCards: CardRank[];
  handStatus: HandStatus;
  handTotal: number;
  action: StrategyAction | null;
  reason: string | null;
  stats: CountStats;
  trueCount: number;
  onStand: () => void;
  onSplit: () => void;
  onDouble: () => void;
  onFinishDealer: () => void;
}

export function MobileStrategyBar({
  open,
  onToggle,
  handPhase,
  dealerUpcard,
  playerCards,
  handTotal,
  action,
  reason,
  stats,
  trueCount,
  handStatus,
  onStand,
  onSplit,
  onDouble,
  onFinishDealer,
}: MobileStrategyBarProps) {
  const { t } = useLocale();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-700 bg-gray-900 p-2 lg:hidden">
        <button
          type="button"
          onClick={onToggle}
          className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold"
        >
          {open ? t.ui.hidePlay : t.ui.showPlay}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-14 z-40 max-h-[55vh] overflow-y-auto px-2 pb-2 lg:hidden">
          <StrategyHero
            handPhase={handPhase}
            dealerUpcard={dealerUpcard}
            playerCards={playerCards}
            handTotal={handTotal}
            action={action}
            reason={reason}
            stats={stats}
            compact
          />
          <div className="mt-2">
            <PlayerActions
              handPhase={handPhase}
              cards={playerCards}
              handStatus={handStatus}
              dealerUpcard={dealerUpcard}
              trueCount={trueCount}
              onStand={onStand}
              onSplit={onSplit}
              onDouble={onDouble}
              onFinishDealer={onFinishDealer}
            />
          </div>
        </div>
      )}
    </>
  );
}
