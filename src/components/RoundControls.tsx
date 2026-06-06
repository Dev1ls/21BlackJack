import { useLocale } from '../i18n';

interface RoundControlsProps {
  onSaveRound: () => void;
  onNewRound: () => void;
  onResetShoe: () => void;
  onUndoLastRound: () => void;
  savedRoundCount: number;
}

export function RoundControls({
  onSaveRound,
  onNewRound,
  onResetShoe,
  onUndoLastRound,
  savedRoundCount,
}: RoundControlsProps) {
  const { t } = useLocale();

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-200">{t.roundControls.title}</h2>
      <p className="text-xs text-gray-500">
        {t.roundControls.savedRounds(savedRoundCount)}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onSaveRound}
          className="rounded-xl bg-emerald-700 py-3 text-sm font-bold"
        >
          {t.roundControls.saveRound}
        </button>
        <button
          type="button"
          onClick={onNewRound}
          className="rounded-xl bg-blue-700 py-3 text-sm font-bold"
        >
          {t.roundControls.newRound}
        </button>
        <button
          type="button"
          onClick={onUndoLastRound}
          disabled={savedRoundCount === 0}
          className="rounded-xl bg-amber-800 py-3 text-sm font-bold disabled:opacity-40"
        >
          {t.roundControls.undoLastRound}
        </button>
        <button
          type="button"
          onClick={onResetShoe}
          className="rounded-xl bg-red-800 py-3 text-sm font-bold"
        >
          {t.roundControls.resetShoe}
        </button>
      </div>
    </section>
  );
}
