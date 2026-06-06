import type { CardRank } from '../types/blackjack';

interface CardButtonProps {
  rank: CardRank;
  onClick: (rank: CardRank) => void;
  size?: 'sm' | 'md' | 'lg';
}

const SUIT_COLORS: Record<string, string> = {
  A: 'text-red-400',
  '10': 'text-yellow-300',
  J: 'text-yellow-300',
  Q: 'text-yellow-300',
  K: 'text-yellow-300',
};

export function CardButton({ rank, onClick, size = 'md' }: CardButtonProps) {
  const sizeClasses = {
    sm: 'h-10 min-w-10 text-sm',
    md: 'h-12 min-w-12 text-base',
    lg: 'h-14 min-w-14 text-lg font-bold',
  };

  const colorClass = SUIT_COLORS[rank] ?? 'text-white';

  return (
    <button
      type="button"
      onClick={() => onClick(rank)}
      className={`${sizeClasses[size]} ${colorClass} rounded-lg border border-gray-600 bg-gray-800 px-2 font-semibold active:scale-95 active:bg-gray-700`}
    >
      {rank}
    </button>
  );
}
