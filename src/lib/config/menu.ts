import { MainNavItem } from '@/lib/types/nav.interface'

interface MenuConfig {
  mainNav: MainNavItem[]
}

export const menuConfig: MenuConfig = {
  mainNav: [
    {
      title: 'Status',
      href: '/',
      description: 'Monitor public LCD, RPC, and FCD health across networks.',
    },
    {
      title: 'Blockchain',
      href: '/blockchain',
      description: 'Inspect blocks, transactions, and validator search tools.',
    },
    {
      title: 'Validators',
      href: '/validators',
      description: 'Review the bonded validator set and upgrade schedule.',
    },
    {
      title: 'Contracts',
      href: '/contracts',
      description: 'Search, query, and execute CosmWasm contracts.',
    },
    {
      title: 'Mint Token',
      href: '/mint-token',
      description: 'Deploy CW20 and ERC20 token contracts from your wallet.',
    },
    {
      title: 'Mint NFT',
      href: '/mint-nft',
      description: 'Deploy CW721 and ERC721 NFT contracts.',
    },
    {
      title: 'Burn',
      href: '/burn',
      description: 'Burn tokens and NFTs with guided transaction helpers.',
    },
    {
      title: 'Converts',
      href: '/converts',
      description: 'Convert units, epoch timestamps, Base64, and IPFS values.',
    },
  ],
}
