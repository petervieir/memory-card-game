import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConnectWallet } from '../ConnectWallet'
import { useWallet } from '@/contexts/WalletContext'
import { showConnect } from '@stacks/connect'
import toast from 'react-hot-toast'

// Mock dependencies
jest.mock('@/contexts/WalletContext')
jest.mock('@stacks/connect')
jest.mock('react-hot-toast')

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>
const mockShowConnect = showConnect as jest.MockedFunction<typeof showConnect>
const mockToast = toast as jest.MockedFunction<typeof toast>

// Mock UserSession
const mockUserSession = {
  signUserOut: jest.fn(),
  isUserSignedIn: jest.fn(),
  loadUserData: jest.fn(),
}

describe('ConnectWallet Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when wallet is not connected', () => {
    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: null,
        userSession: mockUserSession as any,
        refresh: jest.fn(),
      })
    })

    test('renders Connect Wallet button', () => {
      render(<ConnectWallet />)
      
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /connect wallet/i })).toBeInTheDocument()
      expect(screen.getByText('Connect your wallet to get started.')).toBeInTheDocument()
    })

    test('calls showConnect when Connect Wallet button is clicked', () => {
      const mockRefresh = jest.fn()
      mockUseWallet.mockReturnValue({
        address: null,
        userSession: mockUserSession as any,
        refresh: mockRefresh,
      })

      render(<ConnectWallet />)
      
      const connectButton = screen.getByRole('button', { name: /connect wallet/i })
      fireEvent.click(connectButton)

      expect(mockShowConnect).toHaveBeenCalledWith({
        appDetails: {
          name: "Stacks dApp Template (Next.js)",
          icon: expect.stringContaining("/icon.png"),
        },
        userSession: mockUserSession,
        onFinish: expect.any(Function),
        onCancel: expect.any(Function),
      })
    })

    test('handles successful wallet connection', () => {
      const mockRefresh = jest.fn()
      mockUseWallet.mockReturnValue({
        address: null,
        userSession: mockUserSession as any,
        refresh: mockRefresh,
      })

      render(<ConnectWallet />)
      
      const connectButton = screen.getByRole('button', { name: /connect wallet/i })
      fireEvent.click(connectButton)

      // Get the onFinish callback and call it
      const connectCall = mockShowConnect.mock.calls[0]?.[0]
      if (connectCall?.onFinish) {
        connectCall.onFinish({} as any)
      }

      expect(mockRefresh).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalledWith("Wallet connected!")
    })

    test('handles cancelled wallet connection', () => {
      render(<ConnectWallet />)
      
      const connectButton = screen.getByRole('button', { name: /connect wallet/i })
      fireEvent.click(connectButton)

      // Get the onCancel callback and call it
      const connectCall = mockShowConnect.mock.calls[0]?.[0]
      if (connectCall?.onCancel) {
        connectCall.onCancel()
      }

      expect(mockToast).toHaveBeenCalledWith("Connection cancelled.")
    })
  })

  describe('when wallet is connected', () => {
    const mockAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'

    beforeEach(() => {
      mockUseWallet.mockReturnValue({
        address: mockAddress,
        userSession: mockUserSession as any,
        refresh: jest.fn(),
      })
    })

    test('renders connected wallet interface', () => {
      render(<ConnectWallet />)
      
      expect(screen.getByText('Wallet Connected')).toBeInTheDocument()
      expect(screen.getByText('You are connected to Stacks.')).toBeInTheDocument()
      expect(screen.getByText('ST1PQH...TPGZGM')).toBeInTheDocument() // Truncated address
    })

    test('copies address to clipboard when copy button is clicked', async () => {
      render(<ConnectWallet />)
      
      const copyButton = screen.getByTitle('Copy address')
      fireEvent.click(copyButton)

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockAddress)
      
      // Check if button title changes to "Copied!"
      await waitFor(() => {
        expect(screen.getByTitle('Copied!')).toBeInTheDocument()
      })
    })

    test('disconnects wallet when disconnect button is clicked', () => {
      const mockRefresh = jest.fn()
      mockUseWallet.mockReturnValue({
        address: mockAddress,
        userSession: mockUserSession as any,
        refresh: mockRefresh,
      })

      render(<ConnectWallet />)
      
      const disconnectButton = screen.getByTitle('Disconnect')
      fireEvent.click(disconnectButton)

      expect(mockUserSession.signUserOut).toHaveBeenCalledWith(window.location.origin)
      expect(mockRefresh).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalledWith("Wallet disconnected.")
    })

    test('does not show Connect Wallet button when connected', () => {
      render(<ConnectWallet />)
      
      expect(screen.queryByRole('button', { name: /connect wallet/i })).not.toBeInTheDocument()
    })
  })
})