'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { menuConfig } from '@/lib/config/menu'

const MainNav = () => {
  const pathname = usePathname()

  return (
    <div className="hidden min-w-0 items-center gap-8 md:flex">
      <Link href="/" className="flex min-w-fit items-center gap-4">
        <div className="flex size-11 items-center justify-center border-2 border-foreground bg-foreground text-sm font-semibold text-background">
          X
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-muted-foreground">
            XPLA DEV
          </p>
          <p className="text-2xl leading-none text-foreground">Utils</p>
        </div>
      </Link>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        {menuConfig.mainNav.map((nav) => (
          <Link
            key={nav.href}
            href={`${nav.href}`}
            className={cn(
              'border border-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
              pathname === nav.href
                ? 'border-foreground bg-foreground text-background'
                : 'text-foreground/70 hover:border-foreground hover:bg-background hover:text-foreground',
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
