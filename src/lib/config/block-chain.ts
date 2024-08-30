export enum Network {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

type NetworkConfig = {
  lcd: string
  rpc: string
  fcd: string
  explorer: string
  blockTime: number
  ipfs: string
}

const networkConfigs: Record<Network, NetworkConfig> = {
  [Network.mainnet]: {
    lcd: 'https://dimension-lcd.xpla.dev/',
    rpc: 'https://dimension-evm-rpc.xpla.dev/',
    fcd: 'https://dimension-fcd.xpla.dev/v1/',
    explorer: 'https://explorer.xpla.io/mainnet/',
    blockTime: 6000,
    ipfs: 'https://ipfs.cyou/ipfs/',
  },
  [Network.testnet]: {
    lcd: 'https://cube-lcd.xpla.dev/',
    rpc: 'https://cube-evm-rpc.xpla.dev/',
    fcd: 'https://cube-fcd.xpla.dev/v1/',
    explorer: 'https://explorer.xpla.io/testnet/',
    blockTime: 6000,
    ipfs: 'https://ipfs.cyou/ipfs/',
  },
}

export const getNetworkConfig = (network: Network): NetworkConfig =>
  networkConfigs[network]
