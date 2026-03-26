'use client'

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import StoreContract from '@/components/feature/contracts/store-contract'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useConfigStore } from '@/lib/store/config-store'
import { useContractStore } from '@/lib/store/contract-store'
import {
  fetchContractSnapshot,
  formatContractHistoryOperation,
  isValidXplaAddress,
} from '@/lib/xpla/contract/metadata'
import {
  fetchContractProfile,
  getContractFamilyLabel,
  getContractProfileSummary,
  getContractStandardLabel,
} from '@/lib/xpla/contract/profile'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { summarizeAddress } from '@/lib/utils'

function formatHistoryMessage(message: unknown) {
  if (message === null || message === undefined) {
    return null
  }

  return JSON.stringify(message, null, 2)
}

function formatNumericLabel(value: string) {
  if (!value || value === '-') {
    return '-'
  }

  try {
    return BigInt(value).toLocaleString()
  } catch {
    return value
  }
}

function openExplorer(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const SearchContract = () => {
  const { lcd, explorer } = useConfigStore()
  const { toast } = useToast()
  const {
    address,
    favoriteList,
    snapshot,
    profile,
    setSelectedContract,
    clearSelectedContract,
    setHistoryList,
    setFavoriteList,
    removeFromFavorites,
  } = useContractStore()
  const [inputValue, setInputValue] = useState(address)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const lastLoadedRequestRef = useRef('')

  const isFavorite = useMemo(
    () => Boolean(address) && favoriteList.includes(address),
    [address, favoriteList],
  )
  const profileSummary = useMemo(
    () => (profile ? getContractProfileSummary(profile) : []),
    [profile],
  )
  const keyProfileSummary = useMemo(
    () => profileSummary.slice(1, 4),
    [profileSummary],
  )

  const loadContract = useCallback(
    async (nextAddress: string, options?: { silent?: boolean }) => {
      if (!isValidXplaAddress(nextAddress)) {
        setErrorMessage('Invalid XPLA address format. Must start with "xpla1".')
        clearSelectedContract()
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage('')

        const nextSnapshot = await fetchContractSnapshot(lcd, nextAddress)
        const nextProfile = await fetchContractProfile(lcd, nextSnapshot)

        lastLoadedRequestRef.current = `${lcd}:${nextSnapshot.address}`
        setInputValue(nextSnapshot.address)
        setSelectedContract({
          address: nextSnapshot.address,
          snapshot: nextSnapshot,
          profile: nextProfile,
        })
        setHistoryList(nextSnapshot.address)

        if (!options?.silent) {
          toast({
            title: 'Contract loaded',
            description: `${nextProfile.displayName} is ready with ${nextProfile.queryExamples.length} live query examples.`,
          })
        }
      } catch (error) {
        console.error(error)
        clearSelectedContract()
        setErrorMessage(
          'Contract not found or the selected LCD endpoint is unavailable.',
        )

        if (!options?.silent) {
          toast({
            title: 'Contract not found',
            description: 'Please check the contract address and try again.',
            variant: 'destructive',
          })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [clearSelectedContract, lcd, setHistoryList, setSelectedContract, toast],
  )

  useEffect(() => {
    if (!address) {
      lastLoadedRequestRef.current = ''
      return
    }

    if (`${lcd}:${address}` === lastLoadedRequestRef.current) {
      return
    }

    setInputValue(address)
    void loadContract(address, { silent: true })
  }, [address, lcd, loadContract])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextAddress = inputValue.trim()
    if (!nextAddress) {
      clearSelectedContract()
      setErrorMessage('')
      return
    }

    await loadContract(nextAddress)
  }

  const handleSelectStoredAddress = async (nextAddress: string) => {
    await loadContract(nextAddress)
  }

  const handleToggleFavorite = () => {
    if (!address) {
      toast({
        title: 'No contract selected',
        description: 'Load a contract before pinning it to favorites.',
        variant: 'destructive',
      })
      return
    }

    if (favoriteList.includes(address)) {
      removeFromFavorites(address)
      toast({
        title: 'Removed from favorites',
        description: summarizeAddress(address, 10, 8),
      })
      return
    }

    setFavoriteList(address)
    toast({
      title: 'Added to favorites',
      description: summarizeAddress(address, 10, 8),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract address</CardTitle>
        <CardDescription>
          Load a live CosmWasm contract once, then reuse the selected address in
          the query and execute tabs below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="space-y-3"
        >
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="address">Contract address</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={isFavorite ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleToggleFavorite}
                disabled={!address}
              >
                {isFavorite ? 'Unfavorite' : 'Favorite'}
              </Button>
              <StoreContract
                currentAddress={address}
                onSelectAddress={(nextAddress) =>
                  void handleSelectStoredAddress(nextAddress)
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row">
            <Input
              type="text"
              id="address"
              placeholder="xpla1..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="font-mono"
            />
            <Button type="submit" disabled={isLoading} className="lg:w-40">
              {isLoading ? 'Loading...' : 'Search'}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Uses the selected LCD endpoint and keeps the last loaded contracts
            available in the saved menu.
          </p>
        </form>

        {errorMessage ? (
          <div className="rounded-[calc(var(--radius)-0.2rem)] border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">{errorMessage}</p>
          </div>
        ) : null}

        {snapshot ? (
          <div className="space-y-4 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/25 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Selected contract
                </p>
                <h3 className="text-xl font-semibold text-foreground">
                  {snapshot.info.label}
                </h3>
                {profile ? (
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {getContractStandardLabel(profile.standard)}
                    </span>
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {getContractFamilyLabel(profile.family)}
                    </span>
                  </div>
                ) : null}
                <p className="break-all font-mono text-sm text-muted-foreground">
                  {snapshot.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile
                    ? `${profile.queryExamples.length} query examples and ${profile.executeExamples.length} execute examples are ready.`
                    : 'The address is ready for the query and execute tabs.'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  openExplorer(`${explorer}contract/${snapshot.address}`)
                }
              >
                Open explorer
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Code ID
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {snapshot.info.codeId}
                </p>
              </div>
              <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Created Height
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {formatNumericLabel(snapshot.info.createdHeight)}
                </p>
              </div>
              <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Admin
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {snapshot.info.admin
                    ? summarizeAddress(snapshot.info.admin, 10, 8)
                    : 'Immutable'}
                </p>
              </div>
              <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  History
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {snapshot.history.length.toLocaleString()} entries
                </p>
              </div>
            </div>

            {keyProfileSummary.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {keyProfileSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 break-all text-sm text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <details className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background">
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    Contract details
                  </p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
              </summary>
              <div className="space-y-4 border-t border-border p-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Creator
                    </p>
                    <p className="mt-2 break-all font-mono text-sm text-foreground">
                      {snapshot.info.creator || '-'}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Admin
                    </p>
                    <p className="mt-2 break-all font-mono text-sm text-foreground">
                      {snapshot.info.admin || 'Immutable'}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Created Tx Index
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {snapshot.info.createdTxIndex}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4 md:col-span-2 xl:col-span-1">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      IBC Port
                    </p>
                    <p className="mt-2 break-all font-mono text-sm text-foreground">
                      {snapshot.info.ibcPortId || '-'}
                    </p>
                  </div>
                </div>

                {profileSummary.length ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">
                      Detected profile
                    </p>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {profileSummary.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4"
                        >
                          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="mt-2 break-all text-sm text-foreground">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </details>

            <details className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background">
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    Contract history
                  </p>
                  <span className="text-xs text-muted-foreground">Open</span>
                </div>
              </summary>
              <div className="space-y-3 border-t border-border p-4">
                {snapshot.history.length ? (
                  snapshot.history.map((entry, index) => (
                    <details
                      key={`${entry.operation}-${entry.updated?.block_height}-${index}`}
                      className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4"
                    >
                      <summary className="cursor-pointer list-none">
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {formatContractHistoryOperation(entry.operation)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Code ID {entry.code_id || '-'} at height{' '}
                              {formatNumericLabel(
                                entry.updated?.block_height || '-',
                              )}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            tx index {entry.updated?.tx_index ?? '-'}
                          </p>
                        </div>
                      </summary>
                      {formatHistoryMessage(entry.msg) ? (
                        <pre className="mt-4 max-h-80 overflow-auto rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background p-4 text-xs leading-6 text-muted-foreground">
                          {formatHistoryMessage(entry.msg)}
                        </pre>
                      ) : (
                        <p className="mt-4 text-sm text-muted-foreground">
                          No payload was returned for this history entry.
                        </p>
                      )}
                    </details>
                  ))
                ) : (
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-dashed border-border bg-secondary/35 p-4 text-sm text-muted-foreground">
                    The LCD did not return any contract history entries.
                  </div>
                )}
              </div>
            </details>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default SearchContract
