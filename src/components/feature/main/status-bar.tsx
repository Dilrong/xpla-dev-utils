'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { NodeStatusInterface } from '@/lib/types/node-status.interface'

interface Props {
  history: NodeStatusInterface[]
}

export default function StatusBar({ history }: Props) {
  return (
    <div className="flex">
      {history.map((request, index) => (
        <Tooltip key={index}>
          <TooltipTrigger>
            <div
              key={index}
              className={`mr-1 h-6 w-1 ${
                request.success ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Height: {request.height}</p>
            <p>Response Time: {request.responseTime} ms</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
