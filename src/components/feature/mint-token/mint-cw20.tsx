'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useConfigStore } from '@/lib/store/config-store'
import { useConnectedWallet } from '@xpla/wallet-provider'
import { cw20CodeId, makeMsgCw20Instantiate } from '@/lib/xpla/contract/cw20'
import axios from 'axios'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  symbol: z.string().min(2, {
    message: 'Symbol must be at least 2 characters.',
  }),
})

const MintCw20 = () => {
  const { toast } = useToast()
  const { explorer, lcd } = useConfigStore()
  const connectedWallet = useConnectedWallet()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      symbol: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!connectedWallet) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to create tokens.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)

      const executeMsg = {
        name: values.name,
        symbol: values.symbol,
        decimals: 6,
        initial_balances: [
          {
            address: connectedWallet.walletAddress,
            amount: '10000000000000',
          },
        ],
        mint: {
          minter: connectedWallet.walletAddress,
          gap: '10000000000000',
          marketing: connectedWallet.walletAddress,
        },
      }

      const instantiateMsg = makeMsgCw20Instantiate(
        executeMsg,
        cw20CodeId,
        values.name,
        connectedWallet.walletAddress,
      )

      // 트랜잭션 제출
      toast({
        title: 'Transaction submitted',
        description: 'Please wait while your transaction is being processed...',
      })

      const signTx = await connectedWallet.post({
        msgs: [instantiateMsg as any],
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
          title: 'Token created successfully',
          description: 'Your CW20 token has been deployed to the blockchain.',
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
      console.error('Mint error:', err)

      let errorMessage = 'Failed to create the token.'

      if (err instanceof Error) {
        if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds to create the token.'
        } else if (err.message.includes('unauthorized')) {
          errorMessage = 'Unauthorized to create tokens.'
        } else if (err.message.includes('invalid')) {
          errorMessage = 'Invalid token parameters.'
        } else if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by user.'
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.'
        }
      }

      toast({
        title: 'Token creation failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create CW-20 Token</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Token"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="MTK" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating token...' : 'Create CW-20 Token'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default MintCw20
