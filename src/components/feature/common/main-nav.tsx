'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { menuConfig } from '@/lib/config/menu'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

function isActivePath(pathname: string, href?: string) {
  if (!href) {
    return false
  }

  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

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
        <Link
          href={menuConfig.overview.href || '/'}
          className={cn(
            'rounded-full border border-transparent px-3 py-2 text-sm font-medium transition-colors',
            isActivePath(pathname, menuConfig.overview.href)
              ? 'border-primary/20 bg-primary/10 text-primary'
              : 'text-foreground/70 hover:border-border hover:bg-card hover:text-foreground',
          )}
        >
          {menuConfig.overview.title}
        </Link>
        {menuConfig.groups.map((group) => {
          const isActive = group.items.some((item) =>
            isActivePath(pathname, item.href),
          )

          return (
            <DropdownMenu key={group.title}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'h-auto rounded-full border px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'border-primary/20 bg-primary/10 text-primary hover:bg-primary/10'
                      : 'border-transparent text-foreground/70 hover:border-border hover:bg-card hover:text-foreground',
                  )}
                >
                  {group.title}
                  <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2">
                <DropdownMenuLabel className="space-y-1 px-3 py-2">
                  <p className="text-sm font-semibold text-foreground">
                    {group.title}
                  </p>
                  <p className="text-xs font-normal leading-5 text-muted-foreground">
                    {group.description}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="rounded-[calc(var(--radius)-0.2rem)] p-3"
                  >
                    <Link
                      href={item.href || group.href}
                      className="flex flex-col items-start gap-1"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      {item.description ? (
                        <span className="text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
      </nav>
    </div>
  )
}

export default MainNav
