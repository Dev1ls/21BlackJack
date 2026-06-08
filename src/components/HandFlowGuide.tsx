import { useLocale } from '../i18n';
import {
  getCurrentFlowStep,
  getFlowHint,
  getVisibleFlowSteps,
  isFlowStepComplete,
  type FlowStepId,
} from '../lib/flowGuide';
import type { AppState } from '../types/blackjack';

interface HandFlowGuideProps {
  state: AppState;
  hasOtherPlayers: boolean;
}

export function HandFlowGuide({ state, hasOtherPlayers }: HandFlowGuideProps) {
  const { t } = useLocale();
  const steps = getVisibleFlowSteps(hasOtherPlayers);
  const current = getCurrentFlowStep(state);
  const hint = getFlowHint(current, t.flowGuide);

  return (
    <section className="rounded-xl border border-blue-700/60 bg-blue-950/25 p-3">
      <h2 className="mb-1 text-sm font-semibold text-blue-200">{t.flowGuide.title}</h2>
      <p className="mb-3 text-xs leading-relaxed text-blue-100/90">{hint}</p>

      <ol className="flex flex-wrap gap-1.5">
        {steps.map((step, idx) => {
          const done = isFlowStepComplete(step.id, state);
          const active = step.id === current;
          const label = t.flowGuide.steps[step.id as FlowStepId];

          return (
            <li
              key={step.id}
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium ${
                active
                  ? 'border-emerald-500 bg-emerald-900/50 text-emerald-100'
                  : done
                    ? 'border-gray-600 bg-gray-800/60 text-gray-400 line-through'
                    : 'border-gray-700 bg-gray-800/40 text-gray-500'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : done
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-gray-700 text-gray-400'
                }`}
              >
                {done ? '✓' : idx + 1}
              </span>
              <span>
                {label}
                {step.optional ? ` ${t.flowGuide.optional}` : ''}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
