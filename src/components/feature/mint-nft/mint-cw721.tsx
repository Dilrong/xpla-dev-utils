'use client'

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
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { useConfigStore } from '@/lib/store/config-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConnectedWallet } from '@xpla/wallet-provider'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import instantiateCw721 from './helpers/instantiate-cw721'
import mintCw721 from './helpers/mint-cw721'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  symbol: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  tokenId: z.string().min(1, {
    message: 'name must be at least 1 characters.',
  }),
  tokenUri: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  image: z.string(),
})

const MintCw721 = () => {
  const { toast } = useToast()
  const { explorer } = useConfigStore()

  const router = useRouter()
  const connectedWallet = useConnectedWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!connectedWallet) {
        toast({
          title: 'not connect wallet',
          description: 'wallet connection is required to mint token',
        })
        return
      }

      const contractAddress = await instantiateCw721(
        values.name,
        values.symbol,
        connectedWallet,
        toast,
      )
      if (!contractAddress) {
        console.error('contractAddress is undefined')
        return
      }

      const txHash = mintCw721(
        contractAddress,
        values.name,
        values.description,
        values.image,
        values.tokenId,
        values.tokenUri,
        connectedWallet,
        toast,
      )

      toast({
        title: `Minted ${values.name}`,
        description: `Make it useful`,
        action: (
          <ToastAction
            onClick={() => {
              router.push(`${explorer}tx/${txHash}`)
            }}
            altText="Check"
          >
            Check
          </ToastAction>
        ),
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
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
                <FormLabel>Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="symbol" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="description" {...field} />
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
                <FormLabel>TokenId</FormLabel>
                <FormControl>
                  <Input placeholder="tokenId" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tokenUri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TokenUri</FormLabel>
                <FormControl>
                  <Input placeholder="tokenUri" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input placeholder="image" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Mint NFT
          </Button>
        </form>
      </Form>
    </>
  )
}

export default MintCw721
