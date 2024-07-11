'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { cw20CodeId, makeMsgCw20Instantiate } from '@/lib/xpla/contract/cw20'
import { Cw20InstantiateMsg } from '@/lib/xpla/interface/cw20.interface'
import { MsgInstantiateContractV1 } from '@xpla/xpla.js'
import { useConnectedWallet } from '@xpla/wallet-provider'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { useConfigStore } from '@/lib/store/config-store'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
  symbol: z.string().min(2, {
    message: 'symbol must be at least 2 characters.',
  }),
})

const MintCw20 = () => {
  const { toast } = useToast()
  const { explorer } = useConfigStore()

  const router = useRouter()
  const connectedWallet = useConnectedWallet()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      symbol: '',
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

      const transactionMsg = {
        msgs: [
          makeMsg(values.name, values.symbol, connectedWallet.walletAddress),
        ],
      }

      const signTx = await connectedWallet.post(transactionMsg)
      const txHash = signTx.result.txhash

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

  function makeMsg(
    name: string,
    symbol: string,
    minter: string,
  ): MsgInstantiateContractV1 {
    const executeMsg: Cw20InstantiateMsg = {
      name: name,
      symbol: symbol,
      decimals: 6,
      initial_balances: [
        {
          address: minter,
          amount: '10000000000000',
        },
      ],
    }

    return makeMsgCw20Instantiate(executeMsg, cw20CodeId, name, minter)
  }

  return (
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
        <Button className="w-full" type="submit">
          Mint Token
        </Button>
      </form>
    </Form>
  )
}

export default MintCw20
