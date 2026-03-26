import type { Metadata } from 'next'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'
import CosmosTools from '@/components/feature/cosmos/cosmos-tools'

export const metadata: Metadata = {
  title: 'Cosmos Tools',
  description:
    'Developer-focused Cosmos account, address, and chain inspection tools for XPLA.',
}

export default function CosmosPage() {
  return (
    <PageShell>
      <PageHero title="Cosmos" />
      <CosmosTools />
    </PageShell>
  )
}
