'use client'

import { useState, useEffect } from 'react'
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
import { Loader2, Search, Hash, Clock, User, ArrowUpRight } from 'lucide-react'

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

  // 최신 블록 정보 가져오기
  const fetchLatestBlock = async () => {
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
  }

  // 특정 높이의 블록 검색
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

  // 컴포넌트 마운트 시 최신 블록 가져오기
  useEffect(() => {
    fetchLatestBlock()
    // 10초마다 최신 블록 업데이트
    const interval = setInterval(fetchLatestBlock, 10000)
    return () => clearInterval(interval)
  }, [lcd])

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
      {/* 최신 블록 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="size-5" />
            Latest Block
          </CardTitle>
          <CardDescription>
            Current latest block information from the XPLA blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : latestBlock ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Height
                  </Label>
                  <p className="text-2xl font-bold">
                    {latestBlock.block.header.height}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Time
                  </Label>
                  <p className="text-sm">
                    {formatTime(latestBlock.block.header.time)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Transactions
                  </Label>
                  <p className="text-lg font-semibold">
                    {latestBlock.block.header.num_txs}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Proposer
                  </Label>
                  <p className="font-mono text-sm">
                    {shortenAddress(latestBlock.block.header.proposer_address)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Block Hash
                </Label>
                <div className="flex items-center gap-2">
                  <p className="rounded bg-muted px-2 py-1 font-mono text-sm">
                    {shortenAddress(latestBlock.block_id.hash)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openExplorer(latestBlock.block_id.hash)}
                  >
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No block information available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 블록 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Search Block
          </CardTitle>
          <CardDescription>
            Search for a specific block by height.
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
                onKeyPress={(e) => e.key === 'Enter' && searchBlock()}
              />
            </div>
            <Button onClick={searchBlock} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
            </Button>
          </div>

          {searchedBlock && (
            <div className="mt-4 space-y-4 rounded-lg bg-muted p-4">
              <h4 className="font-semibold">
                Block {searchedBlock.block.header.height}
              </h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Time
                  </Label>
                  <p className="text-sm">
                    {formatTime(searchedBlock.block.header.time)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Transactions
                  </Label>
                  <p className="text-lg font-semibold">
                    {searchedBlock.block.header.num_txs}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Proposer
                  </Label>
                  <p className="font-mono text-sm">
                    {shortenAddress(
                      searchedBlock.block.header.proposer_address,
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Block Hash
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="rounded bg-background px-2 py-1 font-mono text-sm">
                      {shortenAddress(searchedBlock.block_id.hash)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openExplorer(searchedBlock.block_id.hash)}
                    >
                      <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
