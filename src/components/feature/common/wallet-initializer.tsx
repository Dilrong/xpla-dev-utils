'use client'

import { WalletProvider, useChainOptions } from '@xpla/wallet-provider'
import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  children?: ReactNode
}

const WalletInitializer = ({ children }: Props) => {
  const chainOptions = useChainOptions()

  if (!chainOptions) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-border/70 bg-card/80 px-5 py-3 text-sm text-muted-foreground shadow-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading wallet environment...
        </div>
      </div>
    )
  }

  return (
    <WalletProvider
      walletConnectChainIds={chainOptions.walletConnectChainIds}
      defaultNetwork={chainOptions.defaultNetwork}
    >
      {children}
    </WalletProvider>
  )
}

export default WalletInitializer
