'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useConfigStore } from '@/lib/store/config-store'
import { useContractStore } from '@/lib/store/contract-store'
import { useConnectedWallet } from '@xpla/wallet-provider'
import { MsgExecuteContract, Coin } from '@xpla/xpla.js'
import axios from 'axios'
import {
  getContractFamilyLabel,
  getContractStandardLabel,
} from '@/lib/xpla/contract/profile'
import { isValidXplaAddress } from '@/lib/xpla/contract/metadata'

const formSchema = z.object({
  funds: z.string().optional(),
  executeMessage: z.string().min(1, 'Execute message is required'),
})

type FormData = z.infer<typeof formSchema>

const ExecuteContract = () => {
  const { toast } = useToast()
  const { explorer, lcd } = useConfigStore()
  const { address, profile } = useContractStore()
  const connectedWallet = useConnectedWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const lastAutoMessageRef = useRef('{}')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      funds: '',
      executeMessage: '{}',
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!connectedWallet) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to execute contracts.',
        variant: 'destructive',
      })
      return
    }

    if (!address) {
      toast({
        title: 'No contract address',
        description: 'Please search for a contract first.',
        variant: 'destructive',
      })
      return
    }

    if (!isValidXplaAddress(address)) {
      toast({
        title: 'Invalid contract address',
        description: 'Contract address must be a valid XPLA address.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)

      let parsedMessage
      try {
        parsedMessage = JSON.parse(data.executeMessage)
      } catch {
        toast({
          title: 'Invalid JSON format',
          description: 'Please check your execute message format.',
          variant: 'destructive',
        })
        return
      }

      let funds = undefined
      if (data.funds && data.funds.trim()) {
        const fundsAmount = data.funds.trim()
        if (isNaN(Number(fundsAmount)) || Number(fundsAmount) < 0) {
          toast({
            title: 'Invalid funds amount',
            description: 'Funds amount must be a valid positive number.',
            variant: 'destructive',
          })
          return
        }
        funds = [new Coin('axpla', fundsAmount)]
      }

      const executeMsg = new MsgExecuteContract(
        connectedWallet.walletAddress,
        address,
        parsedMessage,
        funds,
      )

      toast({
        title: 'Transaction submitted',
        description: 'Please wait while your transaction is being processed...',
      })

      const signTx = await connectedWallet.post({
        msgs: [executeMsg as any],
      })

      const txHash = signTx.result.txhash

      toast({
        title: 'Transaction submitted successfully',
        description: 'Waiting for transaction confirmation...',
      })

      let txConfirmed = false
      let attempts = 0
      const maxAttempts = 30

      while (!txConfirmed && attempts < maxAttempts) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const txResponse = await axios.get(
            `${lcd}/cosmos/tx/v1beta1/txs/${txHash}`,
          )

          if (
            txResponse.data.tx_response &&
            txResponse.data.tx_response.code === 0
          ) {
            txConfirmed = true
            break
          }

          attempts++
        } catch {
          attempts++
        }
      }

      if (txConfirmed) {
        toast({
          title: 'Transaction confirmed',
          description: 'Your contract execution was successful.',
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const explorerUrl = `${explorer}tx/${txHash}`
                window.open(explorerUrl, '_blank', 'noopener,noreferrer')
              }}
            >
              View on Explorer
            </Button>
          ),
        })
      } else {
        toast({
          title: 'Transaction submitted',
          description:
            'Transaction was submitted but confirmation is pending. Check explorer for status.',
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const explorerUrl = `${explorer}tx/${txHash}`
                window.open(explorerUrl, '_blank', 'noopener,noreferrer')
              }}
            >
              Check on Explorer
            </Button>
          ),
        })
      }

      form.reset({
        funds: '',
        executeMessage: lastAutoMessageRef.current,
      })
    } catch (err) {
      console.error('Execute error:', err)

      let errorMessage = 'Failed to execute the contract.'

      if (err instanceof Error) {
        if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds to execute the contract.'
        } else if (err.message.includes('unauthorized')) {
          errorMessage = 'Unauthorized to execute this contract function.'
        } else if (err.message.includes('invalid')) {
          errorMessage = 'Invalid contract execution parameters.'
        } else if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by user.'
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.'
        }
      }

      toast({
        title: 'Execute failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      const message = form.getValues('executeMessage')
      await navigator.clipboard.writeText(message)
      setCopied(true)
      toast({
        title: 'Copied to clipboard',
        description: 'Execute message copied successfully.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const examples = useMemo(() => profile?.executeExamples ?? [], [profile])
  const defaultExample = examples[0]

  useEffect(() => {
    const nextAutoMessage = examples[0]?.payload ?? '{}'

    form.reset({
      funds: '',
      executeMessage: nextAutoMessage,
    })
    form.clearErrors('executeMessage')
    lastAutoMessageRef.current = nextAutoMessage
  }, [address, examples, form])

  const loadExample = (message: string) => {
    form.setValue('executeMessage', message)
    lastAutoMessageRef.current = message
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contract Execute</CardTitle>
          <CardDescription>
            Execute smart contract functions. The message will be automatically
            converted to base64.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/35 p-4">
              <Label htmlFor="contract-address">Contract Address</Label>
              <Input
                id="contract-address"
                value={address || ''}
                placeholder="Search for a contract first..."
                disabled
                className="bg-background"
              />
              <p className="text-sm text-muted-foreground">
                The selected contract is reused from the search panel.
              </p>
              {profile ? (
                <p className="text-sm text-muted-foreground">
                  Detected profile: {getContractStandardLabel(profile.standard)}{' '}
                  {getContractFamilyLabel(profile.family).toLowerCase()}.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="execute-message">Execute Message (JSON)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-7"
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <Textarea
                id="execute-message"
                placeholder="Enter your execute message in JSON format..."
                {...form.register('executeMessage')}
                className="font-mono text-sm"
                rows={6}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Keep only the payload body. Wallet signing and base64 encoding
                are handled for you.
              </p>
              {defaultExample ? (
                <p className="text-sm text-muted-foreground">
                  The first live example, {defaultExample.name.toLowerCase()},
                  is already loaded.
                </p>
              ) : null}
              {form.formState.errors.executeMessage && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.executeMessage.message}
                </p>
              )}
            </div>

            <details className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background">
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    Optional funds
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Send axpla with this execute message
                  </p>
                </div>
              </summary>
              <div className="space-y-2 border-t border-border p-4">
                <Label htmlFor="funds">Funds (Optional)</Label>
                <Input
                  id="funds"
                  placeholder="1000000 (in axpla)"
                  {...form.register('funds')}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Amount in axpla (1 XPLA = 1,000,000 axpla)
                </p>
              </div>
            </details>

            {examples.length ? (
              <details className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background">
                <summary className="cursor-pointer list-none px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Change prefilled example
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {examples.length} live examples
                    </p>
                  </div>
                </summary>
                <div className="grid grid-cols-1 gap-3 border-t border-border p-4 md:grid-cols-2">
                  {examples.map((example) => (
                    <Button
                      key={example.name}
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample(example.payload)}
                      className="h-auto justify-start rounded-[calc(var(--radius)-0.2rem)] p-3 text-left"
                      disabled={isLoading}
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {example.name}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {example.description}
                        </div>
                        <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
                          {example.payload}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </details>
            ) : (
              <div className="rounded-[calc(var(--radius)-0.2rem)] border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                No standard execute examples were inferred for this contract.
                Use the raw JSON message field directly.
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !address || !connectedWallet}
            >
              {isLoading ? 'Executing...' : 'Execute contract'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {!connectedWallet && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Please connect your wallet to execute contracts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ExecuteContract
