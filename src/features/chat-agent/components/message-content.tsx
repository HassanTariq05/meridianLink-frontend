import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CopyCodeButton } from './copy-code-button'

export function MessageContent({ content }: { content: string }) {
  return (
    <div className='space-y-3 text-sm leading-7'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className='text-foreground mb-3 text-lg font-semibold'>
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className='text-foreground mb-2 text-base font-semibold'>
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className='text-foreground mb-2 text-sm font-semibold'>
              {children}
            </h3>
          ),

          p: ({ children }) => <p className='mb-3 last:mb-0'>{children}</p>,

          strong: ({ children }) => (
            <strong className='text-foreground font-semibold'>
              {children}
            </strong>
          ),

          em: ({ children }) => <em className='italic'>{children}</em>,

          ul: ({ children }) => (
            <ul className='my-2 ml-5 list-disc space-y-1'>{children}</ul>
          ),

          ol: ({ children }) => (
            <ol className='my-2 ml-5 list-decimal space-y-1'>{children}</ol>
          ),

          li: ({ children }) => <li className='pl-1'>{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className='text-muted-foreground my-3 border-l-2 border-violet-500/40 pl-4 italic'>
              {children}
            </blockquote>
          ),

          hr: () => <hr className='border-border my-4' />,

          a: ({ href, children }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-violet-500 underline underline-offset-2 hover:text-violet-400'
            >
              {children}
            </a>
          ),

          code: ({ className, children, ...props }) => {
            const isCodeBlock = Boolean(className)

            if (!isCodeBlock) {
              return (
                <code
                  className='bg-muted rounded-md px-1.5 py-0.5 font-mono text-xs'
                  {...props}
                >
                  {children}
                </code>
              )
            }

            const code = String(children).replace(/\n$/, '')

            return (
              <div className='my-3 overflow-hidden rounded-xl border border-violet-500/20 bg-zinc-950 shadow-sm'>
                <div className='flex items-center justify-between border-b border-violet-500/20 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 px-3 py-2'>
                  <span className='text-xs font-medium text-violet-300'>
                    Code
                  </span>

                  <CopyCodeButton code={code} />
                </div>

                <pre className='overflow-x-auto p-4 text-xs leading-6 text-zinc-200'>
                  <code>{children}</code>
                </pre>
              </div>
            )
          },

          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
