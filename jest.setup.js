import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Stacks Connect
jest.mock('@stacks/connect-react', () => ({
  useConnect: () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    isConnected: false,
  }),
  useAccount: () => ({
    stxAddress: 'ST1234567890ABCDEF',
    network: { name: 'testnet' },
  }),
  useContract: () => ({
    openContractCall: jest.fn(),
  }),
  useOpenContract: () => ({
    data: null,
    isLoading: false,
  }),
  ConnectProvider: ({ children }) => children,
}))

// Mock Stacks Storage
jest.mock('@stacks/storage', () => ({
  getNFTMetadata: jest.fn().mockResolvedValue({
    name: 'Test NFT',
    image: 'https://example.com/image.jpg',
    attributes: [{ trait_type: 'Rarity', value: 'Common' }],
  }),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}) 