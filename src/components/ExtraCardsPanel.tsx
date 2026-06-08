import { useLocale } from '../i18n';
import { CARD_RANKS, type CardRank } from '../types/blackjack';
import { CardButton } from './CardButton';

interface ExtraCardsPanelProps {
  cards: CardRank[];
  onAdd: (card: CardRank) => void;
  onRemove: (index: number) => void;
  compact?: boolean;
}

export function ExtraCardsPanel({ cards, onAdd, onRemove, compact = false }: ExtraCardsPanelProps) {
  const { t } = useLocale();

  return (
    <section
      className={`rounded-xl border border-amber-800/50 bg-amber-950/15 ${compact ? 'p-2' : 'p-3'}`}
    >
      <h2 className="mb-1 text-sm font-semibold text-amber-200">{t.extraCards.title}</h2>
      <p className="mb-2 text-xs leading-relaxed text-amber-100/80">{t.extraCards.hint}</p>
      <p className="mb-2 rounded-lg bg-amber-950/30 px-2 py-1.5 text-xs text-amber-200/90">
        {t.extraCards.burnNote}
      </p>

      {cards.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {cards.map((card, idx) => (
            <button
              key={`extra-${idx}`}
              type="button"
              onClick={() => onRemove(idx)}
              className="rounded-lg border border-amber-700/60 bg-gray-800 px-2 py-1 text-sm font-semibold"
            >
              {card} ×
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {CARD_RANKS.map((rank) => (
          <CardButton key={`extra-${rank}`} rank={rank} size="sm" onClick={onAdd} />
        ))}
      </div>
    </section>
  );
}
