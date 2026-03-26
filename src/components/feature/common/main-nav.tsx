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
    <div className="hidden min-w-0 items-center gap-12 md:flex">
      <Link href="/" className="min-w-fit transition-opacity hover:opacity-75">
        <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
          XPLA developer utilities
        </p>
        <p className="mt-1 text-[1.7rem] leading-none tracking-[-0.08em] text-foreground">
          XPLA Dev Utils
        </p>
      </Link>
      <nav className="flex flex-wrap items-center gap-7">
        <Link
          href={menuConfig.overview.href || '/'}
          className={cn(
            'underline-motion py-1 text-[15px] tracking-[-0.02em]',
            isActivePath(pathname, menuConfig.overview.href)
              ? 'text-foreground'
              : 'text-foreground/58 hover:text-foreground',
          )}
          data-active={isActivePath(pathname, menuConfig.overview.href)}
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
                    'h-auto border-0 px-0 py-1.5 text-[15px] tracking-[-0.02em] shadow-none hover:bg-transparent',
                    isActive
                      ? 'text-foreground'
                      : 'text-foreground/58 hover:text-foreground',
                  )}
                >
                  {group.title}
                  <span className="ml-2 text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground">
                    Browse
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[21rem] rounded-3xl border border-border/70 bg-card/95 p-2.5 shadow-[0_24px_60px_-40px_hsl(var(--foreground)/0.35)]"
              >
                <DropdownMenuLabel className="space-y-1.5 p-4">
                  <p className="text-sm tracking-[-0.02em] text-foreground">
                    {group.title}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {group.description}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {group.items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="rounded-2xl p-4"
                  >
                    <Link
                      href={item.href || group.href}
                      className="flex flex-col items-start gap-1.5"
                    >
                      <span className="text-sm tracking-[-0.02em] text-foreground">
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
