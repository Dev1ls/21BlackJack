import { useLocale } from '../i18n';

export function ExplanationPanel() {
  const { t } = useLocale();

  return (
    <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-800/40 p-4">
      <h2 className="text-lg font-semibold text-gray-200">{t.explanation.title}</h2>

      <div className="space-y-3 text-sm leading-relaxed text-gray-300">
        <div>
          <h3 className="font-semibold text-gray-100">{t.explanation.runningCountTitle}</h3>
          <p>{t.explanation.runningCountBody}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">{t.explanation.trueCountTitle}</h3>
          <p>{t.explanation.trueCountBody}</p>
          <p className="mt-1 rounded-lg bg-gray-900 px-3 py-2 font-mono text-xs text-emerald-400">
            {t.explanation.trueCountFormula}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">{t.explanation.decksRemainingTitle}</h3>
          <p>{t.explanation.decksRemainingBody}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">{t.explanation.penetrationTitle}</h3>
          <p>{t.explanation.penetrationBody}</p>
          <p className="mt-1 rounded-lg bg-gray-900 px-3 py-2 font-mono text-xs text-emerald-400">
            {t.explanation.penetrationFormula}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">{t.explanation.tableDynamicsTitle}</h3>
          <p>{t.explanation.tableDynamicsBody}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">{t.explanation.visibleCardsTitle}</h3>
          <p>{t.explanation.visibleCardsBody}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">{t.explanation.estimatedEdgeTitle}</h3>
          <p>{t.explanation.estimatedEdgeBody}</p>
          <p className="mt-1 rounded-lg bg-gray-900 px-3 py-2 font-mono text-xs text-emerald-400">
            {t.explanation.estimatedEdgeFormula}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">{t.explanation.varianceTitle}</h3>
          <p>{t.explanation.varianceBody}</p>
        </div>
      </div>
    </section>
  );
}
