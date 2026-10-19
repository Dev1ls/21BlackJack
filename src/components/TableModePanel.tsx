import { useLocale } from '../i18n';
import { ACTION_COLORS, getStrategy } from '../lib/blackjack';
import type { CardRank, Player, PreliminaryDecision, StrategyAction } from '../types/blackjack';

interface TableModePanelProps {
  players: Player[];
  mePlayerId: string | null;
  dealerUpcard: CardRank | null;
  trueCount: number;
  runningCount: number;
  preliminaryDecision: PreliminaryDecision | null;
  onSetMePlayer: (playerId: string) => void;
  onLockPreliminary: () => void;
}

function DecisionCard({
  label,
  action,
  actionLabel,
  runningCount,
  trueCount,
  variant,
  notSetLabel,
}: {
  label: string;
  action: StrategyAction | null;
  actionLabel: string | null;
  runningCount: number;
  trueCount: number;
  variant: 'preliminary' | 'final';
  notSetLabel: string;
}) {
  const bg =
    variant === 'preliminary'
      ? 'border-blue-600 bg-blue-950/40'
      : 'border-purple-600 bg-purple-950/40';

  return (
    <div className={`rounded-xl border-2 p-4 ${bg}`}>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      {action && actionLabel ? (
        <span
          className={`mt-2 inline-block rounded-lg px-4 py-2 text-xl font-bold text-white ${ACTION_COLORS[action]}`}
        >
          {actionLabel}
        </span>
      ) : (
        <p className="mt-2 text-gray-500">{notSetLabel}</p>
      )}
      <p className="mt-2 text-sm text-gray-400">
        RC: {runningCount.toFixed(0)} | TC: {trueCount.toFixed(1)}
      </p>
    </div>
  );
}

export function TableModePanel({
  players,
  mePlayerId,
  dealerUpcard,
  trueCount,
  runningCount,
  preliminaryDecision,
  onSetMePlayer,
  onLockPreliminary,
}: TableModePanelProps) {
  const { t } = useLocale();
  const mePlayer = players.find((p) => p.id === mePlayerId);
  const meHand = mePlayer?.hands[0];

  let finalAction: StrategyAction | null = null;
  if (meHand && dealerUpcard && meHand.cards.length > 0) {
    finalAction = getStrategy(meHand.cards, dealerUpcard, trueCount, t).action;
  }

  const prelimAction = preliminaryDecision?.action ?? null;
  const decisionChanged =
    prelimAction !== null && finalAction !== null && prelimAction !== finalAction;
  const decisionSame =
    prelimAction !== null && finalAction !== null && prelimAction === finalAction;

  const rcChange = preliminaryDecision
    ? runningCount - preliminaryDecision.runningCount
    : 0;
  const tcChange = preliminaryDecision
    ? trueCount - preliminaryDecision.trueCount
    : 0;

  return (
    <section className="space-y-4 rounded-xl border border-indigo-700 bg-indigo-950/20 p-4">
      <h2 className="text-lg font-semibold text-indigo-200">{t.tableMode.title}</h2>
      <p className="text-sm text-gray-400">{t.tableMode.description}</p>

      <div>
        <p className="mb-1 block text-sm text-gray-300">{t.tableMode.myPlayerNumber}</p>
        <div className="flex flex-wrap gap-2">
          {players.map((player, idx) => (
            <button
              key={player.id}
              type="button"
              onClick={() => onSetMePlayer(player.id)}
              aria-pressed={player.id === mePlayerId}
              aria-label={t.a11y.selectPlayer(player.name)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                player.id === mePlayerId
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onLockPreliminary}
        disabled={!meHand || !dealerUpcard || meHand.cards.length === 0}
        className="w-full rounded-xl bg-blue-700 py-3 text-base font-bold disabled:opacity-40"
      >
        {t.tableMode.lockPreliminary}
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        <DecisionCard
          label={t.tableMode.preliminaryDecision}
          action={prelimAction}
          actionLabel={prelimAction ? t.actions[prelimAction] : null}
          runningCount={preliminaryDecision?.runningCount ?? 0}
          trueCount={preliminaryDecision?.trueCount ?? 0}
          variant="preliminary"
          notSetLabel={t.tableMode.notSet}
        />
        <DecisionCard
          label={t.tableMode.finalDecision}
          action={finalAction}
          actionLabel={finalAction ? t.actions[finalAction] : null}
          runningCount={runningCount}
          trueCount={trueCount}
          variant="final"
          notSetLabel={t.tableMode.notSet}
        />
      </div>

      {preliminaryDecision && (
        <div className="space-y-2 rounded-lg border border-gray-700 bg-gray-800/60 p-3">
          <p className="text-sm">
            <span className="text-gray-400">{t.tableMode.trueCountChange} </span>
            <span className={tcChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              {tcChange >= 0 ? '+' : ''}
              {tcChange.toFixed(1)}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-400">{t.tableMode.runningCountChange} </span>
            <span className={rcChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              {rcChange >= 0 ? '+' : ''}
              {rcChange.toFixed(0)}
            </span>
          </p>
          {decisionChanged && (
            <p className="rounded-lg bg-amber-900/50 px-3 py-2 text-sm font-semibold text-amber-300">
              {t.tableMode.decisionChanged}
            </p>
          )}
          {decisionSame && (
            <p className="rounded-lg bg-green-900/50 px-3 py-2 text-sm font-semibold text-green-300">
              {t.tableMode.decisionSame}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
