import { useLocale } from '../i18n';
import { getCurrentFlowStep, getFlowHint, getVisibleFlowSteps } from '../lib/flowGuide';
import type { AppState, HandPhase } from '../types/blackjack';

const PHASE_COLORS: Record<HandPhase, string> = {
  opening: 'border-blue-600 bg-blue-950/40 text-blue-200',
  playerTurn: 'border-emerald-600 bg-emerald-950/40 text-emerald-200',
  dealerReveal: 'border-amber-600 bg-amber-950/40 text-amber-200',
  dealerDraw: 'border-orange-600 bg-orange-950/40 text-orange-200',
  roundEnd: 'border-gray-600 bg-gray-800/80 text-gray-300',
};

interface PhaseBannerProps {
  phase: HandPhase;
  state: AppState;
  hasOtherPlayers: boolean;
}

export function PhaseBanner({ phase, state, hasOtherPlayers }: PhaseBannerProps) {
  const { t } = useLocale();
  const current = getCurrentFlowStep(state);
  const hint = getFlowHint(current, t.flowGuide);
  const steps = getVisibleFlowSteps(hasOtherPlayers);
  const stepNum = steps.findIndex((s) => s.id === current) + 1;

  return (
    <div className={`rounded-lg border px-3 py-2 ${PHASE_COLORS[phase]}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-black/25 px-2 py-0.5 text-xs font-bold">
          {t.flowGuide.stepNow(stepNum, steps.length)}
        </span>
        <span className="text-sm font-medium">{t.phases[phase]}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed opacity-90">{hint}</p>
    </div>
  );
}
