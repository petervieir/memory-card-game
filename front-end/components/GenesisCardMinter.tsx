'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Palette, Sparkles, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useMintGenesisCard } from '@/lib/contract-service'

interface GenesisCardMinterProps {
  onCardMinted?: (tokenId: number) => void
}

export function GenesisCardMinter({ onCardMinted }: GenesisCardMinterProps) {
  const [cardName, setCardName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  const mintGenesisCard = useMintGenesisCard()

  // Pre-designed card templates
  const cardTemplates = [
    {
      id: 'mystical',
      name: 'Mystical Crystal',
      image: 'https://picsum.photos/200/300?random=mystical',
      description: 'A shimmering crystal with otherworldly powers'
    },
    {
      id: 'dragon',
      name: 'Ancient Dragon',
      image: 'https://picsum.photos/200/300?random=dragon',
      description: 'A mighty dragon from the age of legends'
    },
    {
      id: 'forest',
      name: 'Enchanted Forest',
      image: 'https://picsum.photos/200/300?random=forest',
      description: 'A magical forest where time stands still'
    },
    {
      id: 'phoenix',
      name: 'Phoenix Rising',
      image: 'https://picsum.photos/200/300?random=phoenix',
      description: 'A phoenix reborn from sacred flames'
    },
    {
      id: 'ocean',
      name: 'Deep Ocean Depths',
      image: 'https://picsum.photos/200/300?random=ocean',
      description: 'Mysteries hidden in the deepest waters'
    },
    {
      id: 'galaxy',
      name: 'Cosmic Galaxy',
      image: 'https://picsum.photos/200/300?random=galaxy',
      description: 'A swirling galaxy of infinite possibilities'
    }
  ]

  const handleMintCard = async () => {
    if (!cardName.trim()) return

    let finalImageUrl = imageUrl
    let finalCardName = cardName

    // If using template, use template data
    if (selectedTemplate) {
      const template = cardTemplates.find(t => t.id === selectedTemplate)
      if (template) {
        finalImageUrl = template.image
        finalCardName = template.name
      }
    }

    if (!finalImageUrl) {
      finalImageUrl = `https://picsum.photos/200/300?random=${Date.now()}`
    }

    try {
      // Create metadata URI (in real app, this would be uploaded to IPFS/Gaia)
      const metadata = {
        name: finalCardName,
        description: `Genesis Memory Card: ${finalCardName}`,
        image: finalImageUrl,
        attributes: [
          { trait_type: 'Type', value: 'Genesis Card' },
          { trait_type: 'Rarity', value: 'Legendary' },
          { trait_type: 'Creator', value: 'Player' },
          { trait_type: 'Minted', value: new Date().toISOString() }
        ]
      }

      const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`

      await mintGenesisCard.mutateAsync({
        uri: metadataUri,
        cardName: finalCardName.slice(0, 50) // Max 50 chars for string-ascii
      })

      // Reset form
      setCardName('')
      setImageUrl('')
      setSelectedTemplate(null)
      
      onCardMinted?.(Date.now()) // Mock token ID
    } catch (error) {
      console.error('Failed to mint genesis card:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Mint Genesis Card
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create unique artwork cards for your personal collection
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Card Templates */}
          <div>
            <h3 className="text-sm font-medium mb-3">Choose a Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cardTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setCardName(template.name)
                  }}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                    ${selectedTemplate === template.id 
                      ? 'border-purple-500 ring-2 ring-purple-200' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="aspect-[3/4] relative">
                    <Image 
                      src={template.image} 
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-white text-xs font-medium truncate">
                          {template.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Card Form */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium mb-3">Or Create Custom</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Enter card name..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={50}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {cardName.length}/50 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value)
                    setSelectedTemplate(null) // Clear template selection
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Leave empty for random generated image
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {(cardName || selectedTemplate) && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium mb-3">Preview</h3>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-16 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="font-medium">{cardName || 'Unnamed Card'}</div>
                  <div className="text-sm text-gray-600">Genesis Collection</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600">Legendary</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mint Button */}
          <button
            onClick={handleMintCard}
            disabled={!cardName.trim() || mintGenesisCard.isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 
                     rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                     flex items-center justify-center gap-2"
          >
            {mintGenesisCard.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Minting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Mint Genesis Card
              </>
            )}
          </button>

          <div className="text-xs text-gray-500 text-center">
            Genesis cards are NFTs stored on the Stacks blockchain.
            <br />
            You can use them in your memory game collection.
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 