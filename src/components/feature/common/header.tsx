'use client'

import Link from 'next/link'
import MobileNav from '@/components/feature/common/mobile-nav'
import MainNav from '@/components/feature/common/main-nav'
import ModeToggle from '@/components/feature/common/mode-toggle'
import NetToggle from '@/components/feature/common/net-toggle'
import WalletConnect from '@/components/feature/common/wallet-connect'

const Headers = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/[0.72]">
      <div className="container max-w-screen-2xl">
        <div className="hidden min-h-20 items-center justify-between gap-8 py-2 md:flex">
          <MainNav />
          <div className="flex items-center gap-2.5">
            <WalletConnect />
            <NetToggle />
            <ModeToggle />
          </div>
        </div>
        <div className="flex min-h-[4.75rem] items-center justify-between gap-3 py-2 md:hidden">
          <div className="flex min-w-0 items-center gap-5">
            <MobileNav />
            <Link href="/" className="min-w-0 transition-opacity hover:opacity-75">
              <p className="text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground">
                XPLA utilities
              </p>
              <p className="mt-1 truncate text-lg leading-none tracking-[-0.06em] text-foreground">
                XPLA Dev Utils
              </p>
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <NetToggle />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Headers
