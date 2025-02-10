export type TransactionDetails = {
  from: string
  to: string
  detectedFromApp: string
  type: "deposit" | "withdrawal" | "transfer" | "other"
  date: string
  description: string
  amount: number
}

export type Notification = {
  summary: string
  id: string
  isTransaction: boolean
  transactionDetails?: TransactionDetails
}

export type History = Notification[]

export type Budget = {
  amount: number
  duration: "monthly" | "weekly"
  resetDate: string
}

export type Expense = {
  name: string
  amount: number
  date: string
  description?: string
  id: string
}

export type ExpenseHistory = Expense[]
