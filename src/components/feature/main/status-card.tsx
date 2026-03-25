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
    <Card className={cn('overflow-hidden border-border/70 bg-card/80 shadow-sm')}>
      <CardHeader className="border-b border-border/60 bg-muted/30">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter className="border-t border-border/60 bg-muted/10">
        {footer}
      </CardFooter>
    </Card>
  )
}
