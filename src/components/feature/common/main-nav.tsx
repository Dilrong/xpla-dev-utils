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
      <Link
        href="/"
        className="min-w-fit text-[1.7rem] leading-none tracking-[-0.08em] text-foreground transition-opacity hover:opacity-75"
      >
        XPLA Dev Utils
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
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[21rem] rounded-3xl border border-border/70 bg-card/95 p-2.5 shadow-[0_24px_60px_-40px_hsl(var(--foreground)/0.35)]"
              >
                <DropdownMenuLabel className="p-4 text-sm tracking-[-0.02em] text-foreground">
                  {group.title}
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
                      className="text-sm tracking-[-0.02em] text-foreground"
                    >
                      {item.title}
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
