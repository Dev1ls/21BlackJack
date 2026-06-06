import { useLocale } from '../i18n';
import type { HandPhase } from '../types/blackjack';

const PHASE_COLORS: Record<HandPhase, string> = {
  opening: 'border-blue-600 bg-blue-950/40 text-blue-200',
  playerTurn: 'border-emerald-600 bg-emerald-950/40 text-emerald-200',
  dealerReveal: 'border-amber-600 bg-amber-950/40 text-amber-200',
  dealerDraw: 'border-orange-600 bg-orange-950/40 text-orange-200',
  roundEnd: 'border-gray-600 bg-gray-800/80 text-gray-300',
};

interface PhaseBannerProps {
  phase: HandPhase;
}

export function PhaseBanner({ phase }: PhaseBannerProps) {
  const { t } = useLocale();

  return (
    <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${PHASE_COLORS[phase]}`}>
      {t.phases[phase]}
    </div>
  );
}
