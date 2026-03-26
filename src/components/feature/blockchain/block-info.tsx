'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useConfigStore } from '@/lib/store/config-store'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Block {
  block_id: {
    hash: string
    parts: {
      total: number
      hash: string
    }
  }
  block: {
    header: {
      height: string
      time: string
      proposer_address: string
      chain_id: string
      num_txs: string
    }
    data: {
      txs: string[]
    }
  }
}

export function BlockInfo() {
  const { lcd, explorer } = useConfigStore()
  const { toast } = useToast()
  const [latestBlock, setLatestBlock] = useState<Block | null>(null)
  const [searchHeight, setSearchHeight] = useState('')
  const [searchedBlock, setSearchedBlock] = useState<Block | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const fetchLatestBlock = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${lcd}/cosmos/base/tendermint/v1beta1/blocks/latest`,
      )
      setLatestBlock(response.data.block)
    } catch (error) {
      console.error('Failed to fetch latest block:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch latest block information.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [lcd, toast])

  const searchBlock = async () => {
    if (!searchHeight.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a block height.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSearching(true)
      const response = await axios.get(
        `${lcd}/cosmos/base/tendermint/v1beta1/blocks/${searchHeight}`,
      )
      setSearchedBlock(response.data.block)
      toast({
        title: 'Success',
        description: `Block ${searchHeight} found.`,
      })
    } catch (error) {
      console.error('Failed to search block:', error)
      setSearchedBlock(null)
      toast({
        title: 'Error',
        description: 'Block not found or invalid height.',
        variant: 'destructive',
      })
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    void fetchLatestBlock()
    const interval = setInterval(() => {
      void fetchLatestBlock()
    }, 10000)
    return () => clearInterval(interval)
  }, [fetchLatestBlock])

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString()
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const openExplorer = (hash: string) => {
    const url = `${explorer}block/${hash}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Block</CardTitle>
          <CardDescription>
            Search for a specific block by height. The result shows the key
            fields first and tucks the raw identifiers underneath.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="block-height" className="sr-only">
                Block Height
              </Label>
              <Input
                id="block-height"
                type="number"
                placeholder="Enter block height..."
                value={searchHeight}
                onChange={(e) => setSearchHeight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void searchBlock()}
              />
            </div>
            <Button onClick={searchBlock} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchedBlock && (
            <div className="mt-4 space-y-4 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
              <h4 className="font-semibold text-foreground">
                Block {searchedBlock.block.header.height}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2 rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Time
                  </Label>
                  <p className="text-sm">
                    {formatTime(searchedBlock.block.header.time)}
                  </p>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Transactions
                  </Label>
                  <p className="text-lg font-semibold">
                    {searchedBlock.block.header.num_txs}
                  </p>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Proposer
                  </Label>
                  <p className="font-mono text-sm">
                    {shortenAddress(searchedBlock.block.header.proposer_address)}
                  </p>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Block Hash
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 px-3 py-2 font-mono text-sm">
                      {shortenAddress(searchedBlock.block_id.hash)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openExplorer(searchedBlock.block_id.hash)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <details className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background">
                <summary className="cursor-pointer list-none px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Block details
                    </p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>
                </summary>
                <div className="grid gap-3 border-t border-border p-4 md:grid-cols-2">
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Chain ID
                    </Label>
                    <p className="mt-2 break-all font-mono text-sm text-foreground">
                      {searchedBlock.block.header.chain_id}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Proposer Address
                    </Label>
                    <p className="mt-2 break-all font-mono text-sm text-foreground">
                      {searchedBlock.block.header.proposer_address}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Block Hash
                    </Label>
                    <p className="mt-2 break-all font-mono text-sm text-foreground">
                      {searchedBlock.block_id.hash}
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Parts Hash
                    </Label>
                    <p className="mt-2 break-all font-mono text-sm text-foreground">
                      {searchedBlock.block_id.parts.hash}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Total parts: {searchedBlock.block_id.parts.total}
                    </p>
                  </div>
                </div>
              </details>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Block</CardTitle>
          <CardDescription>
            Current chain head reduced to a compact summary. Open details only
            if you need raw identifiers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              Loading latest block...
            </div>
          ) : latestBlock ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Height
                  </Label>
                  <p className="text-2xl font-bold">
                    {latestBlock.block.header.height}
                  </p>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Time
                  </Label>
                  <p className="text-sm">
                    {formatTime(latestBlock.block.header.time)}
                  </p>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Transactions
                  </Label>
                  <p className="text-lg font-semibold">
                    {latestBlock.block.header.num_txs}
                  </p>
                </div>
                <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
                  <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Hash
                  </Label>
                  <p className="font-mono text-sm">
                    {shortenAddress(latestBlock.block_id.hash)}
                  </p>
                </div>
              </div>

              <details className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-background">
                <summary className="cursor-pointer list-none px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Latest block details
                    </p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>
                </summary>
                <div className="space-y-4 border-t border-border p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                      <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Proposer
                      </Label>
                      <p className="mt-2 break-all font-mono text-sm text-foreground">
                        {latestBlock.block.header.proposer_address}
                      </p>
                    </div>
                    <div className="rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 p-4">
                      <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Chain ID
                      </Label>
                      <p className="mt-2 break-all font-mono text-sm text-foreground">
                        {latestBlock.block.header.chain_id}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Full Block Hash
                    </Label>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 rounded-[calc(var(--radius)-0.25rem)] border border-border bg-secondary/35 px-3 py-2 font-mono text-sm">
                        {latestBlock.block_id.hash}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openExplorer(latestBlock.block_id.hash)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No block information available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
