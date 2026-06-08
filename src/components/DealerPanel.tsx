import { useLocale } from '../i18n';
import { CARD_RANKS, type CardRank, type HandPhase } from '../types/blackjack';
import { CardButton } from './CardButton';

interface DealerPanelProps {
  handPhase: HandPhase;
  upcard: CardRank | null;
  holeCard: CardRank | null;
  drawCards: CardRank[];
  onSetUpcard: (card: CardRank | null) => void;
  onSetHoleCard: (card: CardRank) => void;
  onClearHole: () => void;
  onAddDrawCard: (card: CardRank) => void;
  onRemoveDrawCard: (index: number) => void;
}

function StepBadge({
  number,
  active,
  done,
  label,
}: {
  number: number;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          active
            ? 'bg-emerald-600 text-white'
            : done
              ? 'bg-gray-600 text-gray-200'
              : 'bg-gray-700 text-gray-400'
        }`}
      >
        {done ? '✓' : number}
      </span>
      <span
        className={`text-sm font-semibold ${
          active ? 'text-emerald-200' : done ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export function DealerPanel({
  handPhase,
  upcard,
  holeCard,
  drawCards,
  onSetUpcard,
  onSetHoleCard,
  onClearHole,
  onAddDrawCard,
  onRemoveDrawCard,
}: DealerPanelProps) {
  const { t } = useLocale();

  const upcardActive = handPhase === 'opening' || handPhase === 'playerTurn';
  const upcardDone = Boolean(upcard);
  const holeActive = handPhase === 'dealerReveal';
  const holeDone = Boolean(holeCard);
  const drawActive = handPhase === 'dealerDraw' || handPhase === 'roundEnd';
  const drawDone = handPhase === 'roundEnd';

  return (
    <section className="rounded-xl border border-gray-700 bg-gray-800/60 p-3">
      <h2 className="mb-3 text-base font-semibold">{t.dealer.title}</h2>

      {/* Paso A: carta visible */}
      <div
        className={`mb-3 rounded-lg border p-3 ${
          upcardActive
            ? 'border-emerald-600/60 bg-emerald-950/20'
            : 'border-gray-700 bg-gray-900/30'
        }`}
      >
        <StepBadge
          number={1}
          active={upcardActive && !upcardDone}
          done={upcardDone}
          label={t.dealer.upcard}
        />
        <p className="mb-2 text-xs text-gray-400">{t.dealer.upcardWhen}</p>
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
          <p className="mb-2 text-xs font-medium text-emerald-300">{t.dealer.tapUpcard}</p>
        )}
        {handPhase === 'opening' && !upcard && (
          <div className="flex flex-wrap gap-1">
            {CARD_RANKS.map((rank) => (
              <CardButton key={`up-${rank}`} rank={rank} size="sm" onClick={onSetUpcard} />
            ))}
          </div>
        )}
        {upcard && upcardActive && (
          <p className="text-xs text-gray-500">{t.dealer.upcardLocked}</p>
        )}
      </div>

      {/* Paso B: carta oculta — solo después de tu turno */}
      <div
        className={`mb-3 rounded-lg border p-3 ${
          holeActive
            ? 'border-amber-600/70 bg-amber-950/30 ring-1 ring-amber-500/30'
            : 'border-gray-700/80 bg-gray-900/20 opacity-80'
        }`}
      >
        <StepBadge
          number={2}
          active={holeActive && !holeDone}
          done={holeDone}
          label={t.dealer.hole}
        />
        <p className="mb-2 text-xs text-gray-400">{t.dealer.holeWhen}</p>

        {!holeActive && !holeDone && (
          <p className="rounded-lg bg-gray-800/80 px-2 py-2 text-xs text-gray-500">
            🔒 {t.dealer.holeLocked}
          </p>
        )}

        {holeActive && !holeCard && (
          <>
            <p className="mb-2 text-sm font-medium text-amber-200">{t.dealer.holeNow}</p>
            <div className="flex flex-wrap gap-1">
              {CARD_RANKS.map((rank) => (
                <CardButton key={`hole-${rank}`} rank={rank} size="sm" onClick={onSetHoleCard} />
              ))}
            </div>
          </>
        )}

        {holeCard && (
          <>
            <button
              type="button"
              onClick={onClearHole}
              className="mb-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-semibold"
            >
              {holeCard} ×
            </button>
            <p className="text-xs text-gray-500">{t.dealer.holeDone}</p>
          </>
        )}
      </div>

      {/* Paso C: cartas extra del dealer */}
      <div
        className={`rounded-lg border p-3 ${
          drawActive && holeCard
            ? 'border-orange-600/60 bg-orange-950/20'
            : 'border-gray-700/80 bg-gray-900/20 opacity-80'
        }`}
      >
        <StepBadge
          number={3}
          active={drawActive && Boolean(holeCard) && !drawDone}
          done={drawDone}
          label={t.dealer.draw}
        />
        <p className="mb-2 text-xs text-gray-400">{t.dealer.drawWhen}</p>

        {(!drawActive || !holeCard) && (
          <p className="rounded-lg bg-gray-800/80 px-2 py-2 text-xs text-gray-500">
            🔒 {t.dealer.drawLocked}
          </p>
        )}

        {drawActive && holeCard && (
          <>
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
              {drawCards.length === 0 && (
                <span className="text-xs text-gray-500">{t.dealer.drawEmpty}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {CARD_RANKS.map((rank) => (
                <CardButton key={`dd-${rank}`} rank={rank} size="sm" onClick={onAddDrawCard} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
