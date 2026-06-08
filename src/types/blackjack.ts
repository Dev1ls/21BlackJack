export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type StrategyAction =
  | 'HIT'
  | 'STAND'
  | 'DOUBLE'
  | 'SPLIT'
  | 'BUST'
  | 'BLACKJACK'
  | '21'
  | 'INSURANCE';

export type BettingSuggestion = 'MINIMUM' | 'BASE' | 'RAISE x2' | 'RAISE x4' | 'AGGRESSIVE';

export type HandStatus = 'playing' | 'stood' | 'doubled' | 'bust' | 'blackjack';

export type HandPhase =
  | 'opening'
  | 'playerTurn'
  | 'dealerReveal'
  | 'dealerDraw'
  | 'roundEnd';

export interface PlayerHand {
  id: string;
  cards: CardRank[];
  status: HandStatus;
}

export interface Player {
  id: string;
  name: string;
  hands: PlayerHand[];
}

export interface SavedRound {
  id: string;
  timestamp: number;
  cards: CardRank[];
}

export interface PreliminaryDecision {
  action: StrategyAction;
  runningCount: number;
  trueCount: number;
  playerId: string;
  handIndex: number;
}

export interface AppState {
  deckCount: number;
  players: Player[];
  mePlayerId: string | null;
  activeHandIndex: number;
  dealerUpcard: CardRank | null;
  dealerHoleCard: CardRank | null;
  dealerHoleRevealed: boolean;
  dealerDrawCards: CardRank[];
  handPhase: HandPhase;
  extraCards: CardRank[];
  savedRounds: SavedRound[];
  preliminaryDecision: PreliminaryDecision | null;
}

export const CARD_RANKS: CardRank[] = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
];

export const DEFAULT_DECK_COUNT = 8;
export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 5;
export const DEFAULT_PLAYER_COUNT = 1;

/** @deprecated Legacy field — migrated to dealerUpcard in loadState */
export type LegacyAppState = AppState & { dealerCard?: CardRank | null };
