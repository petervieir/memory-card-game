'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'
import Image from 'next/image'

// Types
interface FlipCardProps {
  id: number
  imageUrl?: string
  isFlipped: boolean
  isMatched: boolean
  onClick: (id: number) => void
  disabled?: boolean
  className?: string
}

// Helper functions
function getCardStateClasses(isFlipped: boolean, isMatched: boolean): string {
  if (isMatched) return 'opacity-75'
  return ''
}

function shouldShowImage(isFlipped: boolean, isMatched: boolean): boolean {
  return isFlipped || isMatched
}

// Main component
export default function FlipCard({ 
  id, 
  imageUrl, 
  isFlipped, 
  isMatched, 
  onClick,
  disabled = false,
  className = '' 
}: FlipCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  
  // Debug logging
  const shouldShow = shouldShowImage(isFlipped, isMatched)
  console.log(`Card ${id}: isFlipped=${isFlipped}, isMatched=${isMatched}, shouldShow=${shouldShow}`)

  // Event handlers
  const handleClick = () => {
    if (!isMatched && !isFlipped && !disabled) {
      onClick(id)
    }
  }

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  // Render states
  return (
    <button
      type="button"
      aria-label={`Flip card ${id}`}
      className={`${className} ${isMatched || disabled ? 'cursor-default' : 'cursor-pointer'} ${disabled ? 'opacity-60' : ''}`}
      onClick={handleClick}
      disabled={isMatched || disabled}
      data-testid="flip-card-btn"
    >
      <Card 
        className={`
          relative w-full aspect-[3/4] transition-all duration-500 p-0
          ${!isMatched && !disabled ? 'hover:scale-105 active:scale-95' : ''}
          ${getCardStateClasses(isFlipped, isMatched)}
        `}
        tabIndex={-1}
        data-testid="flip-card-root"
      >
        {/* Front side - Question mark */}
        <CardContent className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-0 transition-opacity duration-500 ${shouldShow ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <HelpCircle className="w-12 h-12 text-white" aria-hidden />
        </CardContent>

        {/* Back side - Image */}
        <CardContent className={`absolute inset-0 bg-white rounded-lg overflow-hidden p-0 transition-opacity duration-500 ${shouldShow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {imageUrl ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={`Card ${id}`}
                fill={true}
                className="object-cover rounded-lg"
                onLoad={handleImageLoad}
                style={{ opacity: isImageLoaded ? 1 : 0 }}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          )}
        </CardContent>
      </Card>
    </button>
  )
} 