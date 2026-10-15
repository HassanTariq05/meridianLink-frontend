import { useState } from 'react'
import { Check, Copy, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function MessageActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const copyMessage = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <div className='flex items-center gap-1 pt-1'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-7'
            onClick={copyMessage}
          >
            {copied ? (
              <Check className='size-3.5' />
            ) : (
              <Copy className='size-3.5' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? 'Copied' : 'Copy'}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-7'
          >
            <MoreHorizontal className='size-3.5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>More</TooltipContent>
      </Tooltip>
    </div>
  )
}
