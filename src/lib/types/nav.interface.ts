export interface NavItem {
  title: string
  href?: string
  description?: string
  disabled?: boolean
}

export interface MainNavItem extends NavItem {}

export interface NavGroup extends NavItem {
  href: string
  items: MainNavItem[]
}
