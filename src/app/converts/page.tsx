import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import XplaConvert from '@/components/feature/converts/xpla-convert'
import EpochConvert from '@/components/feature/converts/epoch-convert'
import Base64Convert from '@/components/feature/converts/base64-convert'
import IpfsConvert from '@/components/feature/converts/ipfs-convert'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

const Page = () => {
  return (
    <PageShell>
      <PageHero title="Converters" />
      <Tabs defaultValue="axpla" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-xl border border-border bg-card p-2 md:grid-cols-4">
          <TabsTrigger value="axpla">aXPLA</TabsTrigger>
          <TabsTrigger value="epoch">Epoch</TabsTrigger>
          <TabsTrigger value="base64">Base64</TabsTrigger>
          <TabsTrigger value="ipfs">IPFS</TabsTrigger>
        </TabsList>
        <TabsContent value="axpla" className="mt-5">
          <XplaConvert />
        </TabsContent>
        <TabsContent value="epoch" className="mt-5">
          <EpochConvert />
        </TabsContent>
        <TabsContent value="base64" className="mt-5">
          <Base64Convert />
        </TabsContent>
        <TabsContent value="ipfs" className="mt-5">
          <IpfsConvert />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

export default Page
