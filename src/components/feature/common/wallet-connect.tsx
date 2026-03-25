'use client'

import { Button } from '@/components/ui/button'
import { useWallet, WalletStatus } from '@xpla/wallet-provider'
import { summarizeAddress } from '@/lib/utils'

const WalletConnect = () => {
  const { status, wallets, connect, disconnect } = useWallet()

  if (status === WalletStatus.INITIALIZING) {
    return (
      <Button size="sm" variant="outline" disabled>
        Wallet Loading
      </Button>
    )
  }

  return (
    <>
      {status === WalletStatus.WALLET_NOT_CONNECTED ? (
        <Button size="sm" onClick={() => connect()}>
          Connect Wallet
        </Button>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => disconnect()}>
          {summarizeAddress(wallets[0]?.xplaAddress)}
        </Button>
      )}
    </>
  )
}

export default WalletConnect
