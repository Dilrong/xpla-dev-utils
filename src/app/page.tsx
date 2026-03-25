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
        eyebrow="Operational Surface"
        title="A monochrome control room for daily XPLA development"
        description="Monitor endpoints, inspect chain state, search contracts, and move between mainnet or testnet workflows without context switching. The layout keeps structure explicit and noise low."
        actions={
          <>
            <Link
              href="/contracts"
              className="inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background transition-colors hover:bg-background hover:text-foreground"
            >
              Open Contracts
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/validators"
              className="inline-flex items-center gap-2 border-2 border-foreground bg-background px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Check Validators
              <ShieldCheck className="size-4" />
            </Link>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card className="overflow-hidden border-foreground bg-card">
          <CardHeader className="border-b-2 border-foreground">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
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
                className="border-2 border-foreground bg-background p-4 transition-colors hover:bg-foreground hover:text-background"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-foreground bg-foreground text-background">
          <CardHeader className="border-b-2 border-background/25">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-background/60">
              SDK baseline
            </p>
            <CardTitle className="mt-3 flex items-center gap-2 text-3xl text-background">
              <ScrollText className="size-5" />
              Current SDK baseline
            </CardTitle>
            <CardDescription className="text-background/70">
              Fixed to the current XPLA package line used by this utility
              surface.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-background/25 bg-background px-4 py-5 text-foreground">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                @xpla/xpla.js
              </p>
              <p className="mt-3 text-4xl font-semibold">1.9.0</p>
            </div>
            <div className="border-2 border-background/25 bg-background px-4 py-5 text-foreground">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                @xpla/wallet-provider
              </p>
              <p className="mt-3 text-4xl font-semibold">1.7.3</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        {networkCards.map(({ title, description, network, icon: Icon }) => (
          <section
            key={network}
            className="space-y-4 border-t-4 border-foreground pt-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center border-2 border-foreground bg-foreground text-background">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
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
