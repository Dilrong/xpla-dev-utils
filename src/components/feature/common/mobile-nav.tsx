'use client'

import React from 'react'
import Link, { LinkProps } from 'next/link'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { menuConfig } from '@/lib/config/menu'
import { usePathname, useRouter } from 'next/navigation'

function isActivePath(pathname: string, href?: string) {
  if (!href) {
    return false
  }

  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

const MobileNav = () => {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full border border-transparent px-0 py-1 text-[0.72rem] uppercase tracking-[0.24em] text-foreground/[0.72] hover:bg-transparent hover:text-foreground focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-r border-border/70 bg-background/[0.96] px-0 pt-10"
      >
        <div className="px-7">
          <MobileLink
            href="/"
            className="block transition-opacity hover:opacity-75"
            onOpenChange={setOpen}
          >
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">
              XPLA developer utilities
            </p>
            <p className="mt-1 text-[1.55rem] leading-none tracking-[-0.07em]">
              XPLA Dev Utils
            </p>
          </MobileLink>
        </div>
        <ScrollArea className="my-5 h-[calc(100vh-8.5rem)] pb-12">
          <div className="flex flex-col space-y-3.5 px-7">
            <MobileLink
              href={menuConfig.overview.href || '/'}
              onOpenChange={setOpen}
              className={cn(
                'rounded-[1.35rem] border p-5 transition-colors',
                isActivePath(pathname, menuConfig.overview.href)
                  ? 'border-foreground/12 bg-card text-foreground'
                  : 'border-border/70 bg-card/70 hover:border-border hover:bg-card',
              )}
            >
              <div className="space-y-1">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Overview
                </p>
                <p className="text-base tracking-[-0.03em]">
                  {menuConfig.overview.title}
                </p>
                {menuConfig.overview.description ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {menuConfig.overview.description}
                  </p>
                ) : null}
              </div>
            </MobileLink>
            {menuConfig.groups.map((group) => {
              const isGroupActive = group.items.some((item) =>
                isActivePath(pathname, item.href),
              )

              return (
                <details
                  key={group.title}
                  open={isGroupActive}
                    className="group rounded-[1.35rem] border border-border/70 bg-card/75"
                  >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5">
                    <div className="space-y-1">
                      <p
                        className={cn(
                          'text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground',
                          isGroupActive ? 'text-foreground/80' : '',
                        )}
                      >
                        {group.title}
                      </p>
                      <p className="text-base tracking-[-0.03em] text-foreground">
                        {group.description}
                      </p>
                    </div>
                    <span className="pt-1 text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground">
                      Browse
                    </span>
                  </summary>
                  <div className="space-y-2.5 border-t border-border/70 p-4">
                    {group.items.map((item) => (
                      <MobileLink
                        key={item.href}
                        href={item.href || group.href}
                        onOpenChange={setOpen}
                        className={cn(
                          'block rounded-[1rem] border p-4 transition-colors',
                          isActivePath(pathname, item.href)
                            ? 'border-foreground/12 bg-background text-foreground'
                            : 'border-transparent bg-background/60 hover:border-border hover:bg-background',
                        )}
                      >
                        <div className="space-y-1">
                          <p className="text-sm tracking-[-0.02em]">
                            {item.title}
                          </p>
                          {item.description ? (
                            <p className="text-xs leading-5 text-muted-foreground">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                      </MobileLink>
                    ))}
                  </div>
                </details>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
