import { EllipsisIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { summarizeAddress } from '@/lib/utils'
import { useContractStore } from '@/lib/store/contract-store'

const StoreContract = () => {
  const { historyList, favoriteList } = useContractStore()
  const { toast } = useToast()

  const copyClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text)
      toast({
        title: 'Coped to clipboard',
        description: summarizeAddress(text),
      })
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisIcon className="mx-2 size-[1.2rem] rotate-0 scale-100 transition-all" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Contract Address</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {historyList.map((data, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              copyClipboard(data)
            }}
          >
            {summarizeAddress(data)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuLabel>FavoriteList</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {favoriteList.map((data, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              copyClipboard(data)
            }}
          >
            {summarizeAddress(data)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StoreContract
