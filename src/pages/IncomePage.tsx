import { useState, useEffect } from 'react'
import type { User } from '../services/auth'

interface Income {
  id: number
  source: string
  amount: number
  date: string
  category: string
}

interface IncomePageProps {
  user: User
}

export const IncomePage: React.FC<IncomePageProps> = ({ user }) => {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch income data
    const fetchIncomes = async () => {
      try {
        // Simulate API call
        setIncomes([
          { id: 1, source: 'Salary', amount: 5000, date: '2024-01-15', category: 'Employment' },
          { id: 2, source: 'Freelance', amount: 1500, date: '2024-01-10', category: 'Side Hustle' },
        ])
      } catch (error) {
        console.error('Error fetching incomes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchIncomes()
  }, [])

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Income Management</h2>
        {user.role === 'Admin' && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add Income
          </button>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900">Total Income</h3>
        <p className="text-2xl font-bold text-blue-600">${totalIncome.toLocaleString()}</p>
      </div>

      {loading ? (
        <div>Loading incomes...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                {user.role === 'Admin' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {incomes.map((income) => (
                <tr key={income.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{income.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${income.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{income.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{income.category}</td>
                  {user.role === 'Admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
