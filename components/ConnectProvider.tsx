'use client'

import { ReactNode } from 'react'

// Types
interface ConnectProviderProps {
  children: ReactNode
}

// Main component
export default function ConnectProvider({ children }: ConnectProviderProps) {
  return (
    <>
      {children}
    </>
  )
} 