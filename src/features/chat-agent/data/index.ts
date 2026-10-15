import { Bot, FileText, Search, Sparkles } from 'lucide-react'
import { ChatMessage, Conversation } from './types'

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'loan-analysis',
    title: 'Loan application analysis',
    preview: 'Show me the pending loan applications...',
    updatedAt: new Date(),
  },
  {
    id: 'customer-followup',
    title: 'Customer follow-ups',
    preview: 'Generate follow-up emails for...',
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'sales-report',
    title: 'Sales report',
    preview: 'Give me this month sales summary...',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: 'database-query',
    title: 'Database questions',
    preview: 'How many records are in the database?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
]

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'loan-analysis': [
    {
      id: '1',
      role: 'user',
      content: 'Show me the pending loan applications.',
      createdAt: new Date(),
    },
    {
      id: '2',
      role: 'assistant',
      content:
        'I found **12 pending loan applications**.\n\nThe applications include Personal Loans, Auto Loans, and Home Mortgages. I can also break them down by loan type, amount, customer, or application date.',
      createdAt: new Date(),
    },
  ],
  'customer-followup': [
    {
      id: '3',
      role: 'user',
      content: 'Generate follow-up emails for pending customers.',
      createdAt: new Date(),
    },
    {
      id: '4',
      role: 'assistant',
      content:
        'Sure. I can generate professional follow-up emails based on the customer, loan status, previous follow-ups, and notes.',
      createdAt: new Date(),
    },
  ],
  'sales-report': [
    {
      id: '5',
      role: 'user',
      content: 'Give me this month sales summary.',
      createdAt: new Date(),
    },
    {
      id: '6',
      role: 'assistant',
      content:
        'Your current month revenue is **$184,250**, based on the available sales records.',
      createdAt: new Date(),
    },
  ],
  'database-query': [
    {
      id: '7',
      role: 'user',
      content: 'How many records are in the database?',
      createdAt: new Date(),
    },
    {
      id: '8',
      role: 'assistant',
      content: 'There are currently **1,248 records** available.',
      createdAt: new Date(),
    },
  ],
}

export const SUGGESTIONS = [
  {
    icon: FileText,
    label: 'Analyze my data',
    prompt:
      'Analyze the available data and highlight the most important insights.',
  },
  {
    icon: Sparkles,
    label: 'Generate a report',
    prompt: 'Generate a concise report summarizing the latest data.',
  },
  {
    icon: Search,
    label: 'Find records',
    prompt: 'Find the most relevant records from the database.',
  },
  {
    icon: Bot,
    label: 'Ask the database',
    prompt:
      'What are the most important things I should know from the database?',
  },
]
