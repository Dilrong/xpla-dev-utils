'use client'

import MobileNav from '@/components/feature/common/mobile-nav'
import MainNav from '@/components/feature/common/main-nav'
import ModeToggle from '@/components/feature/common/mode-toggle'
import NetToggle from '@/components/feature/common/net-toggle'

const Headers = () => {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end"></div>
        <ModeToggle />
        <NetToggle />
      </div>
    </header>
  )
}

export default Headers
