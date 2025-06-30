import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AppConfig, UserSession, openContractCall } from '@stacks/connect'
import { STACKS_TESTNET } from '@stacks/network'
import { stringUtf8CV, uintCV, bufferCV, stringAsciiCV } from '@stacks/transactions'
import { GameCard, NFTMetadata, GameState, PlayerStats, LeaderboardEntry, GameResult, GaiaGameHistory, DifficultyLevel } from './game-types'

// Configuration
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })
const network = STACKS_TESTNET

// Contract address (replace with actual deployed contract)
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
const CONTRACT_NAME = 'memory-game'

// API functions
async function fetchNFTMetadata(tokenId: number): Promise<NFTMetadata> {
  try {
    // For demo purposes, generate mock metadata
    // In production, this would fetch from Gaia storage
    return {
      name: `Memory Card ${tokenId}`,
      image: `https://picsum.photos/200/300?random=${tokenId}`,
      attributes: [
        { trait_type: 'Rarity', value: tokenId % 2 === 0 ? 'Common' : 'Rare' },
        { trait_type: 'Token ID', value: tokenId.toString() },
        { trait_type: 'Color', value: ['Red', 'Blue', 'Green', 'Yellow'][tokenId % 4] }
      ]
    }
  } catch (error) {
    console.error('Failed to fetch NFT metadata:', error)
    // Fallback metadata
    return {
      name: `Card ${tokenId}`,
      image: `https://picsum.photos/200/300?random=${tokenId}`,
      attributes: [
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Token ID', value: tokenId.toString() }
      ]
    }
  }
}

async function fetchGameCards(tokenIds: number[]): Promise<GameCard[]> {
  const cards: GameCard[] = []
  
  for (let i = 0; i < tokenIds.length; i++) {
    const tokenId = tokenIds[i]
    const metadata = await fetchNFTMetadata(tokenId)
    
    cards.push({
      id: i,
      tokenId,
      imageUrl: metadata.image,
      isFlipped: false,
      isMatched: false,
      metadata
    })
  }
  
  return cards
}

// Helper to get current user address
function getCurrentUserAddress(): string | null {
  if (userSession.isUserSignedIn()) {
    const userData = userSession.loadUserData()
    return userData.profile?.stxAddress?.testnet || userData.profile?.stxAddress?.mainnet || null
  }
  return null
}

// React Query hooks
export function useGameCards(tokenIds: number[]) {
  return useQuery({
    queryKey: ['gameCards', tokenIds],
    queryFn: () => fetchGameCards(tokenIds),
    enabled: tokenIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useNFTMetadata(tokenId: number) {
  return useQuery({
    queryKey: ['nftMetadata', tokenId],
    queryFn: () => fetchNFTMetadata(tokenId),
    enabled: !!tokenId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Contract hooks
export function useGameState() {
  const stxAddress = getCurrentUserAddress()
  
  return useQuery({
    queryKey: ['gameState', stxAddress],
    queryFn: async (): Promise<GameState> => {
      // For demo purposes, return mock game state
      // In production, this would query the contract
      return {
        cards: [],
        moves: 0,
        matches: 0,
        timer: 0,
        isPlaying: false,
        isPaused: false,
        flippedCards: [],
        gameStarted: false,
        difficulty: 'easy'
      }
    },
    enabled: !!stxAddress,
  })
}

// Contract mutations
export function useStartGame() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (gameUri: string) => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'start-game',
        functionArgs: [stringUtf8CV(gameUri)],
        postConditions: [],
        onFinish: (data) => {
          console.log('Game started:', data)
        },
        onCancel: () => {
          console.log('Start game cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] })
    }
  })
}

export function useFlipCard() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (cardId: number) => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'flip-card-game',
        functionArgs: [uintCV(cardId)],
        postConditions: [],
        onFinish: (data) => {
          console.log('Card flipped:', data)
        },
        onCancel: () => {
          console.log('Flip card cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] })
    }
  })
}

export function useCheckMatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'check-match',
        functionArgs: [],
        postConditions: [],
        onFinish: (data) => {
          console.log('Match checked:', data)
        },
        onCancel: () => {
          console.log('Check match cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] })
    }
  })
}

export function useResetGame() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'reset-game',
        functionArgs: [],
        postConditions: [],
        onFinish: (data) => {
          console.log('Game reset:', data)
        },
        onCancel: () => {
          console.log('Reset game cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] })
    }
  })
}

