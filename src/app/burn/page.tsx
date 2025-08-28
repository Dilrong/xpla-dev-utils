import { BurnWrapper } from '@/components/feature/burn/burn-wrapper'

export default function BurnPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Burn</h1>
        <p className="text-muted-foreground">
          Burn tokens and NFTs to reduce supply or remove them completely.
        </p>
      </div>
      <BurnWrapper />
    </div>
  )
}
