import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SearchContract from '@/components/feature/contracts/search-contract'
import QueryContract from '@/components/feature/contracts/query-contract'
import ExecuteContract from '@/components/feature/contracts/execute-contract'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

const Page = () => {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contract Workbench"
        title="Query and execute contracts"
        description="Search a contract once, then inspect state or post execute messages against the selected address."
      />
      <div className="space-y-4">
        <SearchContract />
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="execute">Execute</TabsTrigger>
          </TabsList>
          <TabsContent value="query">
            <QueryContract />
          </TabsContent>
          <TabsContent value="execute">
            <ExecuteContract />
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  )
}

export default Page