// NEW: Player stats and leaderboard hooks
export function usePlayerStats(playerAddress?: string) {
  const currentAddress = getCurrentUserAddress()
  const targetAddress = playerAddress || currentAddress
  
  return useQuery({
    queryKey: ['playerStats', targetAddress],
    queryFn: async (): Promise<PlayerStats | null> => {
      if (!targetAddress) return null
      
      // For demo purposes, return mock stats
      // In production, this would query the contract's get-player-stats function
      return {
        bestMoves: 12,
        bestTime: 45,
        totalGames: 5,
        totalWins: 3
      }
    },
    enabled: !!targetAddress,
  })
}

export function useLeaderboard(playerAddresses: string[]) {
  return useQuery({
    queryKey: ['leaderboard', playerAddresses],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      // For demo purposes, return mock leaderboard data
      // In production, this would call get-leaderboard-entry for each player
      const mockEntries: LeaderboardEntry[] = [
        {
          player: 'ST1PLAYER1...',
          bestMoves: 8,
          bestTime: 32,
          totalGames: 12,
          totalWins: 10
        },
        {
          player: 'ST2PLAYER2...',
          bestMoves: 10,
          bestTime: 28,
          totalGames: 8,
          totalWins: 6
        },
        {
          player: 'ST3PLAYER3...',
          bestMoves: 12,
          bestTime: 45,
          totalGames: 5,
          totalWins: 3
        }
      ]
      
      // Sort by best moves (ascending), then by best time
      return mockEntries.sort((a, b) => {
        if (a.bestMoves !== b.bestMoves) {
          return a.bestMoves - b.bestMoves
        }
        return a.bestTime - b.bestTime
      })
    },
    enabled: playerAddresses.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useCompleteGame() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ moves, timeSeconds, difficulty }: { moves: number; timeSeconds: number; difficulty?: DifficultyLevel }) => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      // Save to Gaia storage first
      await saveGameToGaia({ moves, timeSeconds, completed: true, difficulty: difficulty || 'easy' })
      
      // Then call contract to update stats
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'complete-game',
        functionArgs: [uintCV(moves), uintCV(timeSeconds)],
        postConditions: [],
        onFinish: (data) => {
          console.log('Game completed:', data)
        },
        onCancel: () => {
          console.log('Complete game cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerStats'] })
      queryClient.invalidateQueries({ queryKey: ['gameHistory'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    }
  })
}

// Gaia Storage Functions
async function saveGameToGaia({ moves, timeSeconds, completed, difficulty }: { moves: number; timeSeconds: number; completed: boolean; difficulty: DifficultyLevel }) {
  try {
    const stxAddress = getCurrentUserAddress()
    if (!stxAddress) throw new Error('User not connected')
    
    // Calculate score (lower is better: moves * 10 + time in seconds)
    const score = moves * 10 + timeSeconds
    
    const gameResult: GameResult = {
      id: Date.now().toString(),
      moves,
      timeSeconds,
      completed,
      timestamp: Date.now(),
      score,
      difficulty
    }
    
    // Get existing history
    const existingHistory = await getGameHistoryFromGaia()
    
    // Add new result and keep only last 10
    const newResults = [gameResult, ...existingHistory.results].slice(0, 10)
    
    // Calculate new stats
    const completedGames = newResults.filter(g => g.completed)
    const newHistory: GaiaGameHistory = {
      results: newResults,
      totalGames: newResults.length,
      bestMoves: completedGames.length > 0 ? Math.min(...completedGames.map(g => g.moves)) : 0,
      bestTime: completedGames.length > 0 ? Math.min(...completedGames.map(g => g.timeSeconds)) : 0,
      averageMoves: completedGames.length > 0 ? Math.round(completedGames.reduce((sum, g) => sum + g.moves, 0) / completedGames.length) : 0
    }
    
    // In a real implementation, this would use Gaia storage
    // For now, we'll use localStorage as a placeholder
    localStorage.setItem(`gameHistory_${stxAddress}`, JSON.stringify(newHistory))
    
    return newHistory
  } catch (error) {
    console.error('Failed to save game to Gaia:', error)
    throw error
  }
}

async function getGameHistoryFromGaia(): Promise<GaiaGameHistory> {
  try {
    const stxAddress = getCurrentUserAddress()
    if (!stxAddress) throw new Error('User not connected')
    
    // In a real implementation, this would fetch from Gaia storage
    // For now, we'll use localStorage as a placeholder
    const stored = localStorage.getItem(`gameHistory_${stxAddress}`)
    
    if (stored) {
      return JSON.parse(stored)
    }
    
    return {
      results: [],
      totalGames: 0,
      bestMoves: 0,
      bestTime: 0,
      averageMoves: 0
    }
  } catch (error) {
    console.error('Failed to get game history from Gaia:', error)
    return {
      results: [],
      totalGames: 0,
      bestMoves: 0,
      bestTime: 0,
      averageMoves: 0
    }
  }
}

