import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MintCw721 } from '@/components/feature/mint-nft/mint-cw721'
import MintErc721 from '@/components/feature/mint-nft/mint-erc721'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

const Page = () => {
  return (
    <PageShell>
      <PageHero title="Mint NFT" />
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
    </PageShell>
  )
}

export default Page
