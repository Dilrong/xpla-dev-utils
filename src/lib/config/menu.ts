import { MainNavItem } from '@/lib/types/nav.interface'

interface MenuConfig {
  mainNav: MainNavItem[]
}

export const menuConfig: MenuConfig = {
  mainNav: [
    { title: 'Contract', href: '/contracts' },
    { title: 'Convert', href: '/converts' },
    // { title: 'NFT', href: '/mint-nft' },
    { title: 'Token', href: '/mint-token' },
  ],
}
