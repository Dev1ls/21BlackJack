import { useLocale } from '../i18n';
import type { CountStats } from '../lib/count';
import { insuranceSuggestion } from '../lib/count';
import type { CardRank } from '../types/blackjack';

interface CounterDashboardProps {
  stats: CountStats;
  dealerCard: CardRank | null;
}

function edgeColor(edge: number): string {
  if (edge > 0) return 'border-green-500 bg-green-950/50';
  if (edge < 0) return 'border-red-500 bg-red-950/50';
  return 'border-yellow-500 bg-yellow-950/30';
}

function StatCard({
  label,
  value,
  sub,
  colorClass,
}: {
  label: string;
  value: string;
  sub?: string;
  colorClass?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-700 bg-gray-800/80 p-3 ${colorClass ?? ''}`}
    >
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export function CounterDashboard({ stats, dealerCard }: CounterDashboardProps) {
  const { t } = useLocale();
  const edgeSign = stats.estimatedEdge >= 0 ? '+' : '';
  const showInsurance = insuranceSuggestion(dealerCard, stats.trueCount);
  const edgeClass = edgeColor(stats.estimatedEdge);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-200">{t.counter.title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard label={t.counter.runningCount} value={stats.runningCount.toFixed(0)} />
        <StatCard label={t.counter.trueCount} value={stats.trueCount.toFixed(1)} />
        <StatCard label={t.counter.cardsSeen} value={String(stats.cardsSeen)} />
        <StatCard
          label={t.counter.decksRemaining}
          value={stats.decksRemaining.toFixed(2)}
        />
        <StatCard
          label={t.counter.penetration}
          value={`${stats.penetration.toFixed(1)}%`}
        />
        <StatCard
          label={t.counter.betting}
          value={t.betting[stats.bettingSuggestion]}
          colorClass={edgeClass}
        />
        <StatCard
          label={t.counter.estimatedEdge}
          value={`${edgeSign}${stats.estimatedEdge.toFixed(1)}%`}
          sub={t.counter.edgeApprox}
          colorClass={edgeClass}
        />
        <StatCard
          label={t.counter.insurance}
          value={showInsurance ? t.counter.insuranceTake : t.counter.insuranceNo}
          colorClass={
            showInsurance
              ? 'border-orange-500 bg-orange-950/50'
              : 'border-gray-700'
          }
        />
      </div>
    </section>
  );
}
