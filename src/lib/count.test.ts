import { describe, expect, it } from 'vitest';
import {
  bettingSuggestion,
  calculateCountStats,
  decksRemaining,
  estimatedEdge,
  hiLoValue,
  insuranceSuggestion,
  penetration,
  runningCount,
  trueCount,
} from './count';

describe('Hi-Lo count', () => {
  it('assigns correct values to card ranks', () => {
    expect(hiLoValue('5')).toBe(1);
    expect(hiLoValue('10')).toBe(-1);
    expect(hiLoValue('7')).toBe(0);
    expect(hiLoValue('A')).toBe(-1);
  });

  it('sums running count from multiple cards', () => {
    expect(runningCount(['5', '6', '10', 'K'])).toBe(0);
    expect(runningCount(['2', '3', '4', '5', '6'])).toBe(5);
  });
});

describe('True count and penetration', () => {
  it('calculates decks remaining with minimum floor', () => {
    expect(decksRemaining(416, 404)).toBeCloseTo(0.25);
    expect(decksRemaining(416, 52)).toBeCloseTo(7);
  });

  it('derives true count from running count and decks left', () => {
    expect(trueCount(6, 3)).toBe(2);
    expect(trueCount(-2, 0.5)).toBe(-4);
  });

  it('calculates penetration percentage', () => {
    expect(penetration(104, 416)).toBe(25);
    expect(penetration(0, 416)).toBe(0);
  });
});

describe('Betting and edge', () => {
  it('maps true count to betting suggestions', () => {
    expect(bettingSuggestion(0.5)).toBe('MINIMUM');
    expect(bettingSuggestion(1)).toBe('BASE');
    expect(bettingSuggestion(2)).toBe('RAISE x2');
    expect(bettingSuggestion(3)).toBe('RAISE x4');
    expect(bettingSuggestion(5)).toBe('AGGRESSIVE');
  });

  it('estimates edge from true count', () => {
    expect(estimatedEdge(3)).toBe(1);
    expect(estimatedEdge(1)).toBe(0);
  });

  it('suggests insurance only with Ace upcard and high true count', () => {
    expect(insuranceSuggestion('A', 3)).toBe(true);
    expect(insuranceSuggestion('A', 2.9)).toBe(false);
    expect(insuranceSuggestion('10', 5)).toBe(false);
  });
});

describe('calculateCountStats integration', () => {
  it('aggregates stats for an 8-deck shoe with seen cards', () => {
    const stats = calculateCountStats(8, ['5', '6', '10', 'K', '2', '3']);
    expect(stats.cardsSeen).toBe(6);
    expect(stats.runningCount).toBe(2);
    expect(stats.totalCards).toBe(416);
    expect(stats.bettingSuggestion).toBe('MINIMUM');
  });
});
