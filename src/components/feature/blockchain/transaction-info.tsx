'use client'

import { useState } from 'react'
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
import {
  Loader2,
  Search,
  Hash,
  ArrowUpRight,
  Clock,
  User,
  Coins,
} from 'lucide-react'

interface Transaction {
  tx_response: {
    txhash: string
    height: string
    gas_wanted: string
    gas_used: string
    tx: {
      body: {
        messages: Array<{
          '@type': string
          [key: string]: any
        }>
      }
    }
    timestamp: string
    code: number
    raw_log: string
    logs: Array<{
      msg_index: number
      log: string
      events: Array<{
        type: string
        attributes: Array<{
          key: string
          value: string
        }>
      }>
    }>
  }
}

export function TransactionInfo() {
  const { lcd, explorer } = useConfigStore()
  const { toast } = useToast()
  const [txHash, setTxHash] = useState('')
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // 트랜잭션 검색
  const searchTransaction = async () => {
    if (!txHash.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a transaction hash.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSearching(true)
      const response = await axios.get(`${lcd}/cosmos/tx/v1beta1/txs/${txHash}`)
      setTransaction(response.data)
      toast({
        title: 'Success',
        description: 'Transaction found successfully.',
      })
    } catch (error) {
      console.error('Failed to search transaction:', error)
      setTransaction(null)
      toast({
        title: 'Error',
        description: 'Transaction not found or invalid hash.',
        variant: 'destructive',
      })
    } finally {
      setIsSearching(false)
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString()
  }

  const shortenAddress = (address: string) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const shortenHash = (hash: string) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  const openExplorer = (hash: string) => {
    const url = `${explorer}tx/${hash}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const getMessageType = (type: string) => {
    return type.split('.').pop() || type
  }

  const formatGas = (gas: string) => {
    return parseInt(gas).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* 트랜잭션 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Search Transaction
          </CardTitle>
          <CardDescription>
            Search for a specific transaction by hash.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="tx-hash" className="sr-only">
                Transaction Hash
              </Label>
              <Input
                id="tx-hash"
                placeholder="Enter transaction hash..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchTransaction()}
              />
            </div>
            <Button onClick={searchTransaction} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 트랜잭션 정보 */}
      {transaction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="size-5" />
              Transaction Details
            </CardTitle>
            <CardDescription>
              Detailed information about the searched transaction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        transaction.tx_response.code === 0
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span
                      className={
                        transaction.tx_response.code === 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {transaction.tx_response.code === 0
                        ? 'Success'
                        : 'Failed'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Height
                  </Label>
                  <p className="text-lg font-semibold">
                    {transaction.tx_response.height}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Gas Used
                  </Label>
                  <p className="text-sm">
                    {formatGas(transaction.tx_response.gas_used)} /{' '}
                    {formatGas(transaction.tx_response.gas_wanted)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Timestamp
                  </Label>
                  <p className="text-sm">
                    {formatTime(transaction.tx_response.timestamp)}
                  </p>
                </div>
              </div>

              {/* 트랜잭션 해시 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Transaction Hash
                </Label>
                <div className="flex items-center gap-2">
                  <p className="flex-1 rounded bg-muted px-2 py-1 font-mono text-sm">
                    {shortenHash(transaction.tx_response.txhash)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openExplorer(transaction.tx_response.txhash)}
                  >
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* 메시지 정보 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Messages
                </Label>
                <div className="space-y-2">
                  {transaction.tx_response.tx.body.messages.map(
                    (message, index) => (
                      <div key={index} className="rounded-lg bg-muted p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Message {index + 1}
                          </span>
                          <span className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                            {getMessageType(message['@type'])}
                          </span>
                        </div>
                        <pre className="overflow-x-auto text-xs">
                          {JSON.stringify(message, null, 2)}
                        </pre>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* 로그 정보 */}
              {transaction.tx_response.logs &&
                transaction.tx_response.logs.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Logs
                    </Label>
                    <div className="space-y-2">
                      {transaction.tx_response.logs.map((log, index) => (
                        <div key={index} className="rounded-lg bg-muted p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Log {index + 1}
                            </span>
                            <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                              {log.msg_index}
                            </span>
                          </div>
                          {log.log && (
                            <p className="mb-2 text-xs text-muted-foreground">
                              {log.log}
                            </p>
                          )}
                          {log.events && log.events.length > 0 && (
                            <div className="space-y-1">
                              {log.events.map((event, eventIndex) => (
                                <div key={eventIndex} className="text-xs">
                                  <span className="font-medium">
                                    {event.type}:
                                  </span>
                                  {event.attributes.map((attr, attrIndex) => (
                                    <span
                                      key={attrIndex}
                                      className="ml-2 text-muted-foreground"
                                    >
                                      {attr.key}={attr.value}
                                    </span>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* 에러 정보 */}
              {transaction.tx_response.code !== 0 &&
                transaction.tx_response.raw_log && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Error Log
                    </Label>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-700">
                        {transaction.tx_response.raw_log}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
