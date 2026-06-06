import { useCallback, useEffect, useMemo, useState } from 'react';
import { CounterDashboard } from './components/CounterDashboard';
import { ExplanationPanel } from './components/ExplanationPanel';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PlayerHandPanel } from './components/PlayerHand';
import { RoundControls } from './components/RoundControls';
import { StrategyOutput } from './components/StrategyOutput';
import { TableModePanel } from './components/TableModePanel';
import { CardButton } from './components/CardButton';
import { getStrategy } from './lib/blackjack';
import { calculateCountStats } from './lib/count';
import { loadState, saveState } from './lib/storage';
import {
  CARD_RANKS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type AppState,
  type CardRank,
  type Player,
} from './types/blackjack';

function collectCurrentRoundCards(state: AppState): CardRank[] {
  const cards: CardRank[] = [];
  if (state.dealerCard) cards.push(state.dealerCard);
  for (const player of state.players) {
    for (const hand of player.hands) {
      cards.push(...hand.cards);
    }
  }
  cards.push(...state.extraCards);
  return cards;
}

function collectAllSeenCards(state: AppState): CardRank[] {
  const saved = state.savedRounds.flatMap((r) => r.cards);
  return [...saved, ...collectCurrentRoundCards(state)];
}

function emptyHands(player: Player): Player {
  return {
    ...player,
    hands: player.hands.map((h) => ({ ...h, cards: [] })),
  };
}

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const allSeenCards = useMemo(() => collectAllSeenCards(state), [state]);
  const stats = useMemo(
    () => calculateCountStats(state.deckCount, allSeenCards),
    [state.deckCount, allSeenCards],
  );

  const update = useCallback((patch: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleDeckCountChange = (count: number) => {
    const clamped = Math.max(1, Math.min(8, count));
    update({ deckCount: clamped });
  };

  const handleAddPlayer = () => {
    if (state.players.length >= MAX_PLAYERS) return;
    const num = state.players.length + 1;
    const newPlayer: Player = {
      id: `player-${num}-${Date.now()}`,
      name: `Player ${num}`,
      hands: [{ id: `hand-${num}-1`, cards: [] }],
    };
    update({ players: [...state.players, newPlayer] });
  };

  const handleRemovePlayer = (playerId: string) => {
    if (state.players.length <= MIN_PLAYERS) return;
    const players = state.players.filter((p) => p.id !== playerId);
    const mePlayerId =
      state.mePlayerId === playerId ? players[0]?.id ?? null : state.mePlayerId;
    update({ players, mePlayerId });
  };

  const handlePlayerCard = (
    playerId: string,
    handIndex: number,
    card: CardRank,
    action: 'add' | 'remove',
    cardIndex?: number,
  ) => {
    const players = state.players.map((p) => {
      if (p.id !== playerId) return p;
      const hands = p.hands.map((h, hi) => {
        if (hi !== handIndex) return h;
        if (action === 'add') {
          return { ...h, cards: [...h.cards, card] };
        }
        return {
          ...h,
          cards: h.cards.filter((_, ci) => ci !== cardIndex),
        };
      });
      return { ...p, hands };
    });
    update({ players });
  };

  const handleSetPlayerCards = (
    playerId: string,
    handIndex: number,
    cards: CardRank[],
  ) => {
    const players = state.players.map((p) => {
      if (p.id !== playerId) return p;
      const hands = p.hands.map((h, hi) =>
        hi === handIndex ? { ...h, cards } : h,
      );
      return { ...p, hands };
    });
    update({ players });
  };

  const handleSaveRound = () => {
    const currentCards = collectCurrentRoundCards(state);
    if (currentCards.length === 0) return;
    const newRound = {
      id: `round-${Date.now()}`,
      timestamp: Date.now(),
      cards: currentCards,
    };
    update({
      savedRounds: [...state.savedRounds, newRound],
      dealerCard: null,
      players: state.players.map(emptyHands),
      extraCards: [],
      preliminaryDecision: null,
    });
  };

  const handleNewRound = () => {
    update({
      dealerCard: null,
      players: state.players.map(emptyHands),
      extraCards: [],
      preliminaryDecision: null,
    });
  };

  const handleResetShoe = () => {
    update({
      savedRounds: [],
      dealerCard: null,
      players: state.players.map(emptyHands),
      extraCards: [],
      preliminaryDecision: null,
    });
  };

  const handleUndoLastRound = () => {
    if (state.savedRounds.length === 0) return;
    update({ savedRounds: state.savedRounds.slice(0, -1) });
  };

  const handleLockPreliminary = () => {
    const mePlayer = state.players.find((p) => p.id === state.mePlayerId);
    const meHand = mePlayer?.hands[0];
    if (!meHand || !state.dealerCard || meHand.cards.length === 0) return;

    const strategy = getStrategy(meHand.cards, state.dealerCard, stats.trueCount);
    update({
      preliminaryDecision: {
        action: strategy.action,
        runningCount: stats.runningCount,
        trueCount: stats.trueCount,
        playerId: mePlayer!.id,
        handIndex: 0,
      },
    });
  };

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-3 pb-8 pt-4">
      <OfflineIndicator />

      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">Blackjack Live Helper</h1>
        <p className="text-sm text-gray-400">Hi-Lo count · Strategy · Table mode</p>
      </header>

      <div className="mb-4 rounded-lg border border-gray-700 bg-gray-800/40 px-3 py-2 text-xs text-gray-400">
        This tool is educational and does not guarantee profit. Casino rules, table
        limits, penetration, mistakes, and variance affect results.
      </div>

      <div className="space-y-6">
        {/* Shoe config */}
        <section className="rounded-xl border border-gray-700 bg-gray-800/60 p-4">
          <h2 className="mb-2 text-lg font-semibold">Shoe</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Decks:</label>
            <button
              type="button"
              onClick={() => handleDeckCountChange(state.deckCount - 1)}
              className="h-10 w-10 rounded-lg bg-gray-700 text-lg font-bold"
            >
              −
            </button>
            <span className="min-w-8 text-center text-xl font-bold">
              {state.deckCount}
            </span>
            <button
              type="button"
              onClick={() => handleDeckCountChange(state.deckCount + 1)}
              className="h-10 w-10 rounded-lg bg-gray-700 text-lg font-bold"
            >
              +
            </button>
          </div>
        </section>

        <CounterDashboard stats={stats} dealerCard={state.dealerCard} />

        {/* Dealer */}
        <section className="rounded-xl border border-gray-700 bg-gray-800/60 p-4">
          <h2 className="mb-2 text-lg font-semibold">Dealer Visible Card</h2>
          {state.dealerCard ? (
            <button
              type="button"
              onClick={() => update({ dealerCard: null })}
              className="mb-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 font-semibold"
            >
              {state.dealerCard} ×
            </button>
          ) : (
            <p className="mb-2 text-sm text-gray-500">Tap a card below</p>
          )}
          <div className="flex flex-wrap gap-1">
            {CARD_RANKS.map((rank) => (
              <CardButton
                key={`dealer-${rank}`}
                rank={rank}
                onClick={(r) => update({ dealerCard: r })}
              />
            ))}
          </div>
        </section>

        {/* Players */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Players</h2>
            <button
              type="button"
              onClick={handleAddPlayer}
              disabled={state.players.length >= MAX_PLAYERS}
              className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-medium disabled:opacity-40"
            >
              + Add Player
            </button>
          </div>
          {state.players.map((player) => (
            <PlayerHandPanel
              key={player.id}
              player={player}
              isMe={player.id === state.mePlayerId}
              onSetMe={() => update({ mePlayerId: player.id })}
              onRemove={() => handleRemovePlayer(player.id)}
              canRemove={state.players.length > MIN_PLAYERS}
              onAddCard={(handIdx, card) =>
                handlePlayerCard(player.id, handIdx, card, 'add')
              }
              onRemoveCard={(handIdx, cardIdx) =>
                handlePlayerCard(player.id, handIdx, '' as CardRank, 'remove', cardIdx)
              }
              onSetCards={(handIdx, cards) =>
                handleSetPlayerCards(player.id, handIdx, cards)
              }
            />
          ))}
        </section>

        {/* Extra visible cards */}
        <section className="rounded-xl border border-gray-700 bg-gray-800/60 p-4">
          <h2 className="mb-2 text-lg font-semibold">Extra Visible Cards</h2>
          <p className="mb-2 text-xs text-gray-500">
            Discards, other players, burn cards, etc.
          </p>
          <div className="mb-2 flex flex-wrap gap-1">
            {state.extraCards.map((card, idx) => (
              <button
                key={`extra-${idx}`}
                type="button"
                onClick={() =>
                  update({
                    extraCards: state.extraCards.filter((_, i) => i !== idx),
                  })
                }
                className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm font-semibold"
              >
                {card} ×
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {CARD_RANKS.map((rank) => (
              <CardButton
                key={`extra-${rank}`}
                rank={rank}
                size="sm"
                onClick={(r) => update({ extraCards: [...state.extraCards, r] })}
              />
            ))}
          </div>
        </section>

        <StrategyOutput
          players={state.players}
          dealerCard={state.dealerCard}
          trueCount={stats.trueCount}
          mePlayerId={state.mePlayerId}
        />

        <TableModePanel
          players={state.players}
          mePlayerId={state.mePlayerId}
          dealerCard={state.dealerCard}
          trueCount={stats.trueCount}
          runningCount={stats.runningCount}
          preliminaryDecision={state.preliminaryDecision}
          onSetMePlayer={(id) => update({ mePlayerId: id })}
          onLockPreliminary={handleLockPreliminary}
        />

        <RoundControls
          onSaveRound={handleSaveRound}
          onNewRound={handleNewRound}
          onResetShoe={handleResetShoe}
          onUndoLastRound={handleUndoLastRound}
          savedRoundCount={state.savedRounds.length}
        />

        <button
          type="button"
          onClick={() => setShowExplanation((v) => !v)}
          className="w-full rounded-xl border border-gray-600 bg-gray-800 py-3 text-sm font-semibold text-gray-300"
        >
          {showExplanation ? 'Hide' : 'Show'} Explanation
        </button>

        {showExplanation && <ExplanationPanel />}
      </div>
    </div>
  );
}
