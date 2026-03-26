'use client'

import MobileNav from '@/components/feature/common/mobile-nav'
import MainNav from '@/components/feature/common/main-nav'
import ModeToggle from '@/components/feature/common/mode-toggle'
import NetToggle from '@/components/feature/common/net-toggle'
import WalletConnect from '@/components/feature/common/wallet-connect'

const Headers = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex min-h-20 max-w-screen-2xl items-center gap-3 py-3">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end gap-2">
          <WalletConnect />
          <NetToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

export default Headers
