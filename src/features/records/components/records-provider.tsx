import React, { useState } from 'react'
import { type LoanFollowupEmail } from '@/services/record-services/record-services'
import useDialogState from '@/hooks/use-dialog-state'

type TasksDialogType =
  | 'create'
  | 'update'
  | 'delete'
  | 'import'
  | 'edit'
  | 'view'
  | 'delete-chapter'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: LoanFollowupEmail | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LoanFollowupEmail | null>>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LoanFollowupEmail | null>(null)

  return (
    <TasksContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksProvider>')
  }

  return tasksContext
}
