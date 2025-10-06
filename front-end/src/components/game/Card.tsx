"use client";

function getCardClassName(isMatched: boolean, isFlipped: boolean, sizeClass: string): string {
  let baseClass = `relative ${sizeClass} rounded-lg transition-all duration-300 transform disabled:cursor-not-allowed `;
  
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
  readonly sizeClass?: string;
}

export function Card({ imageSrc, isFlipped, isMatched, onClick, sizeClass = 'w-20 h-24' }: CardProps) {
  // Determine icon size based on card size
  const getIconSize = () => {
    if (sizeClass.includes('w-32') || sizeClass.includes('w-36')) return 'text-4xl';
    if (sizeClass.includes('w-28')) return 'text-3xl';
    if (sizeClass.includes('w-24')) return 'text-2xl';
    if (sizeClass.includes('w-20')) return 'text-xl';
    return 'text-lg';
  };

  return (
    <button
      onClick={onClick}
      disabled={isFlipped || isMatched}
      className={getCardClassName(isMatched, isFlipped, sizeClass)}
    >
      <div className="flex items-center justify-center h-full overflow-hidden rounded-lg">
        {isFlipped || isMatched ? (
          <img 
            src={imageSrc} 
            alt="Memory card" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={getIconSize()}>❓</div>
        )}
      </div>
    </button>
  );
}
