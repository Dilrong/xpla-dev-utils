import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import XplaConvert from '@/components/feature/converts/xpla-convert'
import EpochConvert from '@/components/feature/converts/epoch-convert'
import Base64Convert from '@/components/feature/converts/base64-convert'

const Page = () => {
  return (
    <div className="container relative max-w-screen-2xl">
      <section className="py-6">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Convert
          </h1>
          <p className="text-lg text-muted-foreground">
            Calculate the units involved in XPLA.
          </p>
        </div>
        <div className="space-y-2 pt-8">
          <Tabs defaultValue="axpla" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="axpla">aXPLA</TabsTrigger>
              <TabsTrigger value="epoch">Epoch</TabsTrigger>
              <TabsTrigger value="base64">Base64</TabsTrigger>
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
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default Page
