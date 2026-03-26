import Link from 'next/link'
import {
  ArrowRight,
  Blocks,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageHero, PageShell } from '@/components/feature/common/page-shell'
import LcdStatusWrapper from '@/components/feature/main/lcd-status-wrapper'
import { getNetworkConfig, Network } from '@/lib/config/block-chain'
import RpcStatusWrapper from '@/components/feature/main/rpc-status-wrapper'
import FcdStatusWrapper from '@/components/feature/main/fcd-status-wrapper'
import { menuConfig } from '@/lib/config/menu'
import packageJson from '../../package.json'

type SdkDependency = '@xpla/xpla.js' | '@xpla/wallet-provider'

function getDependencyVersion(packageName: SdkDependency) {
  return packageJson.dependencies[packageName].replace(/^[^\d]*/, '')
}

export default function Home() {
  const networkCards = [
    {
      title: 'Mainnet',
      description: 'dimension_37-1 production surface.',
      network: Network.mainnet,
      icon: ShieldCheck,
    },
    {
      title: 'Testnet',
      description: 'cube_47-5 staging surface.',
      network: Network.testnet,
      icon: Sparkles,
    },
  ]

  return (
    <PageShell>
      <PageHero
        eyebrow="Operator Grid"
        title="XPLA developer utilities built for fast technical decisions"
        description="Check endpoint health, inspect chain data, query contracts, and move between core XPLA workflows from one consistent operational surface."
        actions={
          <>
            <Link
              href="/contracts"
              className="inline-flex items-center gap-2 rounded-[calc(var(--radius)-0.2rem)] border border-primary bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open Contracts
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/validators"
              className="inline-flex items-center gap-2 rounded-[calc(var(--radius)-0.2rem)] border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
            >
              Check Validators
              <ShieldCheck className="size-4" />
            </Link>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card className="overflow-hidden border-border bg-card">
          <CardHeader className="border-b border-border">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Workflow index
            </p>
            <CardTitle className="mt-3 flex items-center gap-2 text-3xl">
              <Blocks className="size-5" />
              What you can do here
            </CardTitle>
            <CardDescription>
              Direct entry points into the chain, contract, token, and
              conversion workflows exposed by this app.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {menuConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href || '/'}
                className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background p-4 transition-colors hover:border-primary/20 hover:bg-primary/10"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.title}
                </p>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              SDK baseline
            </p>
            <CardTitle className="mt-3 flex items-center gap-2 text-3xl">
              <ScrollText className="size-5" />
              Current SDK baseline
            </CardTitle>
            <CardDescription>
              Fixed to the current XPLA package line used by this utility
              surface.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/45 px-4 py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                @xpla/xpla.js
              </p>
              <p className="mt-3 text-4xl font-semibold">
                {getDependencyVersion('@xpla/xpla.js')}
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)-0.2rem)] border border-border bg-secondary/45 px-4 py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                @xpla/wallet-provider
              </p>
              <p className="mt-3 text-4xl font-semibold">
                {getDependencyVersion('@xpla/wallet-provider')}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        {networkCards.map(({ title, description, network, icon: Icon }) => (
          <section key={network} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-[calc(var(--radius)-0.2rem)] border border-primary/20 bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Endpoint band
                </p>
                <h2 className="text-3xl">{title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
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
