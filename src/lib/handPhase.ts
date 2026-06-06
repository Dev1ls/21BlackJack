import { evaluateHand } from './blackjack';
import type {
  AppState,
  CardRank,
  HandPhase,
  HandStatus,
  LegacyAppState,
  Player,
  PlayerHand,
} from '../types/blackjack';

export function collectCurrentRoundCards(state: AppState): CardRank[] {
  const cards: CardRank[] = [];
  if (state.dealerUpcard) cards.push(state.dealerUpcard);
  if (state.dealerHoleRevealed && state.dealerHoleCard) {
    cards.push(state.dealerHoleCard);
  }
  cards.push(...state.dealerDrawCards);
  for (const player of state.players) {
    for (const hand of player.hands) {
      cards.push(...hand.cards);
    }
  }
  cards.push(...state.extraCards);
  return cards;
}

export function collectAllSeenCards(state: AppState): CardRank[] {
  const saved = state.savedRounds.flatMap((r) => r.cards);
  return [...saved, ...collectCurrentRoundCards(state)];
}

export function getMePlayer(state: AppState): Player | undefined {
  return state.players.find((p) => p.id === state.mePlayerId);
}

export function getActiveHandEntry(
  player: Player,
  activeHandIndex: number,
): { hand: PlayerHand; index: number } | null {
  for (let offset = 0; offset < player.hands.length; offset++) {
    const index = (activeHandIndex + offset) % player.hands.length;
    const hand = player.hands[index];
    const stillPlaying =
      hand.status === 'playing' ||
      (hand.status === 'doubled' && hand.cards.length < 3);
    if (stillPlaying) {
      return { hand, index };
    }
  }
  return null;
}

export function syncHandStatus(hand: PlayerHand): PlayerHand {
  if (hand.status === 'stood' || hand.status === 'doubled') {
    if (hand.status === 'doubled' && hand.cards.length < 3) {
      const evaluation = evaluateHand(hand.cards);
      if (evaluation.isBust) return { ...hand, status: 'bust' };
      return hand;
    }
    if (hand.status === 'doubled' && hand.cards.length >= 3) {
      const evaluation = evaluateHand(hand.cards);
      if (evaluation.isBust) return { ...hand, status: 'bust' };
      return hand;
    }
    return hand;
  }
  if (hand.cards.length === 0) return { ...hand, status: 'playing' };

  const evaluation = evaluateHand(hand.cards);
  if (evaluation.isBlackjack && hand.cards.length === 2) {
    return { ...hand, status: 'blackjack' };
  }
  if (evaluation.isBust) return { ...hand, status: 'bust' };
  if (evaluation.is21) return { ...hand, status: 'stood' };
  return { ...hand, status: 'playing' };
}

export function allMyHandsDone(player: Player): boolean {
  return player.hands.every((hand) => {
    if (hand.cards.length === 0) return true;
    if (hand.status === 'doubled' && hand.cards.length < 3) return false;
    return hand.status !== 'playing';
  });
}

export function syncHandPhase(state: AppState): HandPhase {
  if (state.handPhase === 'roundEnd') return 'roundEnd';
  if (!state.dealerUpcard) return 'opening';

  const me = getMePlayer(state);
  if (!me) return 'opening';

  const active = getActiveHandEntry(me, state.activeHandIndex);
  if (active && active.hand.cards.length > 0 && active.hand.status === 'playing') {
    if (active.hand.cards.length < 2) return 'opening';
    return 'playerTurn';
  }

  if (!allMyHandsDone(me)) return 'playerTurn';

  if (!state.dealerHoleRevealed) return 'dealerReveal';
  return 'dealerDraw';
}

export function nextActiveHandIndex(player: Player, fromIndex: number): number {
  for (let offset = 1; offset < player.hands.length; offset++) {
    const index = (fromIndex + offset) % player.hands.length;
    const hand = player.hands[index];
    if (hand.status === 'playing' || (hand.status === 'doubled' && hand.cards.length < 3)) {
      return index;
    }
  }
  return fromIndex;
}

export function splitPlayerHand(player: Player, handIndex: number): Player | null {
  const hand = player.hands[handIndex];
  if (hand.cards.length !== 2) return null;
  const evaluation = evaluateHand(hand.cards);
  if (!evaluation.isPair) return null;

  const [first, second] = hand.cards;
  const hands = player.hands.map((h, idx) => {
    if (idx !== handIndex) return h;
    return { ...h, cards: [first], status: 'playing' as HandStatus };
  });
  hands.splice(handIndex + 1, 0, {
    id: `hand-split-${Date.now()}`,
    cards: [second],
    status: 'playing',
  });
  return { ...player, hands };
}

export function emptyHands(player: Player): Player {
  return {
    ...player,
    hands: player.hands.map((h) => ({
      ...h,
      cards: [],
      status: 'playing' as HandStatus,
    })),
  };
}

export function newRoundPatch(state: AppState): Partial<AppState> {
  return {
    dealerUpcard: null,
    dealerHoleCard: null,
    dealerHoleRevealed: false,
    dealerDrawCards: [],
    handPhase: 'opening',
    activeHandIndex: 0,
    players: state.players.map(emptyHands),
    extraCards: [],
    preliminaryDecision: null,
  };
}

export function normalizePlayerHand(hand: Partial<PlayerHand> & { id: string }): PlayerHand {
  return {
    id: hand.id,
    cards: hand.cards ?? [],
    status: hand.status ?? 'playing',
  };
}

export function migrateLegacyState(raw: LegacyAppState): AppState {
  const dealerUpcard = raw.dealerUpcard ?? raw.dealerCard ?? null;
  const players = (raw.players ?? []).map((player) => ({
    ...player,
    hands: player.hands.map((hand) => normalizePlayerHand(hand)),
  }));

  return {
    deckCount: raw.deckCount ?? 8,
    players,
    mePlayerId: raw.mePlayerId ?? players[0]?.id ?? null,
    activeHandIndex: raw.activeHandIndex ?? 0,
    dealerUpcard,
    dealerHoleCard: raw.dealerHoleCard ?? null,
    dealerHoleRevealed: raw.dealerHoleRevealed ?? false,
    dealerDrawCards: raw.dealerDrawCards ?? [],
    handPhase: raw.handPhase ?? 'opening',
    extraCards: raw.extraCards ?? [],
    savedRounds: raw.savedRounds ?? [],
    preliminaryDecision: raw.preliminaryDecision ?? null,
  };
}

export function applyPlayerUpdates(
  state: AppState,
  players: Player[],
  activeHandIndex = state.activeHandIndex,
): Partial<AppState> {
  const syncedPlayers = players.map((player) => ({
    ...player,
    hands: player.hands.map((hand) => syncHandStatus(hand)),
  }));
  const next: AppState = {
    ...state,
    players: syncedPlayers,
    activeHandIndex,
  };
  return {
    players: syncedPlayers,
    activeHandIndex,
    handPhase: syncHandPhase(next),
  };
}
