import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SearchContract from '@/components/feature/contracts/search-contract'
import QueryContract from '@/components/feature/contracts/query-contract'
import ExecuteContract from '@/components/feature/contracts/execute-contract'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

const Page = () => {
  return (
    <PageShell>
      <PageHero title="Contracts" />
      <div className="space-y-4">
        <SearchContract />
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-xl border border-border bg-card p-2 md:grid-cols-2">
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="execute">Execute</TabsTrigger>
          </TabsList>
          <TabsContent value="query" className="mt-5">
            <QueryContract />
          </TabsContent>
          <TabsContent value="execute" className="mt-5">
            <ExecuteContract />
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  )
}

export default Page
