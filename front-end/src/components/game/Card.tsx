"use client";

function getCardClassName(isMatched: boolean, isFlipped: boolean): string {
  let baseClass = 'relative w-24 h-32 rounded-lg transition-all duration-300 transform disabled:cursor-not-allowed ';
  
  if (isMatched) {
    baseClass += 'bg-green-500/20 border-2 border-green-500 scale-95';
  } else if (isFlipped) {
    baseClass += 'bg-blue-500/20 border-2 border-blue-500';
  } else {
    baseClass += 'bg-gray-500/20 border-2 border-gray-400 hover:border-gray-300 hover:scale-105';
  }
  
  return baseClass;
}

interface CardProps {
  readonly imageSrc: string;
  readonly isFlipped: boolean;
  readonly isMatched: boolean;
  readonly onClick: () => void;
}

export function Card({ imageSrc, isFlipped, isMatched, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isFlipped || isMatched}
      className={getCardClassName(isMatched, isFlipped)}
    >
      <div className="flex items-center justify-center h-full overflow-hidden rounded-lg">
        {isFlipped || isMatched ? (
          <img 
            src={imageSrc} 
            alt="Memory card" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-2xl">❓</div>
        )}
      </div>
    </button>
  );
}
