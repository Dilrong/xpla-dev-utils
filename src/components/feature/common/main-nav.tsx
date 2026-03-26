'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { menuConfig } from '@/lib/config/menu'

const MainNav = () => {
  const pathname = usePathname()

  return (
    <div className="hidden min-w-0 items-center gap-6 md:flex">
      <Link href="/" className="flex min-w-fit items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-[calc(var(--radius)-0.15rem)] bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
          X
        </div>
        <div className="space-y-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            XPLA DEV
          </p>
          <p className="text-xl leading-none text-foreground">Utils</p>
        </div>
      </Link>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        {menuConfig.mainNav.map((nav) => (
          <Link
            key={nav.href}
            href={`${nav.href}`}
            className={cn(
              'rounded-full border border-transparent px-3 py-2 text-sm font-medium transition-colors',
              pathname === nav.href
                ? 'border-primary/20 bg-primary/10 text-primary'
                : 'text-foreground/70 hover:border-border hover:bg-card hover:text-foreground',
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
