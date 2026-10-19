import { useId, useState } from 'react';
import { useLocale } from '../i18n';
import { CardButton } from './CardButton';
import { parseCardInput, formatCards } from '../lib/blackjack';
import { CARD_RANKS, type CardRank, type Player } from '../types/blackjack';

interface PlayerHandProps {
  player: Player;
  isMe: boolean;
  onSetMe: () => void;
  onRemove: () => void;
  canRemove: boolean;
  onAddCard: (handIndex: number, card: CardRank) => void;
  onRemoveCard: (handIndex: number, cardIndex: number) => void;
  onSetCards: (handIndex: number, cards: CardRank[]) => void;
}

export function PlayerHandPanel({
  player,
  isMe,
  onSetMe,
  onRemove,
  canRemove,
  onAddCard,
  onRemoveCard,
  onSetCards,
}: PlayerHandProps) {
  const { t } = useLocale();
  const manualId = useId();
  const [manualInput, setManualInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleManualSubmit = (handIndex: number) => {
    const { cards, error } = parseCardInput(manualInput, t);
    if (error) {
      setInputError(error);
      return;
    }
    setInputError(null);
    onSetCards(handIndex, cards);
    setManualInput('');
  };

  return (
    <div
      className={`rounded-xl border p-4 ${
        isMe
          ? 'border-emerald-500 bg-emerald-950/30'
          : 'border-gray-700 bg-gray-800/60'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h3
            className={`truncate text-base font-semibold ${
              isMe ? 'text-emerald-200' : 'text-gray-100'
            }`}
          >
            {player.name}
          </h3>
          {isMe && (
            <span className="shrink-0 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
              {t.players.me}
            </span>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          {!isMe && (
            <button
              type="button"
              onClick={onSetMe}
              className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-300"
            >
              {t.players.setAsMe}
            </button>
          )}
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-lg bg-red-900/60 px-3 py-1.5 text-xs text-red-300"
            >
              {t.players.remove}
            </button>
          )}
        </div>
      </div>

      {player.hands.map((hand, handIdx) => (
        <div key={hand.id} className="space-y-2">
          {player.hands.length > 1 && (
            <p className="text-sm text-gray-400">{t.players.hand(handIdx + 1)}</p>
          )}

          <div className="flex flex-wrap gap-1">
            {hand.cards.map((card, cardIdx) => (
              <button
                key={`${hand.id}-${cardIdx}`}
                type="button"
                onClick={() => onRemoveCard(handIdx, cardIdx)}
                aria-label={t.a11y.removeCard(t.a11y.card(card))}
                className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-semibold"
                title={t.players.tapToRemove}
              >
                {card} ×
              </button>
            ))}
            {hand.cards.length === 0 && (
              <span className="text-sm text-gray-500">{t.players.noCards}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {CARD_RANKS.map((rank) => (
              <CardButton
                key={rank}
                rank={rank}
                size="sm"
                onClick={(r) => onAddCard(handIdx, r)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-3 space-y-1">
        <div className="flex gap-2">
          <label className="sr-only" htmlFor={manualId}>
            {t.a11y.manualCards}
          </label>
          <input
            id={manualId}
            type="text"
            value={manualInput}
            onChange={(e) => {
              setManualInput(e.target.value);
              setInputError(null);
            }}
            placeholder={t.players.manualPlaceholder}
            className="flex-1 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => handleManualSubmit(0)}
            className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium"
          >
            {t.players.set}
          </button>
        </div>
        {inputError && (
          <p role="alert" className="text-sm text-red-300">{inputError}</p>
        )}
        {player.hands[0]?.cards.length > 0 && (
          <p className="text-xs text-gray-500">
            {t.players.current} {formatCards(player.hands[0].cards)}
          </p>
        )}
      </div>
    </div>
  );
}
