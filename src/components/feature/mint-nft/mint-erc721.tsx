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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { useConfigStore } from '@/lib/store/config-store'
import { useConnectedWallet } from '@xpla/wallet-provider'
import { useRouter } from 'next/navigation'
import {
  erc721CodeId,
  makeMsgErc721Instantiate,
} from '@/lib/xpla/contract/erc721'
import { Erc721InstantiateMsg } from '@/lib/xpla/interface/erc721.interface'
import { MsgInstantiateContractV1 } from '@xpla/xpla.js'
import { Loader2, Image } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  symbol: z.string().min(2, {
    message: 'Symbol must be at least 2 characters.',
  }),
  label: z.string().min(2, {
    message: 'Label must be at least 2 characters.',
  }),
})

const MintErc721 = () => {
  const { toast } = useToast()
  const { explorer } = useConfigStore()
  const router = useRouter()
  const connectedWallet = useConnectedWallet()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      symbol: '',
      label: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!connectedWallet) {
        toast({
          title: 'Wallet not connected',
          description:
            'Wallet connection is required to create ERC-721 NFT contract.',
          variant: 'destructive',
        })
        return
      }

      setIsLoading(true)

      const executeMsg: Erc721InstantiateMsg = {
        name: values.name,
        symbol: values.symbol,
        minter: connectedWallet.walletAddress,
      }

      const transactionMsg = {
        msgs: [
          makeMsgErc721Instantiate(
            executeMsg,
            erc721CodeId,
            values.label,
            connectedWallet.walletAddress,
          ),
        ],
      }

      const signTx = await connectedWallet.post(transactionMsg as any)
      const txHash = signTx.result.txhash

      toast({
        title: `ERC-721 NFT Contract ${values.name} Created`,
        description:
          'Your ERC-721 NFT contract has been successfully deployed.',
        action: (
          <ToastAction
            onClick={() => {
              router.push(`${explorer}tx/${txHash}`)
            }}
            altText="Check"
          >
            View Transaction
          </ToastAction>
        ),
      })

      form.reset()
    } catch (err) {
      console.error(err)
      toast({
        title: 'NFT contract creation failed',
        description: 'Failed to create ERC-721 NFT contract.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="size-5" />
          Create ERC-721 NFT Contract
        </CardTitle>
        <CardDescription>
          Deploy a new ERC-721 NFT contract on XPLA blockchain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My NFT Collection"
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
                  <FormLabel>Collection Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="MNFT" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-erc721-nft"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating NFT Contract...
                </>
              ) : (
                'Create ERC-721 NFT Contract'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default MintErc721
