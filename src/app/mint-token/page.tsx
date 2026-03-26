import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MintCw20 from '@/components/feature/mint-token/mint-cw20'
import MintErc20 from '@/components/feature/mint-token/mint-erc20'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

const Page = () => {
  return (
    <PageShell>
      <PageHero title="Mint Token" />
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
    </PageShell>
  )
}

export default Page
