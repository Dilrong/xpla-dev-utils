import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MintCw20 from '@/components/feature/mint-token/mint-cw20'
import MintErc20 from '@/components/feature/mint-token/mint-erc20'

const Page = () => {
  return (
    <div className="container relative max-w-screen-2xl">
      <section className="py-6">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Mint
          </h1>
          <p className="text-lg text-muted-foreground">Mint Token in XPLA.</p>
        </div>
        <div className="space-y-2 pt-8">
          <Tabs defaultValue="cw20" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cw20">CW-20</TabsTrigger>
              <TabsTrigger value="erc20">ERC-20</TabsTrigger>
            </TabsList>
            <TabsContent value="cw20">
              <MintCw20 />
            </TabsContent>
            <TabsContent value="erc20">
              <MintErc20 />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default Page
