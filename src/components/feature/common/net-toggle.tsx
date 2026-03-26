import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useConfigStore } from '@/lib/store/config-store'
import { Network } from '@/lib/config/block-chain'

const NetToggle = () => {
  const { network, toggleNetwork } = useConfigStore()

  const toggleNet = (network: Network) => {
    toggleNetwork(network)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 rounded-full border border-transparent px-4 text-[0.62rem] uppercase tracking-[0.22em] text-foreground/[0.72] hover:border-border hover:bg-card hover:text-foreground"
        >
          {network === Network.mainnet ? 'Mainnet' : 'Testnet'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-[1.2rem] border border-border/70 bg-card/95 p-1"
      >
        <DropdownMenuItem onClick={() => toggleNet(Network.mainnet)}>
          Mainnet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleNet(Network.testnet)}>
          Testnet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NetToggle
