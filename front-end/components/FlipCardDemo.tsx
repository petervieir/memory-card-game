'use client'

import { useState } from 'react'
import FlipCard from './FlipCard'

// Types
interface CardData {
  id: number
  imageUrl: string
  isFlipped: boolean
  isMatched: boolean
}

// Static content
const sampleCards: CardData[] = [
  { id: 1, imageUrl: 'https://picsum.photos/200/300?random=1', isFlipped: false, isMatched: false },
  { id: 2, imageUrl: 'https://picsum.photos/200/300?random=2', isFlipped: false, isMatched: false },
  { id: 3, imageUrl: 'https://picsum.photos/200/300?random=3', isFlipped: false, isMatched: false },
  { id: 4, imageUrl: 'https://picsum.photos/200/300?random=4', isFlipped: false, isMatched: false },
]

// Main component
export default function FlipCardDemo() {
  const [cards, setCards] = useState<CardData[]>(sampleCards)

  // Event handlers
  const handleCardClick = (id: number) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id 
          ? { ...card, isFlipped: !card.isFlipped }
          : card
      )
    )
  }

  const handleReset = () => {
    setCards(sampleCards.map(card => ({ ...card, isFlipped: false, isMatched: false })))
  }

  // Render
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Flip Card Demo</h3>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reset Cards
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => (
          <FlipCard
            key={card.id}
            id={card.id}
            imageUrl={card.imageUrl}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={handleCardClick}
          />
        ))}
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Click cards to flip them. Matched cards will be dimmed.</p>
      </div>
    </div>
  )
} 