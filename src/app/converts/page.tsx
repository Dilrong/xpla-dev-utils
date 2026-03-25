import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import XplaConvert from '@/components/feature/converts/xpla-convert'
import EpochConvert from '@/components/feature/converts/epoch-convert'
import Base64Convert from '@/components/feature/converts/base64-convert'
import IpfsConvert from '@/components/feature/converts/ipfs-convert'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

const Page = () => {
  return (
    <PageShell>
      <PageHero
        eyebrow="Converters"
        title="Utility conversions for daily XPLA work"
        description="Switch between chain units, human time, Base64 payloads, and IPFS references from one compact toolbox."
      />
      <Tabs defaultValue="axpla" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="axpla">aXPLA</TabsTrigger>
          <TabsTrigger value="epoch">Epoch</TabsTrigger>
          <TabsTrigger value="base64">Base64</TabsTrigger>
          <TabsTrigger value="ipfs">IPFS</TabsTrigger>
        </TabsList>
        <TabsContent value="axpla">
          <XplaConvert />
        </TabsContent>
        <TabsContent value="epoch">
          <EpochConvert />
        </TabsContent>
        <TabsContent value="base64">
          <Base64Convert />
        </TabsContent>
        <TabsContent value="ipfs">
          <IpfsConvert />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

export default Page
