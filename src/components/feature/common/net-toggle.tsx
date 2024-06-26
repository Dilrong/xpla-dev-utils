import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { WaypointsIcon, FlaskConicalIcon } from 'lucide-react'
import { useConfigStore } from '@/lib/store/config-store'
import { Lcd } from '@/lib/types/config'

const NetToggle = () => {
  const { net, setNet, setExplorer } = useConfigStore()

  const toggleNet = (net: string) => {
    if (net === 'mainnet') {
      setNet('mainnet', Lcd.mainnet)
      setExplorer('https://explorer.xpla.io/mainnet/')
    }

    setNet('testnet', Lcd.testnet)
    setExplorer('https://explorer.xpla.io/testnet/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          {net === 'mainnet' ? (
            <WaypointsIcon className="size-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <FlaskConicalIcon className="size-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
          <span className="sr-only">Toggle Net</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleNet('mainnet')}>
          Mainnet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleNet('testnet')}>
          Testnet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NetToggle
