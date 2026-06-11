import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { defineChain } from '@reown/appkit/networks'

// 0. QueryClient
export const queryClient = new QueryClient()

// 1. Project ID — from env
const projectId = import.meta.env.VITE_WALLETCONNECT_ID

// 2. Metadata — from env
const metadata = {
  name: import.meta.env.VITE_APP_NAME || 'AgentX',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Autonomous AI Agent Economy on BotChain',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  icons: [import.meta.env.VITE_APP_ICON || '/logo.png']
}

// 3. BotChain Testnet — from env
export const botchainTestnet = defineChain({
  id: parseInt(import.meta.env.VITE_CHAIN_ID || '968'),
  name: import.meta.env.VITE_CHAIN_NAME || 'BOT Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: import.meta.env.VITE_NATIVE_TOKEN || 'BOT',
    symbol: import.meta.env.VITE_NATIVE_TOKEN || 'BOT',
  },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_RPC_URL || 'https://rpc.bohr.life'] }
  },
  blockExplorers: {
    default: {
      name: 'BotChain Explorer',
      url: import.meta.env.VITE_EXPLORER_URL || 'https://testnet-scan.botchain.ai'
    }
  },
  testnet: true
})

// 4. BotChain Mainnet — from env (for future)
export const botchainMainnet = defineChain({
  id: parseInt(import.meta.env.VITE_BOTCHAIN_MAINNET_CHAIN_ID || '677'),
  name: import.meta.env.VITE_BOTCHAIN_MAINNET_NAME || 'BOT Chain',
  nativeCurrency: {
    decimals: 18,
    name: import.meta.env.VITE_NATIVE_TOKEN || 'BOT',
    symbol: import.meta.env.VITE_NATIVE_TOKEN || 'BOT',
  },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_BOTCHAIN_MAINNET_RPC_URL] }
  },
  blockExplorers: {
    default: {
      name: 'BotChain Explorer',
      url: import.meta.env.VITE_BOTCHAIN_MAINNET_EXPLORER
    }
  },
})

// 5. Networks array
const networks = [botchainTestnet, botchainMainnet]

// 6. Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// 7. Create AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': import.meta.env.VITE_THEME_ACCENT || '#ffffff',
    '--w3m-border-radius-master': '8px',
  }
})