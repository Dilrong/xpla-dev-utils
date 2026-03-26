import { useState } from 'react'
import { EllipsisIcon, Star, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn, summarizeAddress } from '@/lib/utils'
import { useContractStore } from '@/lib/store/contract-store'

interface Props {
  currentAddress?: string
  onSelectAddress: (address: string) => void
}

function AddressSection({
  title,
  addresses,
  emptyLabel,
  currentAddress,
  onSelectAddress,
  onRemoveAddress,
  highlightFavorites = false,
}: {
  title: string
  addresses: string[]
  emptyLabel: string
  currentAddress?: string
  onSelectAddress: (address: string) => void
  onRemoveAddress: (address: string) => void
  highlightFavorites?: boolean
}) {
  return (
    <div className="space-y-2">
      <DropdownMenuLabel className="px-2 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </DropdownMenuLabel>
      {addresses.length === 0 ? (
        <p className="px-2 pb-2 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-1">
          {addresses.map((address) => {
            const isCurrent = address === currentAddress

            return (
              <div
                key={address}
                className={cn(
                  'flex items-center gap-2 rounded-[calc(var(--radius)-0.2rem)] border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-accent/50',
                  isCurrent && 'border-primary/20 bg-primary/10',
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectAddress(address)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    {highlightFavorites ? (
                      <Star className="size-3 text-primary" />
                    ) : null}
                    <p className="truncate text-sm font-medium text-foreground">
                      {summarizeAddress(address, 10, 8)}
                    </p>
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                    {address}
                  </p>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveAddress(address)}
                  className="size-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="size-3" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const StoreContract = ({ currentAddress, onSelectAddress }: Props) => {
  const {
    historyList,
    favoriteList,
    removeFromHistory,
    removeFromFavorites,
    clearHistory,
    clearFavorites,
  } = useContractStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const handleSelectAddress = (address: string) => {
    onSelectAddress(address)
    setOpen(false)
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <EllipsisIcon className="size-4" />
          Saved
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel className="p-0">
            Stored contracts
          </DropdownMenuLabel>
          {historyList.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <AddressSection
          title="Recent"
          addresses={historyList}
          emptyLabel="No recently loaded contracts."
          currentAddress={currentAddress}
          onSelectAddress={handleSelectAddress}
          onRemoveAddress={handleRemoveFromHistory}
        />

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel className="p-0">Favorites</DropdownMenuLabel>
          {favoriteList.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearFavorites}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <AddressSection
          title="Pinned"
          addresses={favoriteList}
          emptyLabel="No favorite contracts yet."
          currentAddress={currentAddress}
          onSelectAddress={handleSelectAddress}
          onRemoveAddress={handleRemoveFromFavorites}
          highlightFavorites
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StoreContract
