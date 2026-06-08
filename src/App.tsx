import { useCallback, useEffect, useMemo, useState } from 'react';
import { CollapsibleSection } from './components/CollapsibleSection';
import { DealerPanel } from './components/DealerPanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ExtraCardsPanel } from './components/ExtraCardsPanel';
import { HandFlowGuide } from './components/HandFlowGuide';
import { MobileStrategyBar } from './components/MobileStrategyBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PhaseBanner } from './components/PhaseBanner';
import { PlayerActions } from './components/PlayerActions';
import { PlayerHandPanel } from './components/PlayerHand';
import { PracticeTimer } from './components/PracticeTimer';
import { QuickMePanel } from './components/QuickMePanel';
import { RoundControls } from './components/RoundControls';
import { StrategyHero } from './components/StrategyHero';
import { TableModePanel } from './components/TableModePanel';
import { useLocale } from './i18n';
import type { Locale } from './i18n/types';
import { applyTheme, loadTheme, saveTheme, type AppTheme } from './lib/theme';
import { evaluateHand, getStrategy } from './lib/blackjack';
import { calculateCountStats } from './lib/count';
import {
  applyPlayerUpdates,
  canDealerHit,
  collectAllSeenCards,
  collectCurrentRoundCards,
  getActiveHandEntry,
  getDealerHandCards,
  getMeHandDisplay,
  getMePlayer,
  isDealerHandComplete,
  newRoundPatch,
  nextActiveHandIndex,
  splitPlayerHand,
  syncHandPhase,
} from './lib/handPhase';
import { loadState, saveState } from './lib/storage';
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  type AppState,
  type CardRank,
  type HandStatus,
  type Player,
} from './types/blackjack';

