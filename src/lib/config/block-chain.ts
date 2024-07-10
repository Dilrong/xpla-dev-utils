export enum Network {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

type NetworkConfig = {
  lcd: string
  rpc: string
  explorer: string
  blockTime: number
}

const networkConfigs: Record<Network, NetworkConfig> = {
  [Network.mainnet]: {
    lcd: 'https://dimension-lcd.xpla.dev/',
    rpc: 'https://dimension-evm-rpc.xpla.dev/',
    explorer: 'https://explorer.xpla.io/mainnet/',
    blockTime: 6000,
  },
  [Network.testnet]: {
    lcd: 'https://cube-lcd.xpla.dev/',
    rpc: 'https://cube-evm-rpc.xpla.dev/',
    explorer: 'https://explorer.xpla.io/testnet/',
    blockTime: 6000,
  },
}

export const getNetworkConfig = (network: Network): NetworkConfig =>
  networkConfigs[network]
