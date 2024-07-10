import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import XplaConvert from '@/components/feature/converts/xpla-convert'
import EpochConvert from '@/components/feature/converts/epoch-convert'

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
          <Tabs defaultValue="axpla" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cw721">CW-721</TabsTrigger>
              <TabsTrigger value="erc721">ERC-721</TabsTrigger>
            </TabsList>
            <TabsContent value="cw721">
              <XplaConvert />
            </TabsContent>
            <TabsContent value="erc721">
              <EpochConvert />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default Page
