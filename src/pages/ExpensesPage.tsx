import { useState } from 'react'
import type { User } from '../services/auth'

interface Expense {
  id: number
  description: string
  amount: number
  date: string
  category: string
}

interface ExpensesPageProps {
  user: User
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ user }) => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, description: 'Groceries', amount: 120, date: '2024-01-15', category: 'Food' },
    { id: 2, description: 'Gas', amount: 60, date: '2024-01-14', category: 'Transport' },
    { id: 3, description: 'Netflix', amount: 15, date: '2024-01-10', category: 'Entertainment' },
  ])

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Expense Tracking</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
          Add Expense
        </button>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-red-900">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{expense.description}</h3>
                <p className="text-sm text-gray-600">{expense.category}</p>
              </div>
              <span className="text-lg font-semibold text-red-600">${expense.amount}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{expense.date}</p>
            {(user.role === 'Admin' || user.role === 'Manager') && (
              <div className="mt-3 flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Food', 'Transport', 'Entertainment', 'Shopping'].map((category) => (
            <div key={category} className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900">{category}</h4>
              <p className="text-lg font-semibold text-gray-700">
                ${expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
