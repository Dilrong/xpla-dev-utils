'use client'

import { Blocks, SearchCode, Waypoints } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AccountInspector from '@/components/feature/cosmos/account-inspector'
import AddressLab from '@/components/feature/cosmos/address-lab'
import ChainOverview from '@/components/feature/cosmos/chain-overview'

export default function CosmosTools() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-2xl bg-muted/70 p-2 md:grid-cols-3">
        <TabsTrigger
          value="account"
          className="gap-2 rounded-xl px-4 py-3 data-[state=active]:bg-background"
        >
          <SearchCode className="size-4" />
          Account Inspector
        </TabsTrigger>
        <TabsTrigger
          value="address"
          className="gap-2 rounded-xl px-4 py-3 data-[state=active]:bg-background"
        >
          <Waypoints className="size-4" />
          Address Lab
        </TabsTrigger>
        <TabsTrigger
          value="chain"
          className="gap-2 rounded-xl px-4 py-3 data-[state=active]:bg-background"
        >
          <Blocks className="size-4" />
          Chain Overview
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <AccountInspector />
      </TabsContent>
      <TabsContent value="address">
        <AddressLab />
      </TabsContent>
      <TabsContent value="chain">
        <ChainOverview />
      </TabsContent>
    </Tabs>
  )
}
