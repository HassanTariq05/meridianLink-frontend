import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      className='h-7 gap-1.5 px-2 text-xs'
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className='size-3.5' />
          Copied
        </>
      ) : (
        <>
          <Copy className='size-3.5' />
          Copy
        </>
      )}
    </Button>
  )
}
