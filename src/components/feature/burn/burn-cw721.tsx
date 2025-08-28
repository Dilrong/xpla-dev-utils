'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import axios from 'axios'

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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useConfigStore } from '@/lib/store/config-store'
import { useConnectedWallet } from '@xpla/wallet-provider'
import { makeMsgCw721Burn } from '@/lib/xpla/contract/cw721'

const formSchema = z.object({
  contractAddress: z.string().min(1, {
    message: 'Contract address is required.',
  }),
  tokenId: z.string().min(1, {
    message: 'Token ID is required.',
  }),
})

export function BurnCw721() {
  const { toast } = useToast()
  const { explorer, lcd } = useConfigStore()
  const connectedWallet = useConnectedWallet()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractAddress: '',
      tokenId: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!connectedWallet) {
      toast({
        title: 'Wallet not connected',
        description: 'Wallet connection is required to burn NFT.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)

      const burnMsg = makeMsgCw721Burn(
        values.contractAddress,
        values.tokenId,
        connectedWallet.walletAddress,
      )

      // 트랜잭션 제출
      toast({
        title: 'Transaction submitted',
        description: 'Please wait while your transaction is being processed...',
      })

      const signTx = await connectedWallet.post({
        msgs: [burnMsg as any],
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
          title: `NFT #${values.tokenId} burned successfully! 🔥`,
          description: 'NFT has been completely removed from the blockchain.',
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
      console.error('Burn error:', err)

      let errorMessage = 'Failed to burn the NFT.'

      if (err instanceof Error) {
        if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds to burn the NFT.'
        } else if (err.message.includes('unauthorized')) {
          errorMessage = 'Unauthorized to burn this NFT.'
        } else if (err.message.includes('invalid')) {
          errorMessage = 'Invalid NFT parameters.'
        } else if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by user.'
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.'
        }
      }

      toast({
        title: 'NFT burn failed',
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
        <CardTitle>CW721 NFT Burn</CardTitle>
        <CardDescription>
          Burn CW721 NFT to remove it completely. Burned NFT cannot be
          recovered.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contractAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="xpla1..."
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
              name="tokenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token ID</FormLabel>
                  <FormControl>
                    <Input placeholder="1" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Burning...' : 'Burn NFT'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
