import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockInfo } from '@/components/feature/blockchain/block-info'
import { TransactionInfo } from '@/components/feature/blockchain/transaction-info'
import { ValidatorInfo } from '@/components/feature/blockchain/validator-info'

const Page = () => {
  return (
    <div className="container relative max-w-screen-2xl">
      <section className="py-6">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            Blockchain Info
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore XPLA blockchain information including blocks, transactions,
            and validators.
          </p>
        </div>
        <div className="space-y-2 pt-4">
          <Tabs defaultValue="blocks" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="blocks">Blocks</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="validators">Validators</TabsTrigger>
            </TabsList>
            <TabsContent value="blocks">
              <BlockInfo />
            </TabsContent>
            <TabsContent value="transactions">
              <TransactionInfo />
            </TabsContent>
            <TabsContent value="validators">
              <ValidatorInfo />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default Page
