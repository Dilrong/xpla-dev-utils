'use client'

import { useState } from 'react'
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
import { Loader2, Play, Copy, CheckCircle, Zap } from 'lucide-react'
import { bytesToBase64 } from '@/lib/utils'
import { MsgExecuteContract, Coin } from '@xpla/xpla.js'
import axios from 'axios' // Added axios import

const formSchema = z.object({
  funds: z.string().optional(),
  executeMessage: z.string().min(1, 'Execute message is required'),
})

type FormData = z.infer<typeof formSchema>

const ExecuteContract = () => {
  const { toast } = useToast()
  const { explorer, lcd } = useConfigStore() // Added lcd to useConfigStore
  const { address } = useContractStore()
  const connectedWallet = useConnectedWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      funds: '',
      executeMessage:
        '{"transfer":{"recipient":"xpla1...","amount":"1000000"}}',
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

    // 주소 형식 검증
    if (!address.startsWith('xpla1')) {
      toast({
        title: 'Invalid contract address',
        description: 'Contract address must be a valid XPLA address.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)

      // JSON 메시지 유효성 검증
      let parsedMessage
      try {
        parsedMessage = JSON.parse(data.executeMessage)
      } catch (parseError) {
        toast({
          title: 'Invalid JSON format',
          description: 'Please check your execute message format.',
          variant: 'destructive',
        })
        return
      }

      // Convert message to base64
      const utf8Bytes = new TextEncoder().encode(data.executeMessage)
      const base64Message = bytesToBase64(utf8Bytes)

      // Prepare funds if provided
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

      // Create MsgExecuteContract
      const executeMsg = new MsgExecuteContract(
        connectedWallet.walletAddress,
        address,
        parsedMessage,
        funds,
      )

      // 트랜잭션 제출
      toast({
        title: 'Transaction submitted',
        description: 'Please wait while your transaction is being processed...',
      })

      const signTx = await connectedWallet.post({
        msgs: [executeMsg as any],
      })

      const txHash = signTx.result.txhash

      // 트랜잭션 처리 대기
      toast({
        title: 'Transaction submitted successfully',
        description: 'Waiting for transaction confirmation...',
      })

      // 트랜잭션 상태 확인 (최대 30초 대기)
      let txConfirmed = false
      let attempts = 0
      const maxAttempts = 30

      while (!txConfirmed && attempts < maxAttempts) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000)) // 1초 대기

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
        } catch (error) {
          attempts++
          // 에러가 발생해도 계속 시도
        }
      }

      if (txConfirmed) {
        toast({
          title: 'Transaction confirmed! 🎉',
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
        // 타임아웃 시에도 성공으로 처리 (트랜잭션이 제출되었으므로)
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

      // Reset form
      form.reset()
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
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const examples = [
    {
      name: 'Transfer Tokens',
      message: '{"transfer":{"recipient":"xpla1...","amount":"1000000"}}',
      description: 'Transfer tokens to another address',
    },
    {
      name: 'Mint NFT',
      message:
        '{"mint":{"token_id":"1","owner":"xpla1...","token_uri":"https://..."}}',
      description: 'Mint a new NFT',
    },
    {
      name: 'Approve',
      message: '{"approve":{"spender":"xpla1...","amount":"500000"}}',
      description: 'Approve spending of tokens',
    },
    {
      name: 'Send NFT',
      message:
        '{"send_nft":{"contract":"xpla1...","token_id":"1","msg":"base64_encoded_msg"}}',
      description: 'Send NFT to another contract',
    },
    {
      name: 'Update Admin',
      message: '{"update_admin":{"admin":"xpla1..."}}',
      description: 'Update contract admin',
    },
    // ERC20 Examples
    {
      name: 'ERC20 Transfer',
      message: '{"transfer":{"recipient":"xpla1...","amount":"1000000"}}',
      description: 'ERC20 token transfer',
    },
    {
      name: 'ERC20 Approve',
      message: '{"approve":{"spender":"xpla1...","amount":"1000000"}}',
      description: 'ERC20 approve spending',
    },
    {
      name: 'ERC20 Mint',
      message: '{"mint":{"recipient":"xpla1...","amount":"1000000"}}',
      description: 'ERC20 mint new tokens',
    },
    {
      name: 'ERC20 Burn',
      message: '{"burn":{"amount":"1000000"}}',
      description: 'ERC20 burn tokens',
    },
    // ERC721 Examples
    {
      name: 'ERC721 Mint',
      message:
        '{"mint":{"token_id":"1","owner":"xpla1...","token_uri":"https://..."}}',
      description: 'ERC721 mint new NFT',
    },
    {
      name: 'ERC721 Transfer',
      message:
        '{"transfer":{"from":"xpla1...","to":"xpla1...","token_id":"1"}}',
      description: 'ERC721 transfer NFT',
    },
    {
      name: 'ERC721 Approve',
      message: '{"approve":{"to":"xpla1...","token_id":"1"}}',
      description: 'ERC721 approve NFT transfer',
    },
    {
      name: 'ERC721 Burn',
      message: '{"burn":{"token_id":"1"}}',
      description: 'ERC721 burn NFT',
    },
  ]

  const loadExample = (message: string) => {
    form.setValue('executeMessage', message)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5" />
            Contract Execute
          </CardTitle>
          <CardDescription>
            Execute smart contract functions. The message will be automatically
            converted to base64.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contract-address">Contract Address</Label>
              <Input
                id="contract-address"
                value={address || ''}
                placeholder="Search for a contract first..."
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
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
                  {copied ? (
                    <>
                      <CheckCircle className="mr-1 size-3 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 size-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="execute-message"
                placeholder="Enter your execute message in JSON format..."
                {...form.register('executeMessage')}
                className="font-mono text-sm"
                rows={4}
                disabled={isLoading}
              />
              {form.formState.errors.executeMessage && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.executeMessage.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !address || !connectedWallet}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="mr-2 size-4" />
                  Execute Contract
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>
            Click on an example to load it into the form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => loadExample(example.message)}
                className="h-auto justify-start p-3 text-left"
                disabled={isLoading}
              >
                <div>
                  <div className="text-sm font-medium">{example.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {example.description}
                  </div>
                  <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
                    {example.message}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {!connectedWallet && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              Please connect your wallet to execute contracts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ExecuteContract
