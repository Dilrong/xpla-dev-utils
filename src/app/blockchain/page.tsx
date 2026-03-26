import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockInfo } from '@/components/feature/blockchain/block-info'
import { TransactionInfo } from '@/components/feature/blockchain/transaction-info'
import { ValidatorInfo } from '@/components/feature/blockchain/validator-info'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

const Page = () => {
  return (
    <PageShell>
      <PageHero
        eyebrow="Chain Explorer"
        title="Blockchain lookup tools"
        description="Inspect live blocks, search transaction receipts, and review validator records without leaving the app."
      />
      <Tabs defaultValue="blocks" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-xl border border-border bg-card p-2 md:grid-cols-3">
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="validators">Validators</TabsTrigger>
        </TabsList>
        <TabsContent value="blocks" className="mt-5">
          <BlockInfo />
        </TabsContent>
        <TabsContent value="transactions" className="mt-5">
          <TransactionInfo />
        </TabsContent>
        <TabsContent value="validators" className="mt-5">
          <ValidatorInfo />
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

export default Page
