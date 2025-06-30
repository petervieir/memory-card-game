import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGameCards, useNFTMetadata } from '@/lib/contract-service'
import { ReactNode } from 'react'

// Create a wrapper for React Query
function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Contract Service', () => {
  describe('useGameCards', () => {
    it('fetches game cards successfully', async () => {
      const tokenIds = [1, 2, 3, 4]
      const wrapper = createQueryWrapper()
      
      const { result } = renderHook(() => useGameCards(tokenIds), { wrapper })
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      
      expect(result.current.data).toHaveLength(4)
      expect(result.current.data?.[0]).toMatchObject({
        id: 0,
        tokenId: 1,
        imageUrl: expect.any(String),
        isFlipped: false,
        isMatched: false,
      })
    })

    it('handles empty token IDs array', () => {
      const wrapper = createQueryWrapper()
      
      const { result } = renderHook(() => useGameCards([]), { wrapper })
      
      // Query should not be enabled with empty array
      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('useNFTMetadata', () => {
    it('fetches NFT metadata successfully', async () => {
      const tokenId = 1
      const wrapper = createQueryWrapper()
      
      const { result } = renderHook(() => useNFTMetadata(tokenId), { wrapper })
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
      
      expect(result.current.data).toMatchObject({
        name: 'Test NFT',
        image: 'https://example.com/image.jpg',
        attributes: expect.arrayContaining([
          expect.objectContaining({
            trait_type: 'Rarity',
            value: 'Common',
          }),
        ]),
      })
    })

    it('handles invalid token ID', () => {
      const wrapper = createQueryWrapper()
      
      const { result } = renderHook(() => useNFTMetadata(0), { wrapper })
      
      // Query should not be enabled with falsy token ID
      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })
  })
}) 