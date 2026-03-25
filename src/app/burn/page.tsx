import { BurnWrapper } from '@/components/feature/burn/burn-wrapper'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'

export default function BurnPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Supply Control"
        title="Burn assets on XPLA"
        description="Reduce supply or retire assets permanently with guided burn flows for both CW20 and CW721 contracts."
      />
      <BurnWrapper />
    </PageShell>
  )
}
