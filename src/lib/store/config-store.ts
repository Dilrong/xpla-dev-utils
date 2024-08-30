import { create } from 'zustand'
import { Network, getNetworkConfig } from '@/lib/config/block-chain'

type ConfigStore = {
  network: Network
  lcd: string
  rpc: string
  explorer: string
  blockTime: number
  ipfs: string

  toggleNetwork: (network: Network) => void
}

const useConfigStore = create<ConfigStore>((set) => ({
  network: Network.testnet,
  lcd: getNetworkConfig(Network.testnet).lcd,
  rpc: getNetworkConfig(Network.testnet).rpc,
  explorer: getNetworkConfig(Network.testnet).explorer,
  blockTime: getNetworkConfig(Network.testnet).blockTime,
  ipfs: getNetworkConfig(Network.testnet).ipfs,

  toggleNetwork: (network: Network) => {
    const config = getNetworkConfig(network)
    set(() => ({
      network: network,
      lcd: config.lcd,
      rpc: config.rpc,
      explorer: config.explorer,
      blockTime: 6000,
      ipfs: config.ipfs,
    }))
  },
}))

export { useConfigStore }
