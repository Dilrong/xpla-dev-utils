'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { menuConfig } from '@/lib/config/menu'

const MainNav = () => {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <b>XPLA Utils</b>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {menuConfig.mainNav.map((nav, index) => (
          <Link
            key={index}
            href={`${nav.href}`}
            className={cn(
              'transition-colors hover:text-foreground/80',
              pathname === nav.href ? 'text-foreground' : 'text-foreground/60',
            )}
          >
            {nav.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default MainNav
