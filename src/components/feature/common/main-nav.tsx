'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { menuConfig } from '@/lib/config/menu'

const MainNav = () => {
  const pathname = usePathname()

  return (
    <div className="hidden min-w-0 items-center gap-6 md:flex">
      <Link href="/" className="flex min-w-fit items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
          X
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold tracking-[0.18em] text-foreground/70">
            XPLA DEV
          </p>
          <p className="text-base font-semibold text-foreground">Utils</p>
        </div>
      </Link>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        {menuConfig.mainNav.map((nav) => (
          <Link
            key={nav.href}
            href={`${nav.href}`}
            className={cn(
              'rounded-full px-3 py-2 font-medium transition-colors',
              pathname === nav.href
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/65 hover:bg-secondary hover:text-foreground',
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
