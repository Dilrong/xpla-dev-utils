'use client'

import { Button } from '@/components/ui/button'
import { useWallet, WalletStatus } from '@xpla/wallet-provider'
import { summarizeAddress } from '@/lib/utils'

const WalletConnect = () => {
  const { status, wallets, connect, disconnect } = useWallet()

  if (status === WalletStatus.INITIALIZING) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className="h-10 rounded-full border-border/70 px-4 text-[0.62rem] uppercase tracking-[0.22em]"
      >
        Wallet Loading
      </Button>
    )
  }

  return (
    <>
      {status === WalletStatus.WALLET_NOT_CONNECTED ? (
        <Button
          size="sm"
          onClick={() => connect()}
          className="h-10 rounded-full px-4 text-[0.62rem] uppercase tracking-[0.22em]"
        >
          Connect Wallet
        </Button>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => disconnect()}
          className="h-10 rounded-full px-4 text-[0.62rem] uppercase tracking-[0.16em]"
        >
          {summarizeAddress(wallets[0]?.xplaAddress)}
        </Button>
      )}
    </>
  )
}

export default WalletConnect
