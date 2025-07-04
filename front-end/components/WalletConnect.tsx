'use client'

import { useState, useEffect } from 'react'
import { AppConfig, UserSession, showConnect, UserData } from '@stacks/connect'
import { Wallet, Network, User } from 'lucide-react'

// Types
interface WalletConnectProps {
  className?: string
}

// Configuration
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

// Helper functions
function truncateAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getNetworkName(isMainnet: boolean): string {
  return isMainnet ? 'Mainnet' : 'Testnet'
}

// Main component
export default function WalletConnect({ className = '' }: WalletConnectProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check authentication state
  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
      })
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData())
    }
  }, [])

  // Event handlers
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      showConnect({
        appDetails: {
          name: 'Memory Card Game',
          icon: '/favicon.ico',
        },
        redirectTo: '/',
        onFinish: () => {
          setIsConnecting(false)
          setUserData(userSession.loadUserData())
        },
        onCancel: () => {
          setIsConnecting(false)
        },
        userSession,
      })
    } catch (error) {
      console.error('Connection failed:', error)
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    userSession.signUserOut()
    setUserData(null)
  }

  // Render states
  if (userData) {
    const stxAddress = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet
    const isMainnet = !!userData.profile?.stxAddress?.mainnet
    
    return (
      <div className={`flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <Network className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-700">
          {getNetworkName(isMainnet)}
        </span>
        
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-mono text-gray-700">
            {truncateAddress(stxAddress || '')}
          </span>
        </div>
        
        <button
          onClick={handleDisconnect}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? 'Connecting...' : 'Connect Hiro Wallet'}
    </button>
  )
} 