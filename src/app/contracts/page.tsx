import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SearchContract from '@/components/feature/contracts/search-contract'
import QueryContract from '@/components/feature/contracts/query-contract'

const Page = () => {
  return (
    <div className="container relative max-w-screen-2xl">
      <section className="py-6">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Contracts
          </h1>
          <p className="text-lg text-muted-foreground">
            Interact with contracts on the XPLA.
          </p>
        </div>
        <div className="space-y-2 pt-4">
          <SearchContract />
          <Tabs defaultValue="query" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="execute">Execute</TabsTrigger>
            </TabsList>
            <TabsContent value="query">
              <QueryContract />
            </TabsContent>
            <TabsContent value="execute"></TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default Page
