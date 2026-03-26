import { MainNavItem, NavGroup } from '@/lib/types/nav.interface'

interface MenuConfig {
  overview: MainNavItem
  groups: NavGroup[]
}

const chainItems: MainNavItem[] = [
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
    title: 'Cosmos',
    href: '/cosmos',
    description:
      'Inspect accounts, convert bech32 prefixes, and review chain params.',
  },
]

const contractItems: MainNavItem[] = [
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
]

const utilityItems: MainNavItem[] = [
  {
    title: 'Converts',
    href: '/converts',
    description: 'Convert units, epoch timestamps, Base64, and IPFS values.',
  },
]

export const menuConfig: MenuConfig = {
  overview: {
    title: 'Overview',
    href: '/',
    description: 'Monitor public LCD, RPC, and FCD health across networks.',
  },
  groups: [
    {
      title: 'Chain',
      href: '/blockchain',
      description:
        'Inspect chain state, validator health, and Cosmos account tools.',
      items: chainItems,
    },
    {
      title: 'Contracts',
      href: '/contracts',
      description:
        'Work with contracts first, then expand into token and NFT flows only when needed.',
      items: contractItems,
    },
    {
      title: 'Utilities',
      href: '/converts',
      description:
        'Keep small conversion tools out of the way until they are actually needed.',
      items: utilityItems,
    },
  ],
}
