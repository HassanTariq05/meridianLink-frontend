export type MessageRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: MessageRole
  content: string
  createdAt: Date
}

export type Conversation = {
  id: string
  title: string
  preview: string
  updatedAt: Date
}