export default function App() {
  const { t, locale, setLocale } = useLocale();
  const [state, setState] = useState<AppState>(loadState);
  const [showMobilePlay, setShowMobilePlay] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [appTheme, setAppTheme] = useState<AppTheme>(loadTheme);

  useEffect(() => {
    applyTheme(appTheme);
  }, [appTheme]);

  const setTheme = (theme: AppTheme) => {
    setAppTheme(theme);
    saveTheme(theme);
  };

  useEffect(() => {
    saveState(state);
  }, [state]);

  const allSeenCards = useMemo(() => collectAllSeenCards(state), [state]);
  const stats = useMemo(
    () => calculateCountStats(state.deckCount, allSeenCards),
    [state.deckCount, allSeenCards],
  );

  const update = useCallback((patch: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
    setState((prev) => ({
      ...prev,
      ...(typeof patch === 'function' ? patch(prev) : patch),
    }));
  }, []);

  const mePlayer = getMePlayer(state);
  const meHandDisplay = getMeHandDisplay(state);
  const activeEntry = mePlayer
    ? getActiveHandEntry(mePlayer, state.activeHandIndex)
    : null;
  const meHandCards = meHandDisplay.cards;
  const meHandEval = evaluateHand(meHandCards);
  const meStrategy =
    state.dealerUpcard && meHandCards.length > 0 && state.handPhase === 'playerTurn'
      ? getStrategy(meHandCards, state.dealerUpcard, stats.trueCount, t)
      : null;

  const handleDeckCountChange = (count: number) => {
    update({ deckCount: Math.max(1, Math.min(8, count)) });
  };

  const handleAddPlayer = () => {
    if (state.players.length >= MAX_PLAYERS) return;
    const num = state.players.length + 1;
    const newPlayer: Player = {
      id: `player-${num}-${Date.now()}`,
      name: t.players.playerName(num),
      hands: [{ id: `hand-${num}-1`, cards: [], status: 'playing' }],
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

  const applyPlayersUpdate = (
    build: (prev: AppState) => { players: Player[]; activeHandIndex?: number },
  ) => {
    setState((prev) => {
      const { players, activeHandIndex = prev.activeHandIndex } = build(prev);
      return { ...prev, ...applyPlayerUpdates(prev, players, activeHandIndex) };
    });
  };

  const handleMeAddCard = (card: CardRank) => {
    applyPlayersUpdate((prev) => {
      if (prev.handPhase !== 'opening' && prev.handPhase !== 'playerTurn') {
        return { players: prev.players };
      }
      const me = getMePlayer(prev);
      if (!me) return { players: prev.players };

      let index = prev.activeHandIndex;
      const entry = getActiveHandEntry(me, prev.activeHandIndex);
      if (entry) {
        index = entry.index;
      } else if (prev.handPhase === 'opening') {
        index = Math.min(prev.activeHandIndex, me.hands.length - 1);
      } else {
        return { players: prev.players };
      }

      const hand = me.hands[index];
      if (hand?.status === 'doubled' && hand.cards.length >= 3) {
        return { players: prev.players };
      }

      const players = prev.players.map((p) => {
        if (p.id !== me.id) return p;
        return {
          ...p,
          hands: p.hands.map((h, hi) =>
            hi !== index ? h : { ...h, cards: [...h.cards, card] },
          ),
        };
      });
      return { players };
    });
  };

  const handleMeRemoveCard = (cardIndex: number) => {
    applyPlayersUpdate((prev) => {
      const me = getMePlayer(prev);
      if (!me) return { players: prev.players };
      const entry = getActiveHandEntry(me, prev.activeHandIndex);
      if (!entry) return { players: prev.players };
      const { index } = entry;

      const players = prev.players.map((p) => {
        if (p.id !== me.id) return p;
        return {
          ...p,
          hands: p.hands.map((h, hi) =>
            hi !== index ? h : { ...h, cards: h.cards.filter((_, ci) => ci !== cardIndex) },
          ),
        };
      });
      return { players, activeHandIndex: prev.activeHandIndex };
    });
  };

  const handlePlayerCard = (
    playerId: string,
    handIndex: number,
    card: CardRank,
    action: 'add' | 'remove',
    cardIndex?: number,
  ) => {
    applyPlayersUpdate((prev) => {
      const players = prev.players.map((p) => {
        if (p.id !== playerId) return p;
        const hands = p.hands.map((h, hi) => {
          if (hi !== handIndex) return h;
          if (action === 'add') return { ...h, cards: [...h.cards, card] };
          return { ...h, cards: h.cards.filter((_, ci) => ci !== cardIndex) };
        });
        return { ...p, hands };
      });
      return { players };
    });
  };

  const handleSetPlayerCards = (playerId: string, handIndex: number, cards: CardRank[]) => {
    applyPlayersUpdate((prev) => {
      const players = prev.players.map((p) => {
        if (p.id !== playerId) return p;
        const hands = p.hands.map((h, hi) => (hi === handIndex ? { ...h, cards } : h));
        return { ...p, hands };
      });
      return { players };
    });
  };

  const setHandStatus = (handIndex: number, status: HandStatus) => {
    applyPlayersUpdate((prev) => {
      const me = getMePlayer(prev);
      if (!me) return { players: prev.players };

      const players = prev.players.map((p) => {
        if (p.id !== me.id) return p;
        const hands = p.hands.map((h, hi) => (hi === handIndex ? { ...h, status } : h));
        return { ...p, hands };
      });
      const updatedMe = players.find((p) => p.id === me.id)!;
      const nextIndex = nextActiveHandIndex(updatedMe, handIndex);
      return { players, activeHandIndex: nextIndex };
    });
  };

  const handleStand = () => {
    if (!activeEntry) return;
    setHandStatus(activeEntry.index, 'stood');
  };

  const handleSplit = () => {
    applyPlayersUpdate((prev) => {
      const me = getMePlayer(prev);
      if (!me) return { players: prev.players };
      const entry = getActiveHandEntry(me, prev.activeHandIndex);
      if (!entry) return { players: prev.players };
      const split = splitPlayerHand(me, entry.index);
      if (!split) return { players: prev.players };
      const players = prev.players.map((p) => (p.id === me.id ? split : p));
      return { players, activeHandIndex: entry.index };
    });
  };

  const handleDouble = () => {
    if (!activeEntry || activeEntry.hand.cards.length !== 2) return;
    setHandStatus(activeEntry.index, 'doubled');
  };

  const handleSetUpcard = (card: CardRank | null) => {
    setState((prev) => {
      const next = { ...prev, dealerUpcard: card };
      if (!card) next.handPhase = 'opening';
      return { ...next, ...applyPlayerUpdates(next, next.players) };
    });
  };

  const handleSetHoleCard = (card: CardRank) => {
    update((prev) => {
      const patch: Partial<AppState> = {
        dealerHoleCard: card,
        dealerHoleRevealed: true,
      };
      const nextCards = getDealerHandCards({ ...prev, ...patch, dealerDrawCards: prev.dealerDrawCards });
      patch.handPhase = isDealerHandComplete(nextCards) ? 'roundEnd' : 'dealerDraw';
      return patch;
    });
  };

  const handleClearHole = () => {
    update({ dealerHoleCard: null, dealerHoleRevealed: false, handPhase: 'dealerReveal' });
  };

  const handleFinishDealer = () => {
    update({ handPhase: 'roundEnd' });
  };

  const handleSaveRound = () => {
    update((prev) => {
      const currentCards = collectCurrentRoundCards(prev);
      if (currentCards.length === 0) return {};
      return {
        savedRounds: [
          ...prev.savedRounds,
          { id: `round-${Date.now()}`, timestamp: Date.now(), cards: currentCards },
        ],
        ...newRoundPatch(prev),
      };
    });
  };

  const handleNewRound = () => update((prev) => newRoundPatch(prev));

  const handleResetShoe = () => {
    update((prev) => ({ savedRounds: [], ...newRoundPatch(prev) }));
  };

  const handleUndoLastRound = () => {
    if (state.savedRounds.length === 0) return;
    update({ savedRounds: state.savedRounds.slice(0, -1) });
  };

  const handleLockPreliminary = () => {
    if (!mePlayer || !activeEntry || !state.dealerUpcard) return;
    const strategy = getStrategy(
      activeEntry.hand.cards,
      state.dealerUpcard,
      stats.trueCount,
      t,
    );
    update({
      preliminaryDecision: {
        action: strategy.action,
        runningCount: stats.runningCount,
        trueCount: stats.trueCount,
        playerId: mePlayer.id,
        handIndex: activeEntry.index,
      },
    });
  };

  const otherPlayers = state.players.filter((p) => p.id !== state.mePlayerId);
  const hasOtherPlayers = otherPlayers.length > 0;
  const dealerHandCards = getDealerHandCards(state);
  const dealerHandEval = evaluateHand(dealerHandCards);
  const dealerComplete = isDealerHandComplete(dealerHandCards);
  const dealerCanHit = canDealerHit(state);

  const handleAddDealerDrawCard = (card: CardRank) => {
    update((prev) => {
      if (!canDealerHit(prev)) return {};
      const drawCards = [...prev.dealerDrawCards, card];
      const nextCards = getDealerHandCards({ ...prev, dealerDrawCards: drawCards });
      const patch: Partial<AppState> = { dealerDrawCards: drawCards };
      if (isDealerHandComplete(nextCards)) {
        patch.handPhase = 'roundEnd';
      }
      return patch;
    });
  };

  const sidebar = (
    <aside className="space-y-3 lg:sticky lg:top-3 lg:self-start">
      <StrategyHero
        handPhase={state.handPhase}
        dealerUpcard={state.dealerUpcard}
        playerCards={meHandCards}
        handTotal={meHandEval.total}
        action={meStrategy?.action ?? null}
        reason={meStrategy?.reason ?? null}
        stats={stats}
      />
      <PlayerActions
        handPhase={state.handPhase}
        cards={meHandCards}
        handStatus={meHandDisplay.status}
        dealerUpcard={state.dealerUpcard}
        trueCount={stats.trueCount}
        onStand={handleStand}
        onSplit={handleSplit}
        onDouble={handleDouble}
        onFinishDealer={handleFinishDealer}
      />
      <PracticeTimer
        dealerUpcard={state.dealerUpcard}
        playerCards={meHandCards}
        handTotal={meHandEval.total}
        recommendedAction={meStrategy?.action ?? null}
      />
    </aside>
  );

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-3 pb-24 pt-3 lg:pb-8">
      <OfflineIndicator />

      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">{t.app.title}</h1>
          <p className="text-xs text-gray-400 sm:text-sm">{t.app.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-start">
          <div>
            <label className="mb-1 block text-right text-xs text-gray-500">{t.theme.label}</label>
            <div className="flex gap-1">
              {(['classic', 'casino'] as AppTheme[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setTheme(code)}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                    appTheme === code
                      ? code === 'casino'
                        ? 'bg-yellow-600 text-gray-900'
                        : 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {t.theme[code]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-right text-xs text-gray-500">{t.language.label}</label>
          <div className="flex gap-1">
            {(['es', 'en'] as Locale[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                  locale === code ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {t.language[code]}
              </button>
            ))}
          </div>
          </div>
        </div>
      </header>

      <PhaseBanner phase={state.handPhase} state={state} hasOtherPlayers={hasOtherPlayers} />

      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_300px]">
        <main className="space-y-3">
          <HandFlowGuide state={state} hasOtherPlayers={hasOtherPlayers} />

          <section className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-700 bg-gray-800/60 px-3 py-2">
            <span className="text-sm text-gray-400">{t.shoe.decks}</span>
            <button
              type="button"
              onClick={() => handleDeckCountChange(state.deckCount - 1)}
              className="h-9 w-9 rounded-lg bg-gray-700 font-bold"
            >
              −
            </button>
            <span className="min-w-6 text-center text-lg font-bold">{state.deckCount}</span>
            <button
              type="button"
              onClick={() => handleDeckCountChange(state.deckCount + 1)}
              className="h-9 w-9 rounded-lg bg-gray-700 font-bold"
            >
              +
            </button>
            <span className="text-xs text-gray-500">{t.shoe.hint}</span>
          </section>

          {(state.savedRounds.length === 0 || state.extraCards.length > 0) && (
            <ExtraCardsPanel
              cards={state.extraCards}
              onAdd={(r) => update((prev) => ({ extraCards: [...prev.extraCards, r] }))}
              onRemove={(idx) =>
                update((prev) => ({
                  extraCards: prev.extraCards.filter((_, i) => i !== idx),
                }))
              }
              compact={state.extraCards.length === 0 && Boolean(state.dealerUpcard)}
            />
          )}

          <DealerPanel
            handPhase={state.handPhase}
            upcard={state.dealerUpcard}
            holeCard={state.dealerHoleCard}
            drawCards={state.dealerDrawCards}
            dealerTotal={dealerHandEval.total}
            dealerComplete={dealerComplete}
            dealerCanHit={dealerCanHit}
            dealerIsBust={dealerHandEval.isBust}
            onSetUpcard={handleSetUpcard}
            onSetHoleCard={handleSetHoleCard}
            onClearHole={handleClearHole}
            onAddDrawCard={handleAddDealerDrawCard}
            onRemoveDrawCard={(idx) =>
              update((prev) => {
                const drawCards = prev.dealerDrawCards.filter((_, i) => i !== idx);
                const next = { ...prev, dealerDrawCards: drawCards };
                return {
                  dealerDrawCards: drawCards,
                  handPhase: syncHandPhase(next),
                };
              })
            }
          />

          {mePlayer && (
            <QuickMePanel
              handPhase={state.handPhase}
              cards={meHandCards}
              handIndex={meHandDisplay.index}
              handCount={mePlayer.hands.length}
              onAddCard={handleMeAddCard}
              onRemoveCard={handleMeRemoveCard}
            />
          )}

          {hasOtherPlayers && (
            <CollapsibleSection title={t.ui.otherPlayers}>
              <p className="mb-2 text-xs text-gray-500">{t.ui.otherPlayersHint}</p>
              <div className="space-y-3">
                {otherPlayers.map((player) => (
                  <PlayerHandPanel
                    key={player.id}
                    player={player}
                    isMe={false}
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
              </div>
            </CollapsibleSection>
          )}

          <button
            type="button"
            onClick={handleAddPlayer}
            disabled={state.players.length >= MAX_PLAYERS}
            className="w-full rounded-lg bg-gray-800 py-2 text-sm text-gray-400 disabled:opacity-40"
          >
            {t.players.addPlayer}
          </button>

          <CollapsibleSection title={t.ui.advanced}>
            <div className="space-y-3">
              <TableModePanel
                players={state.players}
                mePlayerId={state.mePlayerId}
                dealerUpcard={state.dealerUpcard}
                trueCount={stats.trueCount}
                runningCount={stats.runningCount}
                preliminaryDecision={state.preliminaryDecision}
                onSetMePlayer={(id) => update({ mePlayerId: id })}
                onLockPreliminary={handleLockPreliminary}
              />

              <button
                type="button"
                onClick={() => setShowExplanation((v) => !v)}
                className="w-full rounded-lg border border-gray-600 py-2 text-sm text-gray-300"
              >
                {showExplanation ? t.explanation.hide : t.explanation.show}
              </button>
              {showExplanation && <ExplanationPanel />}
            </div>
          </CollapsibleSection>

          <RoundControls
            onSaveRound={handleSaveRound}
            onNewRound={handleNewRound}
            onResetShoe={handleResetShoe}
            onUndoLastRound={handleUndoLastRound}
            savedRoundCount={state.savedRounds.length}
          />
        </main>

        <div className="hidden lg:block">{sidebar}</div>
      </div>

      <MobileStrategyBar
        open={showMobilePlay}
        onToggle={() => setShowMobilePlay((v) => !v)}
        handPhase={state.handPhase}
        dealerUpcard={state.dealerUpcard}
        playerCards={meHandCards}
        handStatus={meHandDisplay.status}
        handTotal={meHandEval.total}
        action={meStrategy?.action ?? null}
        reason={meStrategy?.reason ?? null}
        stats={stats}
        trueCount={stats.trueCount}
        onStand={handleStand}
        onSplit={handleSplit}
        onDouble={handleDouble}
        onFinishDealer={handleFinishDealer}
      />
    </div>
  );
}
