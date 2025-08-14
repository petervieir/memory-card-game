import * as UIComponents from '../index'

describe('UI Components Index', () => {
  test('exports Button and buttonVariants', () => {
    expect(UIComponents.Button).toBeDefined()
    expect(UIComponents.buttonVariants).toBeDefined()
    expect(typeof UIComponents.Button).toBe('object') // React component
    expect(typeof UIComponents.buttonVariants).toBe('function') // cva function
  })

  test('exports all Card components', () => {
    expect(UIComponents.Card).toBeDefined()
    expect(UIComponents.CardHeader).toBeDefined()
    expect(UIComponents.CardTitle).toBeDefined()
    expect(UIComponents.CardDescription).toBeDefined()
    expect(UIComponents.CardContent).toBeDefined()
    expect(UIComponents.CardFooter).toBeDefined()
    
    // Verify they are React components (objects)
    expect(typeof UIComponents.Card).toBe('object')
    expect(typeof UIComponents.CardHeader).toBe('object')
    expect(typeof UIComponents.CardTitle).toBe('object')
    expect(typeof UIComponents.CardDescription).toBe('object')
    expect(typeof UIComponents.CardContent).toBe('object')
    expect(typeof UIComponents.CardFooter).toBe('object')
  })

  test('exports correct number of components', () => {
    const exportedKeys = Object.keys(UIComponents)
    expect(exportedKeys).toHaveLength(8) // Button, buttonVariants, + 6 Card components
  })

  test('all exports are truthy (not undefined)', () => {
    Object.values(UIComponents).forEach(exportedValue => {
      expect(exportedValue).toBeTruthy()
    })
  })
})