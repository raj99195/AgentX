import { useReadContract, useWriteContract, useAccount, useBalance } from 'wagmi'
import { ADDRESSES, CURRENT_CHAIN_ID } from '../contracts/addresses'
import { AgentRegistryABI } from '../contracts/AgentRegistryABI'
import { VaultABI } from '../contracts/VaultABI'

// Chain ID from env — no hardcoded values
const CHAIN_ID = CURRENT_CHAIN_ID;

// ===== GET WALLET BALANCE =====
export function useWalletBalance() {
  const { address } = useAccount()
  const { data, isLoading } = useBalance({
    address,
    chainId: CHAIN_ID,
    query: { enabled: !!address, refetchInterval: 10000 }
  })
  return {
    balance: data?.formatted || '0',
    symbol: data?.symbol || import.meta.env.VITE_NATIVE_TOKEN || 'BOT',
    isLoading,
  }
}

// ===== GET ALL AGENTS =====
export function useTotalAgents() {
  const { data, isLoading } = useReadContract({
    address: ADDRESSES.AgentRegistry,
    abi: AgentRegistryABI,
    functionName: 'getTotalAgents',
    query: { refetchInterval: 10000 }
  })
  return { total: data ? Number(data) : 0, isLoading }
}

// ===== GET OWNER AGENTS =====
export function useOwnerAgents() {
  const { address } = useAccount()
  const { data, isLoading } = useReadContract({
    address: ADDRESSES.AgentRegistry,
    abi: AgentRegistryABI,
    functionName: 'getOwnerAgents',
    args: [address],
    query: { enabled: !!address }
  })
  return { agentIds: data || [], isLoading }
}

// ===== GET SINGLE AGENT =====
export function useAgent(agentId) {
  const { data, isLoading } = useReadContract({
    address: ADDRESSES.AgentRegistry,
    abi: AgentRegistryABI,
    functionName: 'getAgent',
    args: [BigInt(agentId || 0)],
    query: { enabled: !!agentId, refetchInterval: 15000 }
  })
  return { agent: data, isLoading }
}

// ===== GET ACCURACY =====
export function useAgentAccuracy(agentId) {
  const { data } = useReadContract({
    address: ADDRESSES.AgentRegistry,
    abi: AgentRegistryABI,
    functionName: 'getAccuracy',
    args: [BigInt(agentId || 0)],
    query: { enabled: !!agentId }
  })
  return { accuracy: data ? Number(data) : 0 }
}

// ===== GET VAULT BALANCE =====
export function useVaultBalance() {
  const { address } = useAccount()
  const { data, isLoading } = useReadContract({
    address: ADDRESSES.AgentXVault,
    abi: VaultABI,
    functionName: 'getBalance',
    args: [address],
    query: { enabled: !!address, refetchInterval: 10000 }
  })
  return {
    vaultBalance: data ? (Number(data) / 1e18).toFixed(4) : '0',
    isLoading,
  }
}

// ===== DEPLOY AGENT =====
export function useDeployAgent() {
  const { writeContractAsync, isPending } = useWriteContract()
  const deployAgent = async (name, role) => {
    return await writeContractAsync({
      address: ADDRESSES.AgentRegistry,
      abi: AgentRegistryABI,
      functionName: 'deployAgent',
      args: [name, role],
    })
  }
  return { deployAgent, isPending }
}

// ===== HIRE AGENT =====
export function useHireAgent() {
  const { writeContractAsync, isPending } = useWriteContract()
  const hireAgent = async (masterId, subAgentId, paymentInBOT = 0) => {
    return await writeContractAsync({
      address: ADDRESSES.AgentRegistry,
      abi: AgentRegistryABI,
      functionName: 'hireAgent',
      args: [BigInt(masterId), BigInt(subAgentId)],
      value: BigInt(Math.floor(paymentInBOT * 1e18)),
    })
  }
  return { hireAgent, isPending }
}

// ===== FIRE AGENT =====
export function useFireAgent() {
  const { writeContractAsync, isPending } = useWriteContract()
  const fireAgent = async (agentId) => {
    return await writeContractAsync({
      address: ADDRESSES.AgentRegistry,
      abi: AgentRegistryABI,
      functionName: 'fireAgent',
      args: [BigInt(agentId)],
    })
  }
  return { fireAgent, isPending }
}

// ===== PAY AGENT =====
export function usePayAgent() {
  const { writeContractAsync, isPending } = useWriteContract()
  const payAgent = async (agentId, amountInBOT) => {
    return await writeContractAsync({
      address: ADDRESSES.AgentRegistry,
      abi: AgentRegistryABI,
      functionName: 'payAgent',
      args: [BigInt(agentId)],
      value: BigInt(Math.floor(amountInBOT * 1e18)),
    })
  }
  return { payAgent, isPending }
}

// ===== RECORD DECISION =====
export function useRecordDecision() {
  const { writeContractAsync, isPending } = useWriteContract()
  const recordDecision = async (agentId, action, success) => {
    const dataHash = '0x' + Array.from(
      new TextEncoder().encode(action)
    ).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 64).padEnd(64, '0')
    return await writeContractAsync({
      address: ADDRESSES.AgentRegistry,
      abi: AgentRegistryABI,
      functionName: 'recordDecision',
      args: [BigInt(agentId), action, ('0x' + dataHash), success],
    })
  }
  return { recordDecision, isPending }
}

// ===== DEPOSIT TO VAULT =====
export function useDeposit() {
  const { writeContractAsync, isPending } = useWriteContract()
  const deposit = async (amountInEther) => {
    return await writeContractAsync({
      address: ADDRESSES.AgentXVault,
      abi: VaultABI,
      functionName: 'deposit',
      value: BigInt(Math.floor(amountInEther * 1e18)),
    })
  }
  return { deposit, isPending }
}

// ===== WITHDRAW FROM VAULT =====
export function useWithdraw() {
  const { writeContractAsync, isPending } = useWriteContract()
  const withdraw = async (amountInEther) => {
    return await writeContractAsync({
      address: ADDRESSES.AgentXVault,
      abi: VaultABI,
      functionName: 'withdraw',
      args: [BigInt(Math.floor(amountInEther * 1e18))],
    })
  }
  return { withdraw, isPending }
}