import type { Translations } from '../i18n/locales';
import type { CardRank, StrategyAction } from '../types/blackjack';
import { CARD_RANKS } from '../types/blackjack';

export interface HandEvaluation {
  total: number;
  isSoft: boolean;
  isPair: boolean;
  pairValue: number | null;
  isBlackjack: boolean;
  isBust: boolean;
  is21: boolean;
}

export interface StrategyResult {
  action: StrategyAction;
  reason: string;
}

const TEN_VALUE_RANKS: CardRank[] = ['10', 'J', 'Q', 'K'];

export function cardValue(rank: CardRank): number {
  if (rank === 'A') return 11;
  if (TEN_VALUE_RANKS.includes(rank)) return 10;
  return parseInt(rank, 10);
}

export function isTenValue(rank: CardRank): boolean {
  return TEN_VALUE_RANKS.includes(rank);
}

export function dealerUpcardValue(rank: CardRank): number {
  if (rank === 'A') return 11;
  if (isTenValue(rank)) return 10;
  return parseInt(rank, 10);
}

export function evaluateHand(cards: CardRank[]): HandEvaluation {
  if (cards.length === 0) {
    return {
      total: 0,
      isSoft: false,
      isPair: false,
      pairValue: null,
      isBlackjack: false,
      isBust: false,
      is21: false,
    };
  }

  let total = 0;
  let aces = 0;

  for (const card of cards) {
    total += cardValue(card);
    if (card === 'A') aces++;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  const isSoft = cards.some((c) => c === 'A') && total <= 21 && total + 10 <= 21;
  const isPair = cards.length === 2 && cardValue(cards[0]) === cardValue(cards[1]);
  const pairValue = isPair ? cardValue(cards[0]) : null;
  const isBlackjack = cards.length === 2 && total === 21;
  const isBust = total > 21;
  const is21 = total === 21 && !isBlackjack;

  return { total, isSoft, isPair, pairValue, isBlackjack, isBust, is21 };
}

function dealerIs(dealer: CardRank, values: number[]): boolean {
  return values.includes(dealerUpcardValue(dealer));
}

function pairStrategy(
  pairValue: number,
  dealer: CardRank,
  trueCount: number,
): StrategyAction | null {
  if (pairValue === 11) return 'SPLIT'; // A,A
  if (pairValue === 8) return 'SPLIT'; // 8,8
  if (pairValue === 10) {
    if (dealerUpcardValue(dealer) === 6 && trueCount >= 5) return 'SPLIT';
    return 'STAND';
  }
  if (pairValue === 9) {
    return dealerIs(dealer, [2, 3, 4, 5, 6, 8, 9]) ? 'SPLIT' : 'STAND';
  }
  if (pairValue === 7) {
    return dealerIs(dealer, [2, 3, 4, 5, 6, 7]) ? 'SPLIT' : 'HIT';
  }
  if (pairValue === 6) {
    return dealerIs(dealer, [2, 3, 4, 5, 6]) ? 'SPLIT' : 'HIT';
  }
  if (pairValue === 5) return 'DOUBLE'; // never split 5,5
  if (pairValue === 4) {
    return dealerIs(dealer, [5, 6]) ? 'SPLIT' : 'HIT';
  }
  if (pairValue === 2 || pairValue === 3) {
    return dealerIs(dealer, [4, 5, 6, 7]) ? 'SPLIT' : 'HIT';
  }
  return null;
}

function softStrategy(total: number, dealer: CardRank): StrategyAction {
  if (total <= 17) {
    // A,2 (13) or A,3 (14)
    if (total === 13 || total === 14) {
      return dealerIs(dealer, [5, 6]) ? 'DOUBLE' : 'HIT';
    }
    // A,4 (15) or A,5 (16)
    if (total === 15 || total === 16) {
      return dealerIs(dealer, [4, 5, 6]) ? 'DOUBLE' : 'HIT';
    }
    // A,6 (17)
    if (total === 17) {
      return dealerIs(dealer, [3, 4, 5, 6]) ? 'DOUBLE' : 'HIT';
    }
  }

  // A,7 (18)
  if (total === 18) {
    if (dealerIs(dealer, [3, 4, 5, 6])) return 'DOUBLE';
    if (dealerIs(dealer, [2, 7, 8])) return 'STAND';
    return 'HIT'; // vs 9, 10, A
  }

  // A,8 (19) and A,9 (20)
  return 'STAND';
}

function hardStrategy(total: number, dealer: CardRank, trueCount: number): StrategyAction {
  const d = dealerUpcardValue(dealer);

  // Count deviations
  if (total === 16 && d === 10 && trueCount >= 0) return 'STAND';
  if (total === 15 && d === 10 && trueCount >= 4) return 'STAND';
  if (total === 12 && d === 3 && trueCount >= 2) return 'STAND';
  if (total === 12 && d === 2 && trueCount >= 3) return 'STAND';
  if (total === 10 && d === 10 && trueCount >= 4) return 'DOUBLE';
  if (total === 11 && d === 11 && trueCount >= 1) return 'DOUBLE';

  if (total <= 8) return 'HIT';

  if (total === 9) {
    return dealerIs(dealer, [3, 4, 5, 6]) ? 'DOUBLE' : 'HIT';
  }

  if (total === 10) {
    return dealerIs(dealer, [2, 3, 4, 5, 6, 7, 8, 9]) ? 'DOUBLE' : 'HIT';
  }

  if (total === 11) {
    return d === 11 ? 'HIT' : 'DOUBLE';
  }

  if (total === 12) {
    return dealerIs(dealer, [4, 5, 6]) ? 'STAND' : 'HIT';
  }

  if (total >= 13 && total <= 16) {
    return dealerIs(dealer, [2, 3, 4, 5, 6]) ? 'STAND' : 'HIT';
  }

  return 'STAND';
}

export function getStrategy(
  cards: CardRank[],
  dealerCard: CardRank,
  trueCount: number,
  t: Translations,
): StrategyResult {
  if (cards.length === 0) {
    return { action: 'HIT', reason: t.strategyReasons.noCards };
  }

  const hand = evaluateHand(cards);

  if (hand.isBlackjack) {
    return { action: 'BLACKJACK', reason: t.strategyReasons.naturalBlackjack };
  }

  if (hand.isBust) {
    return { action: 'BUST', reason: t.strategyReasons.bust(hand.total) };
  }

  if (hand.is21) {
    return { action: '21', reason: t.strategyReasons.reached21 };
  }

  if (hand.isPair && hand.pairValue !== null) {
    const pairAction = pairStrategy(hand.pairValue, dealerCard, trueCount);
    if (pairAction) {
      return { action: pairAction, reason: t.strategyReasons.pair(hand.pairValue) };
    }
  }

  if (hand.isSoft) {
    const action = softStrategy(hand.total, dealerCard);
    return { action, reason: t.strategyReasons.soft(hand.total) };
  }

  const action = hardStrategy(hand.total, dealerCard, trueCount);
  return { action, reason: t.strategyReasons.hard(hand.total) };
}

export function parseCardInput(
  input: string,
  t: Translations,
): { cards: CardRank[]; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { cards: [], error: null };
  }

  const parts = trimmed.split(',').map((p) => p.trim().toUpperCase());
  const cards: CardRank[] = [];

  for (const part of parts) {
    if (!part) {
      return { cards: [], error: t.parseCardErrors.emptyCard };
    }

    const normalized = part === 'T' ? '10' : part;
    if (!CARD_RANKS.includes(normalized as CardRank)) {
      return {
        cards: [],
        error: t.parseCardErrors.invalidCard(part),
      };
    }
    cards.push(normalized as CardRank);
  }

  return { cards, error: null };
}

export function formatCards(cards: CardRank[]): string {
  return cards.join(', ');
}

export const ACTION_COLORS: Record<StrategyAction, string> = {
  HIT: 'bg-blue-600',
  STAND: 'bg-green-600',
  DOUBLE: 'bg-yellow-600 text-gray-900',
  SPLIT: 'bg-purple-600',
  BUST: 'bg-red-700',
  BLACKJACK: 'bg-emerald-500 text-gray-900',
  '21': 'bg-teal-600',
  INSURANCE: 'bg-orange-600',
};
