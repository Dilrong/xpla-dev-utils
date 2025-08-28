import { MainNavItem } from '@/lib/types/nav.interface'

interface MenuConfig {
  mainNav: MainNavItem[]
}

export const menuConfig: MenuConfig = {
  mainNav: [
    { title: 'Status', href: '/' },
    { title: 'Contracts', href: '/contracts' },
    { title: 'Mint Token', href: '/mint-token' },
    { title: 'Mint NFT', href: '/mint-nft' },
    { title: 'Burn', href: '/burn' },
    { title: 'Converts', href: '/converts' },
  ],
}
