import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  content: ReactNode
  footer: ReactNode
}

export default function StatusCard({ title, content, footer }: Props) {
  return (
    <Card className={cn('overflow-hidden border-border/80 bg-card/95')}>
      <CardHeader className="gap-3 border-b border-border/70 bg-secondary/45">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Endpoint status
        </p>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter className="border-t border-border/60 bg-background/70">
        {footer}
      </CardFooter>
    </Card>
  )
}
