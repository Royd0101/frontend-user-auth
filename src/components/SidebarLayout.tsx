import { useState } from 'react'
import type { User } from '../services/auth'
import { IncomePage } from '../pages/IncomePage'
import { BudgetPage } from '../pages/BudgetPage'
import { ExpensesPage } from '../pages/ExpensesPage'
import { 
  BarChart3, 
  DollarSign, 
  Target, 
  CreditCard, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react'

interface SidebarLayoutProps {
  user: User
  onLogout: () => void
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState<'dashboard' | 'income' | 'budget' | 'expenses'>('dashboard')

  console.log('🎨 SidebarLayout - User:', user)

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      requiredPermission: 'view_budget' 
    },
    { 
      id: 'income', 
      label: 'Income', 
      icon: DollarSign, 
      requiredPermission: 'view_income' 
    },
    { 
      id: 'budget', 
      label: 'Budget', 
      icon: Target, 
      requiredPermission: 'view_budget' 
    },
    { 
      id: 'expenses', 
      label: 'Expenses', 
      icon: CreditCard, 
      requiredPermission: 'view_expenses' 
    },
  ]

  const filteredMenu = menuItems.filter(item => 
    user.permissions?.includes(item.requiredPermission)
  )

  console.log('🎨 User permissions:', user.permissions)
  console.log('🎨 Filtered menu based on permissions:', filteredMenu)

  const renderContent = () => {
    switch (activePage) {
      case 'income':
        return <IncomePage user={user} />
      case 'budget':
        return <BudgetPage user={user} />
      case 'expenses':
        return <ExpensesPage user={user} />
      case 'dashboard':
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user.name} ({user.role})</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900">Total Income</h3>
                <p className="text-3xl font-bold text-blue-600">$5,000</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-green-900">Total Budget</h3>
                <p className="text-3xl font-bold text-green-600">$3,500</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-red-900">Total Expenses</h3>
                <p className="text-3xl font-bold text-red-600">$2,800</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.role}</p>
              {/* {user.company_name && (
                <p className="text-xs text-gray-500">{user.company_name}</p>
              )}
              {user.department_name && (
                <p className="text-xs text-gray-500">{user.department_name}</p>
              )} */}
            </div>
          </div>

          <nav className="space-y-2">
            {filteredMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                  activePage === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Finance Management System</h1>
          </div>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
