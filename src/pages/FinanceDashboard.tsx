import { useState } from 'react'
import type { User } from '../services/auth'
import { IncomePage } from './IncomePage'
import { BudgetPage } from './BudgetPage'
import { ExpensesPage } from './ExpensesPage'

interface FinanceDashboardProps {
  user: User
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'income' | 'budget' | 'expenses'>('income')

  const canAccess = (feature: string) => {
    switch (user.role) {
      case 'Admin':
        return true
      case 'Manager':
        return ['income', 'budget', 'expenses'].includes(feature)
      case 'User':
        return ['budget', 'expenses'].includes(feature)
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Finance Dashboard - {user.name} ({user.role})
          </h1>
          
          <div className="flex space-x-4 mb-6">
            {canAccess('income') && (
              <button
                onClick={() => setActiveTab('income')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'income' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Income
              </button>
            )}
            {canAccess('budget') && (
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'budget' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Budget
              </button>
            )}
            {canAccess('expenses') && (
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'expenses' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Expenses
              </button>
            )}
          </div>

          <div className="mt-6">
            {activeTab === 'income' && <IncomePage user={user} />}
            {activeTab === 'budget' && <BudgetPage user={user} />}
            {activeTab === 'expenses' && <ExpensesPage user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}