export function useGameHistory() {
  const stxAddress = getCurrentUserAddress()
  
  return useQuery({
    queryKey: ['gameHistory', stxAddress],
    queryFn: () => getGameHistoryFromGaia(),
    enabled: !!stxAddress,
    staleTime: 30 * 1000, // 30 seconds
  })
} 

// ==============================
// ENHANCED BLOCKCHAIN FEATURES
// ==============================

// Achievement hooks
export function usePlayerAchievements(playerAddress?: string) {
  const stxAddress = playerAddress || getCurrentUserAddress()
  
  return useQuery({
    queryKey: ['playerAchievements', stxAddress],
    queryFn: async () => {
      if (!stxAddress) return null
      
      // In production, this would query the contract
      // For demo, return mock data
      return {
        'sub-60s': false,
        'flawless': false,
        'streak-10': false
      }
    },
    enabled: !!stxAddress,
    staleTime: 5 * 60 * 1000,
  })
}

// Entry fee system
export function useEntryFeeStatus() {
  const stxAddress = getCurrentUserAddress()
  
  return useQuery({
    queryKey: ['entryFeeStatus', stxAddress],
    queryFn: async () => {
      if (!stxAddress) return null
      
      // In production, query contract for entry fee status
      return {
        feeRequired: 0, // in micro-STX
        hasPaid: false,
        prizePool: 0
      }
    },
    enabled: !!stxAddress,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Enhanced game start with entry fee and shuffle commitment
export function useStartGameEnhanced() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ gameUri, shuffleCommit }: { gameUri: string; shuffleCommit: string }) => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      // Convert shuffle commitment to buff 32
      const commitBuffer = new TextEncoder().encode(shuffleCommit.slice(0, 32).padEnd(32, '0'))
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'start-game-with-entry',
        functionArgs: [
          stringUtf8CV(gameUri),
          bufferCV(commitBuffer)
        ],
        postConditions: [],
        onFinish: (data) => {
          console.log('Enhanced game started:', data)
        },
        onCancel: () => {
          console.log('Enhanced start game cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] })
      queryClient.invalidateQueries({ queryKey: ['entryFeeStatus'] })
    }
  })
}

// Enhanced game completion
export function useCompleteGameEnhanced() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      moves, 
      timeSeconds, 
      shuffleReveal 
    }: { 
      moves: number; 
      timeSeconds: number; 
      shuffleReveal: string 
    }) => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'complete-game-enhanced',
        functionArgs: [
          uintCV(moves),
          uintCV(timeSeconds),
          stringUtf8CV(shuffleReveal)
        ],
        postConditions: [],
        onFinish: (data) => {
          console.log('Enhanced game completed:', data)
        },
        onCancel: () => {
          console.log('Enhanced complete game cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] })
      queryClient.invalidateQueries({ queryKey: ['playerStats'] })
      queryClient.invalidateQueries({ queryKey: ['playerAchievements'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    }
  })
}

// Genesis card minting
export function useMintGenesisCard() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ uri, cardName }: { uri: string; cardName: string }) => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'mint-genesis-card',
        functionArgs: [
          stringUtf8CV(uri),
          stringAsciiCV(cardName)
        ],
        postConditions: [],
        onFinish: (data) => {
          console.log('Genesis card minted:', data)
        },
        onCancel: () => {
          console.log('Mint genesis card cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameCards'] })
    }
  })
}

// Set entry fee (admin only)
export function useSetEntryFee() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (fee: number) => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'set-entry-fee',
        functionArgs: [uintCV(fee)],
        postConditions: [],
        onFinish: (data) => {
          console.log('Entry fee set:', data)
        },
        onCancel: () => {
          console.log('Set entry fee cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entryFeeStatus'] })
    }
  })
}

// Enhanced match checking
export function useCheckMatchEnhanced() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const stxAddress = getCurrentUserAddress()
      if (!stxAddress) throw new Error('User not connected')
      
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'check-match-enhanced',
        functionArgs: [],
        postConditions: [],
        onFinish: (data) => {
          console.log('Enhanced match checked:', data)
        },
        onCancel: () => {
          console.log('Enhanced check match cancelled')
        }
      })
      
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] })
    }
  })
}