import { render, screen } from '@testing-library/react'
import GameScore from '@/components/GameScore'

// Mock data
const mockProps = {
  moves: 10,
  matches: 5,
  timer: 125, // 2:05
  stats: {
    totalGames: 15,
    bestScore: 95,
    averageMoves: 12,
    totalMatches: 75,
  },
}

describe('GameScore', () => {
  it('renders all score metrics', () => {
    render(<GameScore {...mockProps} />)
    
    expect(screen.getByText('10')).toBeInTheDocument() // moves
    expect(screen.getByText('5')).toBeInTheDocument() // matches
    expect(screen.getByText('02:05')).toBeInTheDocument() // timer
    expect(screen.getByText('50')).toBeInTheDocument() // score (5*100/10)
  })

  it('renders game stats when provided', () => {
    render(<GameScore {...mockProps} />)
    
    expect(screen.getByText('15')).toBeInTheDocument() // total games
    expect(screen.getByText('95')).toBeInTheDocument() // best score
    expect(screen.getByText('12')).toBeInTheDocument() // average moves
  })

  it('does not render stats when not provided', () => {
    const { stats, ...propsWithoutStats } = mockProps
    render(<GameScore {...propsWithoutStats} />)
    
    expect(screen.queryByText('Game Stats')).not.toBeInTheDocument()
  })

  it('calculates score correctly', () => {
    render(<GameScore moves={20} matches={10} timer={0} />)
    
    // Score should be (10 * 100) / 20 = 50
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('handles zero matches', () => {
    render(<GameScore moves={5} matches={0} timer={0} />)
    // There are two 0s: one for matches, one for score. Check the Score label's sibling.
    const scoreLabel = screen.getByText('Score')
    const scoreValue = scoreLabel.parentElement?.nextElementSibling
    expect(scoreValue?.textContent).toBe('0')
  })

  it('formats time correctly', () => {
    render(<GameScore moves={0} matches={0} timer={3661} />) // 1:01:01
    
    expect(screen.getByText('61:01')).toBeInTheDocument()
  })
}) 