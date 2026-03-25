import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getNetworkConfig, Network } from '@/lib/config/block-chain'

type ConfigStore = {
  network: Network
  lcd: string
  rpc: string
  explorer: string
  blockTime: number
  ipfs: string

  toggleNetwork: (network: Network) => void
}

type PersistedConfigStore = Pick<ConfigStore, 'network'>

const DEFAULT_NETWORK = Network.testnet

function createNetworkState(network: Network) {
  const config = getNetworkConfig(network)

  return {
    network,
    lcd: config.lcd,
    rpc: config.rpc,
    explorer: config.explorer,
    blockTime: config.blockTime,
    ipfs: config.ipfs,
  }
}

const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      ...createNetworkState(DEFAULT_NETWORK),
      toggleNetwork: (network: Network) => {
        set(createNetworkState(network))
      },
    }),
    {
      name: 'xpla-config-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ network: state.network }),
      merge: (persistedState, currentState) => {
        const storedNetwork =
          (persistedState as PersistedConfigStore | undefined)?.network ??
          currentState.network

        return {
          ...currentState,
          ...createNetworkState(storedNetwork),
        }
      },
    },
  ),
)

export { useConfigStore }
