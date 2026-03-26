import { BurnWrapper } from '@/components/feature/burn/burn-wrapper'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

export default function BurnPage() {
  return (
    <PageShell>
      <PageHero title="Burn" />
      <BurnWrapper />
    </PageShell>
  )
}
