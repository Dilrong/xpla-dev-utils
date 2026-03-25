import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: ReactNode
  className?: string
}

interface PageHeroProps {
  title: string
  description: string
  eyebrow?: string
  actions?: ReactNode
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('container relative max-w-screen-2xl py-8 md:py-10', className)}>
      <div className="space-y-8">{children}</div>
    </div>
  )
}

export function PageHero({
  title,
  description,
  eyebrow,
  actions,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/75 px-6 py-8 shadow-sm backdrop-blur md:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent-foreground)/0.08),_transparent_30%)]" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          {eyebrow ? (
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary/80">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}
