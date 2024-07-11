import { Button } from '@/components/ui/button'
import { useWallet, WalletStatus } from '@xpla/wallet-provider'
import { summarizeAddress } from '@/lib/utils'

const WalletConnect = () => {
  const { status, wallets, connect, disconnect } = useWallet()

  return (
    <>
      {status === WalletStatus.WALLET_NOT_CONNECTED ? (
        <Button size="sm" onClick={() => connect()}>
          Connect Wallet
        </Button>
      ) : (
        <Button size="sm" onClick={() => disconnect()}>
          {summarizeAddress(wallets[0]?.xplaAddress)}
        </Button>
      )}
    </>
  )
}

export default WalletConnect
