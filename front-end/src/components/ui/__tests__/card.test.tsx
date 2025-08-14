import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    test('renders with default classes', () => {
      render(<Card data-testid="card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow')
    })

    test('accepts custom className', () => {
      render(<Card data-testid="card" className="custom-class">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('rounded-xl') // Still has default classes
    })

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card ref={ref}>Card content</Card>)
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    test('accepts additional props', () => {
      render(<Card data-testid="card" aria-label="Test card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('aria-label', 'Test card')
    })
  })

  describe('CardHeader', () => {
    test('renders with default classes', () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>)
      
      const header = screen.getByTestId('card-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    test('accepts custom className', () => {
      render(<CardHeader data-testid="card-header" className="custom-header">Header content</CardHeader>)
      
      const header = screen.getByTestId('card-header')
      expect(header).toHaveClass('custom-header')
      expect(header).toHaveClass('flex') // Still has default classes
    })
  })

  describe('CardTitle', () => {
    test('renders as h3 element with default classes', () => {
      render(<CardTitle>Test Title</CardTitle>)
      
      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Test Title')
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight')
    })

    test('accepts custom className', () => {
      render(<CardTitle className="custom-title">Test Title</CardTitle>)
      
      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toHaveClass('custom-title')
      expect(title).toHaveClass('font-semibold') // Still has default classes
    })

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<CardTitle ref={ref}>Test Title</CardTitle>)
      
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
      expect(ref.current?.tagName).toBe('H3')
    })
  })

  describe('CardDescription', () => {
    test('renders as p element with default classes', () => {
      render(<CardDescription>Test description</CardDescription>)
      
      const description = screen.getByText('Test description')
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })

    test('accepts custom className', () => {
      render(<CardDescription className="custom-desc">Test description</CardDescription>)
      
      const description = screen.getByText('Test description')
      expect(description).toHaveClass('custom-desc')
      expect(description).toHaveClass('text-sm') // Still has default classes
    })
  })

  describe('CardContent', () => {
    test('renders with default classes', () => {
      render(<CardContent data-testid="card-content">Content here</CardContent>)
      
      const content = screen.getByTestId('card-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('p-6', 'pt-0')
    })

    test('accepts custom className', () => {
      render(<CardContent data-testid="card-content" className="custom-content">Content here</CardContent>)
      
      const content = screen.getByTestId('card-content')
      expect(content).toHaveClass('custom-content')
      expect(content).toHaveClass('p-6') // Still has default classes
    })
  })

  describe('CardFooter', () => {
    test('renders with default classes', () => {
      render(<CardFooter data-testid="card-footer">Footer content</CardFooter>)
      
      const footer = screen.getByTestId('card-footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })

    test('accepts custom className', () => {
      render(<CardFooter data-testid="card-footer" className="custom-footer">Footer content</CardFooter>)
      
      const footer = screen.getByTestId('card-footer')
      expect(footer).toHaveClass('custom-footer')
      expect(footer).toHaveClass('flex') // Still has default classes
    })
  })

  describe('Card composition', () => {
    test('renders complete card structure', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument()
      expect(screen.getByText('Card description goes here')).toBeInTheDocument()
      expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })
  })
})