'use client'

import React from 'react'
import Link, { LinkProps } from 'next/link'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { menuConfig } from '@/lib/config/menu'
import { usePathname, useRouter } from 'next/navigation'

const MobileNav = () => {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 border-0 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-r border-border bg-background/95 pr-0"
      >
        <MobileLink
          href="/"
          className="flex items-center gap-3"
          onOpenChange={setOpen}
        >
          <div className="flex size-10 items-center justify-center rounded-[calc(var(--radius)-0.15rem)] bg-primary font-semibold text-primary-foreground">
            X
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              XPLA DEV
            </p>
            <p className="text-xl leading-none">Utils</p>
          </div>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {menuConfig.mainNav?.map((nav) => (
              <MobileLink
                key={nav.href}
                href={`${nav.href}`}
                onOpenChange={setOpen}
                className={cn(
                  'rounded-[calc(var(--radius)-0.2rem)] border px-4 py-3 transition-colors',
                  pathname === nav.href
                    ? 'border-primary/20 bg-primary/10 text-primary'
                    : 'border-transparent hover:border-border hover:bg-card',
                )}
              >
                <div className="space-y-1">
                  <p className="font-medium">{nav.title}</p>
                  {nav.description ? (
                    <p className="text-sm text-muted-foreground">
                      {nav.description}
                    </p>
                  ) : null}
                </div>
              </MobileLink>
            ))}
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
