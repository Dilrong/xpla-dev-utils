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
import { useEffect, useState } from 'react'
import { summarizeAddress } from '@/lib/utils'

const StoreContract = () => {
  const [historyList, setHistoryList] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    setHistoryList(getAddressesFromLocalStorage())
  }, [])

  const getAddressesFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(
        localStorage.getItem('contract-address-history') || '[]',
      )
    }
    return []
  }

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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StoreContract
