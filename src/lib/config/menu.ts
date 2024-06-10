import { MainNavItem } from '@/lib/types/nav'

interface MenuConfig {
  mainNav: MainNavItem[]
}

export const menuConfig: MenuConfig = {
  mainNav: [
    { title: 'Contract', href: '/contracts' },
    { title: 'Convert', href: '/converts' },
  ],
}
