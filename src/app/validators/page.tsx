import type { Metadata } from 'next'
import ValidatorConsensus from '@/components/feature/blockchain/validator-consensus'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

export const metadata: Metadata = {
  title: 'Validators',
  description: 'Track XPLA validator consensus data and upgrade schedules.',
}

export default function ValidatorsPage() {
  return (
    <PageShell>
      <PageHero title="Validators" />
      <ValidatorConsensus />
    </PageShell>
  )
}
