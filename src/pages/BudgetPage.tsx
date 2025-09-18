import { useState } from 'react'
import { User } from '../services/auth'

interface Budget {
  id: number
  category: string
  amount: number
  spent: number
  remaining: number
}

interface BudgetPageProps {
  user: User
}

export const BudgetPage: React.FC<BudgetPageProps> = ({ user }) => {
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 1, category: 'Food', amount: 500, spent: 350, remaining: 150 },
    { id: 2, category: 'Transport', amount: 200, spent: 120, remaining: 80 },
    { id: 3, category: 'Entertainment', amount: 150, spent: 100, remaining: 50 },
  ])

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Budget Management</h2>
        {(user.role === 'Admin' || user.role === 'Manager') && (
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Add Budget
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900">Total Budget</h3>
          <p className="text-2xl font-bold text-blue-600">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-orange-900">Total Spent</h3>
          <p className="text-2xl font-bold text-orange-600">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-900">Remaining</h3>
          <p className="text-2xl font-bold text-green-600">${totalRemaining.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">{budget.category}</h3>
              <span className="text-sm text-gray-600">
                ${budget.spent} / ${budget.amount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  budget.spent > budget.amount ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Remaining: ${budget.remaining}</span>
              {(user.role === 'Admin' || user.role === 'Manager') && (
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
