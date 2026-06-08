import { getMeHandDisplay } from './handPhase';
import type { AppState } from '../types/blackjack';

export type FlowStepId =
  | 'setup'
  | 'deal'
  | 'play'
  | 'others'
  | 'hole'
  | 'draw'
  | 'save';

export interface FlowStep {
  id: FlowStepId;
  optional?: boolean;
}

export const FLOW_STEPS: FlowStep[] = [
  { id: 'setup' },
  { id: 'deal' },
  { id: 'play' },
  { id: 'others', optional: true },
  { id: 'hole' },
  { id: 'draw' },
  { id: 'save' },
];

export function getFlowHint(
  step: FlowStepId,
  hints: {
    hintSetup: string;
    hintDeal: string;
    hintPlay: string;
    hintOthers: string;
    hintHole: string;
    hintDraw: string;
    hintSave: string;
  },
): string {
  const map: Record<FlowStepId, string> = {
    setup: hints.hintSetup,
    deal: hints.hintDeal,
    play: hints.hintPlay,
    others: hints.hintOthers,
    hole: hints.hintHole,
    draw: hints.hintDraw,
    save: hints.hintSave,
  };
  return map[step];
}

export function getVisibleFlowSteps(hasOtherPlayers: boolean): FlowStep[] {
  return FLOW_STEPS.filter((step) => step.id !== 'others' || hasOtherPlayers);
}

export function getCurrentFlowStep(state: AppState): FlowStepId {
  const meCards = getMeHandDisplay(state).cards;

  if (state.handPhase === 'roundEnd') return 'save';
  if (state.handPhase === 'dealerDraw') return 'draw';
  if (state.handPhase === 'dealerReveal') return 'hole';
  if (state.handPhase === 'playerTurn') return 'play';

  if (state.savedRounds.length === 0 && state.extraCards.length === 0 && !state.dealerUpcard) {
    return 'setup';
  }
  if (!state.dealerUpcard || meCards.length < 2) return 'deal';
  return 'deal';
}

export function isFlowStepComplete(stepId: FlowStepId, state: AppState): boolean {
  const current = getCurrentFlowStep(state);
  const visible = getVisibleFlowSteps(state.players.length > 1);
  const currentIdx = visible.findIndex((s) => s.id === current);
  const stepIdx = visible.findIndex((s) => s.id === stepId);
  if (stepId === 'others') return false;
  return stepIdx >= 0 && stepIdx < currentIdx;
}
