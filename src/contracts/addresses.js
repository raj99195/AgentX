const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '968');

const CONTRACT_ADDRESSES = {
  // BotChain Testnet (968)
  968: {
    AgentRegistry: import.meta.env.VITE_AGENT_REGISTRY || '',
    ERC8004Identity: import.meta.env.VITE_IDENTITY_ADDRESS || '',
    AgentXVault: import.meta.env.VITE_VAULT_ADDRESS || '',
  },
  // BotChain Mainnet (677)
  677: {
    AgentRegistry: import.meta.env.VITE_AGENT_REGISTRY || '',
    ERC8004Identity: import.meta.env.VITE_IDENTITY_ADDRESS || '',
    AgentXVault: import.meta.env.VITE_VAULT_ADDRESS || '',
  },
};

export const ADDRESSES = CONTRACT_ADDRESSES[CHAIN_ID] || CONTRACT_ADDRESSES[968];
export const CURRENT_CHAIN_ID = CHAIN_ID;