'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BurnCw20 } from './burn-cw20'
import { BurnCw721 } from './burn-cw721'

export function BurnWrapper() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="cw20" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cw20">CW20 Token Burn</TabsTrigger>
          <TabsTrigger value="cw721">CW721 NFT Burn</TabsTrigger>
        </TabsList>

        <TabsContent value="cw20" className="space-y-4">
          <BurnCw20 />
        </TabsContent>

        <TabsContent value="cw721" className="space-y-4">
          <BurnCw721 />
        </TabsContent>
      </Tabs>
    </div>
  )
}
