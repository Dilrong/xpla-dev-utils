import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { WaypointsIcon, FlaskConicalIcon } from 'lucide-react'
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
        <Button variant="ghost" className="w-9 px-0">
          {network === Network.mainnet ? (
            <WaypointsIcon className="size-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <FlaskConicalIcon className="size-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
          <span className="sr-only">Toggle Net</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
