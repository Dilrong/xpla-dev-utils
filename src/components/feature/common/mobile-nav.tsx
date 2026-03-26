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
            className="block text-[1.55rem] leading-none tracking-[-0.07em] transition-opacity hover:opacity-75"
            onOpenChange={setOpen}
          >
            XPLA Dev Utils
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
              <p className="text-base tracking-[-0.03em]">
                {menuConfig.overview.title}
              </p>
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
                    <p className="text-base tracking-[-0.03em] text-foreground">
                      {group.title}
                    </p>
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
                        <p className="text-sm tracking-[-0.02em]">{item.title}</p>
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
