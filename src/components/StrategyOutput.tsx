import { ACTION_COLORS, evaluateHand, getStrategy } from '../lib/blackjack';
import type { CardRank, Player, StrategyAction } from '../types/blackjack';

interface StrategyOutputProps {
  players: Player[];
  dealerCard: CardRank | null;
  trueCount: number;
  mePlayerId: string | null;
}

function ActionBadge({ action, prominent }: { action: StrategyAction; prominent?: boolean }) {
  return (
    <span
      className={`inline-block rounded-lg px-3 py-1 font-bold text-white ${ACTION_COLORS[action]} ${
        prominent ? 'text-2xl px-5 py-2' : 'text-base'
      }`}
    >
      {action}
    </span>
  );
}

export function StrategyOutput({
  players,
  dealerCard,
  trueCount,
  mePlayerId,
}: StrategyOutputProps) {
  if (!dealerCard) {
    return (
      <section className="rounded-xl border border-gray-700 bg-gray-800/60 p-4">
        <p className="text-gray-400">Set dealer card to see strategy recommendations.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-200">Strategy</h2>
      {players.map((player) => {
        const isMe = player.id === mePlayerId;
        return player.hands.map((hand, handIdx) => {
          const strategy = getStrategy(hand.cards, dealerCard, trueCount);
          const evaluation = evaluateHand(hand.cards);

          return (
            <div
              key={`${player.id}-${hand.id}`}
              className={`rounded-xl border p-4 ${
                isMe
                  ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50'
                  : 'border-gray-700 bg-gray-800/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className={`font-semibold ${isMe ? 'text-emerald-300 text-lg' : 'text-gray-200'}`}>
                    {isMe ? '★ ME' : player.name}
                    {player.hands.length > 1 ? ` (Hand ${handIdx + 1})` : ''}
                  </p>
                  <p className="text-sm text-gray-400">
                    Cards: {hand.cards.length > 0 ? hand.cards.join(', ') : '—'} | Total:{' '}
                    {hand.cards.length > 0 ? evaluation.total : '—'}
                  </p>
                  <p className="text-xs text-gray-500">{strategy.reason}</p>
                </div>
                <ActionBadge action={strategy.action} prominent={isMe} />
              </div>
            </div>
          );
        });
      })}
    </section>
  );
}
