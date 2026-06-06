import type { BettingSuggestion, CardRank } from '../types/blackjack';

const HI_LO_VALUES: Record<CardRank, number> = {
  A: -1,
  '2': 1,
  '3': 1,
  '4': 1,
  '5': 1,
  '6': 1,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': -1,
  J: -1,
  Q: -1,
  K: -1,
};

export function hiLoValue(card: CardRank): number {
  return HI_LO_VALUES[card];
}

export function runningCount(cards: CardRank[]): number {
  return cards.reduce((sum, card) => sum + hiLoValue(card), 0);
}

export function decksRemaining(totalCards: number, cardsSeen: number): number {
  const remaining = (totalCards - cardsSeen) / 52;
  return Math.max(remaining, 0.25);
}

export function trueCount(running: number, decksRem: number): number {
  return running / decksRem;
}

export function penetration(cardsSeen: number, totalCards: number): number {
  if (totalCards === 0) return 0;
  return (cardsSeen / totalCards) * 100;
}

export function bettingSuggestion(tc: number): BettingSuggestion {
  if (tc >= 5) return 'AGGRESSIVE';
  if (tc >= 3) return 'RAISE x4';
  if (tc >= 2) return 'RAISE x2';
  if (tc >= 1) return 'BASE';
  return 'MINIMUM';
}

export function estimatedEdge(tc: number): number {
  return (tc - 1) * 0.5;
}

export function insuranceSuggestion(dealerCard: CardRank | null, tc: number): boolean {
  return dealerCard === 'A' && tc >= 3;
}

export interface CountStats {
  runningCount: number;
  trueCount: number;
  cardsSeen: number;
  decksRemaining: number;
  penetration: number;
  bettingSuggestion: BettingSuggestion;
  estimatedEdge: number;
  totalCards: number;
}

export function calculateCountStats(deckCount: number, allSeenCards: CardRank[]): CountStats {
  const totalCards = deckCount * 52;
  const cardsSeen = allSeenCards.length;
  const decksRem = decksRemaining(totalCards, cardsSeen);
  const running = runningCount(allSeenCards);
  const tc = trueCount(running, decksRem);
  const pen = penetration(cardsSeen, totalCards);

  return {
    runningCount: running,
    trueCount: tc,
    cardsSeen,
    decksRemaining: decksRem,
    penetration: pen,
    bettingSuggestion: bettingSuggestion(tc),
    estimatedEdge: estimatedEdge(tc),
    totalCards,
  };
}
