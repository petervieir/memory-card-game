import { render, screen, fireEvent } from '@testing-library/react'
import FlipCard from '@/components/FlipCard'

// Mock data
const mockCard = {
  id: 1,
  imageUrl: 'https://example.com/card.jpg',
  isFlipped: false,
  isMatched: false,
  onClick: jest.fn(),
}

describe('FlipCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders question mark when not flipped', () => {
    render(<FlipCard {...mockCard} />)
    
    // Should show question mark icon
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })

  it('renders image when flipped', () => {
    render(<FlipCard {...mockCard} isFlipped={true} />)
    
    // Should show the card image
    const image = screen.getByAltText('Card 1')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/card.jpg')
  })

  it('calls onClick when clicked', () => {
    render(<FlipCard {...mockCard} />)
    
    const card = screen.getByRole('button')
    fireEvent.click(card)
    
    expect(mockCard.onClick).toHaveBeenCalledWith(1)
  })

  it('does not call onClick when matched', () => {
    render(<FlipCard {...mockCard} isMatched={true} />)
    
    const card = screen.getByRole('button')
    fireEvent.click(card)
    
    expect(mockCard.onClick).not.toHaveBeenCalled()
  })

  it('applies matched styles when isMatched is true', () => {
    render(<FlipCard {...mockCard} isMatched={true} />)
    const cardRoot = screen.getByTestId('flip-card-root')
    expect(cardRoot).toHaveClass('opacity-60')
  })

  it('applies flipped styles when isFlipped is true', () => {
    render(<FlipCard {...mockCard} isFlipped={true} />)
    const cardRoot = screen.getByTestId('flip-card-root')
    expect(cardRoot).toHaveClass('rotate-y-180')
  })
}) 