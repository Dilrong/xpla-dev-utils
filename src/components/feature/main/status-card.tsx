import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NodeStatusInterface } from '@/lib/types/node-status.interface'
import StatusBar from './status-bar'
import { ChevronDown } from 'lucide-react'

interface Props {
  title: string
  serviceLabel: string
  summary: string
  url: string
  history: NodeStatusInterface[]
  lastUpdated: number | null
}

export default function StatusCard({
  title,
  serviceLabel,
  summary,
  url,
  history,
  lastUpdated,
}: Props) {
  const lastSample = history[history.length - 1]
  const healthLabel = !history.length
    ? 'Collecting'
    : lastSample?.success
      ? 'Healthy'
      : 'Retrying'

  return (
    <Card className="overflow-hidden border-border/80 bg-card/95">
      <CardHeader className="gap-4 border-b border-border/70 bg-secondary/35">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {serviceLabel}
            </p>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
              lastSample?.success
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-border bg-background text-muted-foreground'
            }`}
          >
            {healthLabel}
          </span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <p className="text-lg font-semibold text-foreground">{summary}</p>
          <p className="shrink-0 text-sm text-muted-foreground">
            {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '-'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <details className="group rounded-[calc(var(--radius)-0.2rem)] border border-border bg-background/70 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground">
            View endpoint details
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-4 space-y-3">
            <p className="break-all text-xs leading-5 text-muted-foreground">
              {url}
            </p>
            <StatusBar history={history} />
          </div>
        </details>
      </CardContent>
    </Card>
  )
}
