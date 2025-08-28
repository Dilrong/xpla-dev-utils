import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MintCw721 } from '@/components/feature/mint-nft/mint-cw721'
import MintErc721 from '@/components/feature/mint-nft/mint-erc721'

const Page = () => {
  return (
    <div className="container relative max-w-screen-2xl">
      <section className="py-6">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Mint
          </h1>
          <p className="text-lg text-muted-foreground">Mint NFT in XPLA.</p>
        </div>
        <div className="space-y-2 pt-8">
          <Tabs defaultValue="cw721" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cw721">CW-721</TabsTrigger>
              <TabsTrigger value="erc721">ERC-721</TabsTrigger>
            </TabsList>
            <TabsContent value="cw721">
              <MintCw721 />
            </TabsContent>
            <TabsContent value="erc721">
              <MintErc721 />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default Page
