import { EllipsisIcon, Trash2, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { summarizeAddress } from '@/lib/utils'
import { useContractStore } from '@/lib/store/contract-store'

const StoreContract = () => {
  const {
    historyList,
    favoriteList,
    removeFromHistory,
    removeFromFavorites,
    clearHistory,
    clearFavorites,
  } = useContractStore()
  const { toast } = useToast()

  const copyClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text)
      toast({
        title: 'Copied to clipboard',
        description: summarizeAddress(text),
      })
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleRemoveFromHistory = (address: string) => {
    removeFromHistory(address)
    toast({
      title: 'Removed from history',
      description: 'Address has been removed from history.',
    })
  }

  const handleRemoveFromFavorites = (address: string) => {
    removeFromFavorites(address)
    toast({
      title: 'Removed from favorites',
      description: 'Address has been removed from favorites.',
    })
  }

  const handleClearHistory = () => {
    clearHistory()
    toast({
      title: 'History cleared',
      description: 'All history has been cleared.',
    })
  }

  const handleClearFavorites = () => {
    clearFavorites()
    toast({
      title: 'Favorites cleared',
      description: 'All favorites have been cleared.',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisIcon className="mx-2 size-[1.2rem] rotate-0 scale-100 transition-all" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Contract History
          {historyList.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {historyList.length === 0 ? (
          <DropdownMenuItem disabled>No history</DropdownMenuItem>
        ) : (
          historyList.map((data, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center justify-between"
            >
              <span
                onClick={() => copyClipboard(data)}
                className="flex-1 cursor-pointer"
              >
                {summarizeAddress(data)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFromHistory(data)}
                className="size-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="size-3" />
              </Button>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center justify-between">
          Favorites
          {favoriteList.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFavorites}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {favoriteList.length === 0 ? (
          <DropdownMenuItem disabled>No favorites</DropdownMenuItem>
        ) : (
          favoriteList.map((data, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center justify-between"
            >
              <span
                onClick={() => copyClipboard(data)}
                className="flex-1 cursor-pointer"
              >
                {summarizeAddress(data)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFromFavorites(data)}
                className="size-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="size-3" />
              </Button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StoreContract
