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
  const { net, setNet } = useConfigStore()

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
        <DropdownMenuItem onClick={() => setNet('mainnet', Lcd.mainnet)}>
          Mainnet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setNet('testnet', Lcd.testnet)}>
          Testnet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NetToggle
