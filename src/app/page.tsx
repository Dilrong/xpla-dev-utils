import Link from 'next/link'
import { ArrowRight, Blocks, ScrollText, ShieldCheck, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'
import LcdStatusWrapper from '@/components/feature/main/lcd-status-wrapper'
import { getNetworkConfig, Network } from '@/lib/config/block-chain'
import RpcStatusWrapper from '@/components/feature/main/rpc-status-wrapper'
import FcdStatusWrapper from '@/components/feature/main/fcd-status-wrapper'
import { menuConfig } from '@/lib/config/menu'

export default function Home() {
  const networkCards = [
    {
      title: 'Mainnet',
      description: 'Production endpoints for dimension_37-1.',
      network: Network.mainnet,
      icon: ShieldCheck,
    },
    {
      title: 'Testnet',
      description: 'Cube staging endpoints for fast validation.',
      network: Network.testnet,
      icon: Sparkles,
    },
  ]

  return (
    <PageShell>
      <PageHero
        eyebrow="Realtime Ops Surface"
        title="XPLA developer utilities without the tab sprawl"
        description="Monitor endpoint health, inspect chain data, search contracts, and execute common XPLA workflows from one place. The dashboard below keeps mainnet and testnet visibility side by side."
        actions={
          <>
            <Link
              href="/contracts"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Open Contracts
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/validators"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Check Validators
              <ShieldCheck className="size-4" />
            </Link>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card className="overflow-hidden border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Blocks className="size-5" />
              What you can do here
            </CardTitle>
            <CardDescription>
              Fast links into the core workflows this app exposes today.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {menuConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href || '/'}
                className="rounded-2xl border border-border/70 bg-background/70 p-4 transition-colors hover:bg-secondary"
              >
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ScrollText className="size-5" />
              Current SDK baseline
            </CardTitle>
            <CardDescription>
              Refreshed to the current XPLA package line for ongoing work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">@xpla/xpla.js</p>
              <p className="mt-2 text-3xl font-semibold">1.9.0</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">@xpla/wallet-provider</p>
              <p className="mt-2 text-3xl font-semibold">1.7.3</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        {networkCards.map(({ title, description, network, icon: Icon }) => (
          <section key={network} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              <LcdStatusWrapper
                title={`${title} LCD`}
                url={getNetworkConfig(network).lcd}
              />
              <RpcStatusWrapper
                title={`${title} RPC`}
                url={getNetworkConfig(network).rpc}
              />
              <FcdStatusWrapper
                title={`${title} FCD`}
                url={getNetworkConfig(network).fcd}
              />
            </div>
          </section>
        ))}
      </section>
    </PageShell>
  )
}
