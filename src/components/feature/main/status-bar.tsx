'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { NodeStatusInterface } from '@/lib/types/node-status.interface'

interface Props {
  history: NodeStatusInterface[]
}

export default function StatusBar({ history }: Props) {
  return (
    <div className="flex gap-1.5">
      {history.map((request, index) => (
        <Tooltip key={index}>
          <TooltipTrigger>
            <div
              className={`h-7 w-1.5 rounded-full ${
                request.success ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Height: {request.height}</p>
            <p>Response Time: {request.responseTime} ms</p>
          </TooltipContent>
        </Tooltip>
      ))}
      {!history.length ? (
        <div className="text-sm text-muted-foreground">Collecting samples...</div>
      ) : null}
    </div>
  )
}
