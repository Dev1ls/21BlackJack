import { useLocale } from '../i18n';
import { evaluateHand } from '../lib/blackjack';
import { CARD_RANKS, type CardRank, type HandPhase } from '../types/blackjack';
import { CardButton } from './CardButton';

interface QuickMePanelProps {
  handPhase: HandPhase;
  cards: CardRank[];
  handIndex: number;
  handCount: number;
  onAddCard: (card: CardRank) => void;
  onRemoveCard: (index: number) => void;
}

export function QuickMePanel({
  handPhase,
  cards,
  handIndex,
  handCount,
  onAddCard,
  onRemoveCard,
}: QuickMePanelProps) {
  const { t } = useLocale();
  const canEdit = handPhase === 'opening' || handPhase === 'playerTurn';
  const evaluation = evaluateHand(cards);

  const stepHint =
    handPhase === 'opening'
      ? t.ui.myHandWhenOpening
      : handPhase === 'playerTurn'
        ? t.ui.myHandWhenPlaying
        : t.ui.myHandWhenDone;

  return (
    <section className="rounded-xl border border-emerald-700 bg-emerald-950/20 p-3">
      <h2 className="mb-1 text-base font-semibold text-emerald-200">
        {t.ui.myHand}
        {handCount > 1 ? ` ${t.players.hand(handIndex + 1)}` : ''}
      </h2>
      <p className="mb-2 text-xs leading-relaxed text-emerald-200/70">{stepHint}</p>

      <div className="mb-2 flex flex-wrap gap-1">
        {cards.map((card, idx) => (
          <button
            key={`me-${idx}`}
            type="button"
            onClick={() => canEdit && onRemoveCard(idx)}
            disabled={!canEdit}
            className="rounded-lg border border-emerald-700 bg-gray-800 px-3 py-2 text-sm font-bold disabled:opacity-60"
          >
            {card} ×
          </button>
        ))}
        {cards.length === 0 && (
          <span className="text-sm text-gray-500">{t.players.noCards}</span>
        )}
      </div>

      {cards.length > 0 && (
        <p className="mb-2 text-xs text-emerald-300/80">
          {t.strategy.total} {evaluation.total}
        </p>
      )}

      {canEdit && (
        <div className="flex flex-wrap gap-1">
          {CARD_RANKS.map((rank) => (
            <CardButton key={`me-add-${rank}`} rank={rank} size="sm" onClick={onAddCard} />
          ))}
        </div>
      )}
    </section>
  );
}