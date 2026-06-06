export function ExplanationPanel() {
  return (
    <section className="space-y-4 rounded-xl border border-gray-700 bg-gray-800/40 p-4">
      <h2 className="text-lg font-semibold text-gray-200">How It Works</h2>

      <div className="space-y-3 text-sm leading-relaxed text-gray-300">
        <div>
          <h3 className="font-semibold text-gray-100">Running Count</h3>
          <p>
            The running count tracks how many high vs low cards have been seen using
            the Hi-Lo system. Low cards (2–6) add +1, high cards (10–A) subtract −1,
            and 7–9 are neutral.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">True Count</h3>
          <p>
            The true count adjusts the running count for how many decks are still in
            the shoe. A +6 running count with 3 decks left (+2 true) is much stronger
            than +6 with 1 deck left (+6 true).
          </p>
          <p className="mt-1 rounded-lg bg-gray-900 px-3 py-2 font-mono text-xs text-emerald-400">
            True Count = Running Count ÷ Decks Remaining
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">Decks Remaining</h3>
          <p>
            Fewer decks remaining means each card has more impact on the count. The
            app estimates decks left from total cards minus cards seen.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">Penetration</h3>
          <p>
            Penetration is how deep into the shoe you are. Higher penetration means
            more reliable count data, but less time to bet big before the shuffle.
          </p>
          <p className="mt-1 rounded-lg bg-gray-900 px-3 py-2 font-mono text-xs text-emerald-400">
            Penetration = Cards Seen ÷ Total Cards × 100
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">Table Dynamics</h3>
          <p>
            With 3–4 players at the table, more cards are dealt face-up before your
            turn. That gives you extra time to input visible cards and refine your
            count and strategy decision.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">More Visible Cards = Better Count</h3>
          <p>
            Every card you can see — dealer upcard, your hand, other players, and
            discards — improves count accuracy. Track everything visible.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">Estimated Edge</h3>
          <p>
            The edge estimate is a rough approximation, not a guarantee of profit.
          </p>
          <p className="mt-1 rounded-lg bg-gray-900 px-3 py-2 font-mono text-xs text-emerald-400">
            Estimated Edge ≈ (True Count − 1) × 0.5%
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100">Variance Still Matters</h3>
          <p>
            Even with a positive count, short-term results swing wildly. You can lose
            many hands in a row despite playing correctly. This tool helps you make
            better decisions — it does not eliminate luck.
          </p>
        </div>
      </div>
    </section>
  );
}
