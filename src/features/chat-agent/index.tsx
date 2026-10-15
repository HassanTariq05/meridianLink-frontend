import { useEffect, useRef, useState } from 'react'
import { MessagesSquare, Plus, Send, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAskChatAgent } from '@/hooks/use-chat-agent'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { MessageActions } from './components/message-action'
import { MessageContent } from './components/message-content'
import { TypingIndicator } from './components/typing-indicator'
import { INITIAL_CONVERSATIONS, SUGGESTIONS } from './data'
import { ChatMessage, Conversation } from './data/types'

export default function ChatAgent() {
  const [conversations, setConversations] = useState<Conversation[]>(
    INITIAL_CONVERSATIONS
  )

  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >({})

  const [activeConversationId, setActiveConversationId] =
    useState('loan-analysis')

  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeMessages = messagesByConversation[activeConversationId] ?? []

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [activeMessages.length, isGenerating])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [activeConversationId])

  const createNewChat = () => {
    const id = `chat-${Date.now()}`

    const newConversation: Conversation = {
      id,
      title: 'New conversation',
      preview: 'Start a new conversation...',
      updatedAt: new Date(),
    }

    setConversations((current) => [newConversation, ...current])
    setMessagesByConversation((current) => ({
      ...current,
      [id]: [],
    }))
    setActiveConversationId(id)
    setInput('')
  }

  const updateConversationPreview = (
    conversationId: string,
    message: string
  ) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              preview: message,
              updatedAt: new Date(),
              title:
                conversation.title === 'New conversation'
                  ? message.length > 34
                    ? `${message.slice(0, 34)}...`
                    : message
                  : conversation.title,
            }
          : conversation
      )
    )
  }

  const askChatAgent = useAskChatAgent()

  const handleSend = async () => {
    const message = input.trim()

    if (!message || isGenerating) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      createdAt: new Date(),
    }

    setMessagesByConversation((current) => ({
      ...current,
      [activeConversationId]: [
        ...(current[activeConversationId] ?? []),
        userMessage,
      ],
    }))

    updateConversationPreview(activeConversationId, message)
    setInput('')
    setIsGenerating(true)

    try {
      const response = await askChatAgent.mutateAsync({
        chatInput: message,
        sessionId: activeConversationId,
      })

      console.log('n8n response:', response)

      const assistantContent =
        typeof response === 'string'
          ? response
          : (response?.output ??
            response?.text ??
            response?.response ??
            response?.message ??
            'I received your request, but no response was returned.')

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantContent,
        createdAt: new Date(),
      }

      setMessagesByConversation((current) => ({
        ...current,
        [activeConversationId]: [
          ...(current[activeConversationId] ?? []),
          assistantMessage,
        ],
      }))
    } catch (error) {
      console.error('Chat agent error:', error)

      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Something went wrong while processing your request. Please try again.',
        createdAt: new Date(),
      }

      setMessagesByConversation((current) => ({
        ...current,
        [activeConversationId]: [
          ...(current[activeConversationId] ?? []),
          errorMessage,
        ],
      }))
    } finally {
      setIsGenerating(false)

      window.setTimeout(() => {
        textareaRef.current?.focus()
      }, 50)
    }
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const useSuggestion = (prompt: string) => {
    setInput(prompt)

    window.setTimeout(() => {
      textareaRef.current?.focus()
    }, 50)
  }

  return (
    <TooltipProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 py-0 pb-6 sm:gap-6'>
        <div className='bg-background relative flex h-[calc(100vh-4rem)] min-h-[620px] overflow-hidden rounded-2xl border border-violet-500/10 shadow-lg'>
          {/* glow blobs */}
          <div className='pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-violet-500/20 blur-3xl' />
          <div className='pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-fuchsia-500/20 blur-3xl' />

          <section className='relative flex min-w-0 flex-1 flex-col'>
            {/* Header */}
            <header className='flex h-14 shrink-0 items-center justify-between border-b border-violet-500/10 bg-gradient-to-r from-violet-600/5 via-fuchsia-500/5 to-transparent px-3 backdrop-blur-sm sm:px-5'>
              <div className='flex min-w-0 items-center gap-2'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white'>
                  <MessagesSquare className='size-4' />
                </div>

                <div className='min-w-0'>
                  <div className='flex items-center gap-2'>
                    <h1 className='truncate text-sm font-semibold'>
                      Meridian AI Agent
                    </h1>

                    <Badge
                      variant='secondary'
                      className='hidden h-5 gap-1 border-emerald-500/20 bg-emerald-500/10 px-1.5 text-[10px] text-emerald-600 sm:flex dark:text-emerald-400'
                    >
                      <span className='size-1.5 rounded-full bg-emerald-500' />
                      Online
                    </Badge>
                  </div>

                  <p className='text-muted-foreground truncate text-xs'>
                    {activeConversation?.title ?? 'New conversation'}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={createNewChat}
                    >
                      <Plus className='size-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New chat</TooltipContent>
                </Tooltip>
              </div>
            </header>

            {/* Messages */}
            <ScrollArea className='min-h-0 flex-1'>
              <div className='mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
                {activeMessages.length === 0 ? (
                  <div className='flex min-h-[calc(100vh-18rem)] flex-col items-center justify-center'>
                    <div className='mb-5 flex size-16 items-center justify-center rounded-2xl bg-violet-600 text-white'>
                      <Sparkles className='size-8' />
                    </div>

                    <h2 className='text-center text-2xl font-semibold tracking-tight'>
                      How can I help you?
                    </h2>

                    <p className='text-muted-foreground mt-2 max-w-lg text-center text-sm leading-6'>
                      Ask questions about your data, generate reports, analyze
                      records, or let the agent work with your n8n workflows.
                    </p>

                    <div className='mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2'>
                      {SUGGESTIONS.map((suggestion) => {
                        const Icon = suggestion.icon

                        return (
                          <button
                            key={suggestion.label}
                            type='button'
                            onClick={() => useSuggestion(suggestion.prompt)}
                            className='group bg-background relative flex items-center gap-3 overflow-hidden rounded-2xl border border-violet-500/10 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-md hover:shadow-violet-500/10'
                          >
                            <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 transition-colors group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5' />

                            <div className='relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/10 to-fuchsia-500/10 text-violet-600 transition-colors group-hover:from-violet-600 group-hover:to-fuchsia-500 group-hover:text-white dark:text-violet-400 dark:group-hover:text-white'>
                              <Icon className='size-4' />
                            </div>

                            <div className='relative min-w-0'>
                              <p className='text-sm font-medium'>
                                {suggestion.label}
                              </p>
                              <p className='text-muted-foreground mt-0.5 line-clamp-1 text-xs'>
                                {suggestion.prompt}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className='space-y-8'>
                    {activeMessages.map((message) => {
                      const isUser = message.role === 'user'

                      return (
                        <div
                          key={message.id}
                          className={cn(
                            'group flex gap-3 sm:gap-4',
                            isUser ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {!isUser && (
                            <img
                              src={'/images/logo_collapsed.png'}
                              alt='Flux Flow Logo'
                              style={{ height: '28px', width: 'auto' }}
                            />
                          )}

                          <div
                            className={cn(
                              'max-w-[85%] min-w-0 sm:max-w-[78%]',
                              isUser && 'flex flex-col items-end'
                            )}
                          >
                            <div
                              className={cn(
                                'rounded-2xl p-px',
                                isUser
                                  ? 'rounded-br-sm bg-gradient-to-r from-violet-600 to-fuchsia-500'
                                  : ''
                              )}
                            >
                              <div
                                className={cn(
                                  'rounded-[15px] px-4 py-3',
                                  isUser
                                    ? 'bg-background text-foreground dark:bg-background rounded-br-[13px]'
                                    : 'bg-muted/40 text-foreground rounded-bl-[13px]'
                                )}
                              >
                                <MessageContent content={message.content} />
                              </div>
                            </div>

                            {!isUser && (
                              <MessageActions content={message.content} />
                            )}
                          </div>

                          {isUser && (
                            <Avatar className='mt-0.5 size-8 shrink-0'>
                              <AvatarFallback className='bg-gradient-to-br from-zinc-700 to-zinc-500 text-white'>
                                <User className='size-4' />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )
                    })}

                    {isGenerating && (
                      <div className='flex gap-3 sm:gap-4'>
                        <img
                          src={'/images/logo_collapsed.png'}
                          alt='Flux Flow Logo'
                          style={{ height: '28px', width: 'auto' }}
                        />

                        <div className='bg-muted/40 rounded-2xl rounded-bl-md border border-violet-500/10 px-4 py-3'>
                          <TypingIndicator />
                        </div>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Composer */}
            <div className='bg-background/95 shrink-0 border-t border-violet-500/10 p-3 backdrop-blur sm:p-4'>
              <div className='mx-auto max-w-4xl'>
                <div className='bg-background relative rounded-2xl border border-violet-500/15 shadow-sm transition focus-within:border-violet-500/40 focus-within:ring-2 focus-within:ring-violet-500/10'>
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Message your AI agent...'
                    rows={1}
                    className='min-h-[52px] resize-none border-0 bg-transparent px-4 py-4 pr-14 shadow-none focus-visible:ring-0'
                  />

                  <div className='absolute right-2.5 bottom-2'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          size='icon'
                          className='size-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-sm shadow-violet-500/30 hover:opacity-90 disabled:opacity-40'
                          disabled={!input.trim() || isGenerating}
                          onClick={() => void handleSend()}
                        >
                          <Send className='size-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isGenerating ? 'Generating...' : 'Send message'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className='mt-2 flex items-center justify-between gap-4 px-1'>
                  <p className='text-muted-foreground text-[11px]'>
                    Press{' '}
                    <kbd className='bg-muted rounded border px-1.5 py-0.5'>
                      Enter
                    </kbd>{' '}
                    to send ·{' '}
                    <kbd className='bg-muted rounded border px-1.5 py-0.5'>
                      Shift + Enter
                    </kbd>{' '}
                    for a new line
                  </p>

                  <p className='text-muted-foreground hidden text-[11px] sm:block'>
                    AI can make mistakes. Verify important information.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Main>
    </TooltipProvider>
  )
}
