import { useLocale } from '../i18n';
import { CARD_RANKS, type CardRank, type HandPhase } from '../types/blackjack';
import { CardButton } from './CardButton';

interface DealerPanelProps {
  handPhase: HandPhase;
  upcard: CardRank | null;
  holeCard: CardRank | null;
  holeRevealed: boolean;
  drawCards: CardRank[];
  onSetUpcard: (card: CardRank | null) => void;
  onStartReveal: () => void;
  onSetHoleCard: (card: CardRank) => void;
  onClearHole: () => void;
  onAddDrawCard: (card: CardRank) => void;
  onRemoveDrawCard: (index: number) => void;
}

export function DealerPanel({
  handPhase,
  upcard,
  holeCard,
  holeRevealed,
  drawCards,
  onSetUpcard,
  onStartReveal,
  onSetHoleCard,
  onClearHole,
  onAddDrawCard,
  onRemoveDrawCard,
}: DealerPanelProps) {
  const { t } = useLocale();
  const showHolePicker =
    handPhase === 'dealerReveal' || (holeRevealed && !holeCard);
  const showDraw = handPhase === 'dealerDraw' || handPhase === 'roundEnd';

  return (
    <section className="rounded-xl border border-gray-700 bg-gray-800/60 p-3">
      <h2 className="mb-2 text-base font-semibold">{t.dealer.title}</h2>

      <div className="mb-3">
        <p className="mb-1 text-xs text-gray-400">{t.dealer.upcard}</p>
        {upcard ? (
          <button
            type="button"
            onClick={() => onSetUpcard(null)}
            disabled={handPhase !== 'opening'}
            className="mb-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 font-semibold disabled:opacity-50"
          >
            {upcard} ×
          </button>
        ) : (
          <p className="mb-1 text-xs text-gray-500">{t.dealer.tapUpcard}</p>
        )}
        {handPhase === 'opening' && (
          <div className="flex flex-wrap gap-1">
            {CARD_RANKS.map((rank) => (
              <CardButton key={`up-${rank}`} rank={rank} size="sm" onClick={onSetUpcard} />
            ))}
          </div>
        )}
      </div>

      {(handPhase === 'dealerReveal' || holeRevealed || holeCard) && (
        <div className="mb-3 border-t border-gray-700 pt-3">
          <p className="mb-1 text-xs text-gray-400">{t.dealer.hole}</p>
          <p className="mb-2 text-xs text-gray-500">{t.dealer.holeHint}</p>
          {!holeRevealed && handPhase === 'dealerReveal' && (
            <button
              type="button"
              onClick={onStartReveal}
              className="mb-2 w-full rounded-lg bg-amber-700 py-2 text-sm font-bold"
            >
              {t.dealer.revealHole}
            </button>
          )}
          {holeRevealed && holeCard && (
            <button
              type="button"
              onClick={onClearHole}
              className="mb-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-semibold"
            >
              {holeCard} ×
            </button>
          )}
          {holeRevealed && !holeCard && (
            <p className="mb-1 text-xs text-amber-300">{t.dealer.holeHidden}</p>
          )}
          {showHolePicker && holeRevealed && !holeCard && (
            <div className="flex flex-wrap gap-1">
              {CARD_RANKS.map((rank) => (
                <CardButton key={`hole-${rank}`} rank={rank} size="sm" onClick={onSetHoleCard} />
              ))}
            </div>
          )}
        </div>
      )}

      {showDraw && holeRevealed && (
        <div className="border-t border-gray-700 pt-3">
          <p className="mb-1 text-xs text-gray-400">{t.dealer.draw}</p>
          <p className="mb-2 text-xs text-gray-500">{t.dealer.drawHint}</p>
          <div className="mb-2 flex flex-wrap gap-1">
            {drawCards.map((card, idx) => (
              <button
                key={`draw-${idx}`}
                type="button"
                onClick={() => onRemoveDrawCard(idx)}
                className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm font-semibold"
              >
                {card} ×
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {CARD_RANKS.map((rank) => (
              <CardButton key={`dd-${rank}`} rank={rank} size="sm" onClick={onAddDrawCard} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
