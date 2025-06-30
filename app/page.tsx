'use client'

import { useState } from 'react'
import { Gamepad2, Trophy, Palette, Coins, Users } from 'lucide-react'
import WalletConnect from "@/components/WalletConnect"
import MemoryGame from "@/components/MemoryGame"
import { AchievementShowcase } from "@/components/AchievementBadge"
import { EntryFeePanel } from "@/components/EntryFeePanel"
import { GenesisCardMinter } from "@/components/GenesisCardMinter"
import Leaderboard from "@/components/Leaderboard"
import MyStats from "@/components/MyStats"
import { usePlayerAchievements } from "@/lib/contract-service"

type Tab = 'game' | 'achievements' | 'leaderboard' | 'mint' | 'entry' | 'stats'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('game')
  
  const { data: playerAchievements } = usePlayerAchievements()

  const tabs = [
    { id: 'game' as Tab, label: 'Game', icon: Gamepad2 },
    { id: 'achievements' as Tab, label: 'Achievements', icon: Trophy },
    { id: 'leaderboard' as Tab, label: 'Leaderboard', icon: Users },
    { id: 'stats' as Tab, label: 'My Stats', icon: Trophy },
    { id: 'mint' as Tab, label: 'Mint Cards', icon: Palette },
    { id: 'entry' as Tab, label: 'Entry Fee', icon: Coins },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'game':
        return <MemoryGame />
      case 'achievements':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Achievement System</h2>
              <p className="text-gray-600">
                Unlock special badge NFTs by completing challenges!
              </p>
            </div>
            <AchievementShowcase playerAchievements={playerAchievements || undefined} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <h3 className="font-semibold text-gray-800 mb-2">⚡ Speed Demon</h3>
                <p className="text-sm text-gray-600">
                  Complete any game in under 60 seconds to earn this rare badge NFT
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <h3 className="font-semibold text-gray-800 mb-2">🏆 Flawless Victory</h3>
                <p className="text-sm text-gray-600">
                  Complete a game without any mismatches for this legendary badge
                </p>
              </div>
              
              <div className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Win Streak Master</h3>
                <p className="text-sm text-gray-600">
                  Win 10 games in a row to unlock this ultimate achievement
                </p>
              </div>
            </div>
          </div>
        )
      case 'leaderboard':
        return <Leaderboard />
      case 'stats':
        return <MyStats />
      case 'mint':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Genesis Card Collection</h2>
              <p className="text-gray-600">
                Create and mint unique artwork cards for your personal collection
              </p>
            </div>
            <GenesisCardMinter />
          </div>
        )
      case 'entry':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tokenized Entry & Rewards</h2>
              <p className="text-gray-600">
                Pay entry fees in STX and compete for the prize pool
              </p>
            </div>
            <EntryFeePanel />
          </div>
        )
      default:
        return <MemoryGame />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Memory Card Game</h1>
            <p className="text-gray-600 mt-1">Enhanced blockchain gaming experience</p>
          </div>
          <WalletConnect />
        </header>

        {/* Navigation Tabs */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2 p-1 bg-white rounded-lg shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Main content */}
        <main>
          <div className="bg-white rounded-lg shadow-lg p-4 lg:p-8">
            {renderTabContent()}
          </div>
        </main>

        {/* Enhanced Info Section */}
        {activeTab === 'game' && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Enhanced Blockchain Features
              </h2>
              <p className="text-gray-600 mb-6">
                Experience the next generation of blockchain gaming with advanced features
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                  <h3 className="font-semibold text-gray-800 mb-2">🏆 Achievement NFTs</h3>
                  <p className="text-sm text-gray-600">
                    Earn unique badge NFTs for hitting milestones and challenges
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-2">💰 Tokenized Entry</h3>
                  <p className="text-sm text-gray-600">
                    Optional STX entry fees with prize pools for winners
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                  <h3 className="font-semibold text-gray-800 mb-2">🔒 Verifiable Shuffle</h3>
                  <p className="text-sm text-gray-600">
                    Provably fair gameplay with commit-reveal randomness
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100">
                  <h3 className="font-semibold text-gray-800 mb-2">🎨 Genesis Cards</h3>
                  <p className="text-sm text-gray-600">
                    Mint custom artwork cards for your personal collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
