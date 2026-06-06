import { describe, expect, it } from 'vitest';
import { en, es } from '../i18n/locales';
import { DEFAULT_LOCALE } from '../i18n/types';
import {
  evaluateHand,
  getStrategy,
  parseCardInput,
} from './blackjack';

describe('evaluateHand', () => {
  it('detects blackjack, pairs and bust', () => {
    expect(evaluateHand(['A', 'K']).isBlackjack).toBe(true);
    expect(evaluateHand(['8', '8']).isPair).toBe(true);
    expect(evaluateHand(['10', '7', '5']).isBust).toBe(true);
  });

  it('marks single ace as soft and converts to hard when total exceeds 21', () => {
    const soft = evaluateHand(['A']);
    expect(soft.total).toBe(11);
    expect(soft.isSoft).toBe(true);

    const hard = evaluateHand(['A', '6', '5']);
    expect(hard.total).toBe(12);
    expect(hard.isSoft).toBe(false);
  });
});

describe('getStrategy', () => {
  it('recommends stand on hard 17 vs dealer 6', () => {
    const result = getStrategy(['10', '7'], '6', 0, es);
    expect(result.action).toBe('STAND');
    expect(result.reason).toBe(es.strategyReasons.hard(17));
  });

  it('recommends split on pair of 8s', () => {
    const result = getStrategy(['8', '8'], '10', 0, es);
    expect(result.action).toBe('SPLIT');
  });

  it('applies count deviation: stand 16 vs 10 at TC >= 0', () => {
    const below = getStrategy(['10', '6'], '10', -0.1, es);
    const atZero = getStrategy(['10', '6'], '10', 0, es);
    expect(below.action).toBe('HIT');
    expect(atZero.action).toBe('STAND');
  });

  it('returns localized reasons in English', () => {
    const result = getStrategy(['A', 'K'], '6', 0, en);
    expect(result.action).toBe('BLACKJACK');
    expect(result.reason).toBe(en.strategyReasons.naturalBlackjack);
  });
});

describe('parseCardInput', () => {
  it('parses comma-separated cards including T alias', () => {
    const result = parseCardInput('A,7', es);
    expect(result.error).toBeNull();
    expect(result.cards).toEqual(['A', '7']);
  });

  it('accepts multiple cards in one input', () => {
    const result = parseCardInput('10,6,K', es);
    expect(result.error).toBeNull();
    expect(result.cards).toEqual(['10', '6', 'K']);
  });

  it('returns localized error for invalid card', () => {
    const result = parseCardInput('A,XX', es);
    expect(result.cards).toEqual([]);
    expect(result.error).toBe(es.parseCardErrors.invalidCard('XX'));
  });

  it('returns localized error for empty segment', () => {
    const result = parseCardInput('A,,7', es);
    expect(result.error).toBe(es.parseCardErrors.emptyCard);
  });
});

describe('default locale', () => {
  it('is Spanish', () => {
    expect(DEFAULT_LOCALE).toBe('es');
  });
});
