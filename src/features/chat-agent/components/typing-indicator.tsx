import { Sparkles } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className='flex items-center gap-2 px-1 py-2'>
      <div className='relative flex size-5 shrink-0 items-center justify-center'>
        <span className='absolute inset-0 animate-ping rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-40' />
        <span className='absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-20' />
        <Sparkles className='relative size-3 animate-pulse text-violet-500' />
      </div>

      <span className='animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_auto] bg-clip-text text-xs font-medium text-transparent'>
        Thinking
      </span>
    </div>
  )
}
