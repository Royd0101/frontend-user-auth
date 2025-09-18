import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, Settings, BarChart3, Users, FileText, Bell } from "lucide-react"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/toast"

interface LandingPageProps {
  user?: {
    name: string
    email: string
  }
  onLogout: () => void
}

export function LandingPage({ user = { name: "User", email: "user@example.com" }, onLogout }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const { toast, toasts } = useToast()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
    { id: "users", label: "Users", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    toast({
      title: "Section Changed",
      description: `Navigated to ${menuItems.find(item => item.id === sectionId)?.label}`,
      variant: "info",
      duration: 2000,
    })
  }

  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "Goodbye! See you next time.",
      variant: "success",
      duration: 3000,
    })
    
    // Delay logout to show toast
    setTimeout(() => {
      onLogout()
    }, 1500)
  }

  const handleNotificationTest = () => {
    toast({
      title: "Notification Test",
      description: "This is a test notification from your dashboard!",
      variant: "info",
    })
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                <p className="text-gray-600 dark:text-gray-400">Welcome to your personalized dashboard</p>
              </div>
              <Button 
                onClick={handleNotificationTest}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Test Notification
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-gray-500">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">$45,678</p>
                  <p className="text-sm text-gray-500">+8% from last month</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">89</p>
                  <p className="text-sm text-gray-500">Currently online</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm">Successfully logged in as {user.name}</p>
                    <span className="text-xs text-gray-500 ml-auto">Just now</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">Dashboard accessed</p>
                    <span className="text-xs text-gray-500 ml-auto">1 min ago</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm">Profile data loaded</p>
                    <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your personal information</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <p className="text-lg text-gray-900 dark:text-white">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => toast({
                        title: "Profile Updated",
                        description: "Your profile information has been saved.",
                        variant: "success",
                      })}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => toast({
                        title: "Profile Reset",
                        description: "Changes have been reverted.",
                        variant: "warning",
                      })}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "users":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage system users and permissions</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Coming soon - User management features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">User management features are under development</p>
                  <Button 
                    onClick={() => toast({
                      title: "Feature Coming Soon",
                      description: "User management will be available in the next update.",
                      variant: "info",
                    })}
                  >
                    Notify When Ready
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "reports":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h2>
              <p className="text-gray-600 dark:text-gray-400">View and generate system reports</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Coming soon - Reports and analytics features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">Advanced reporting features are being prepared</p>
                  <Button 
                    onClick={() => toast({
                      title: "Reports Coming Soon",
                      description: "Check back for comprehensive analytics.",
                      variant: "info",
                    })}
                  >
                    Get Notified
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Configure your application preferences</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Settings & Configuration</CardTitle>
                <CardDescription>Coming soon - Settings and configuration options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">Settings panel is under construction</p>
                  <Button 
                    onClick={() => toast({
                      title: "Settings Update",
                      description: "Settings will be available soon.",
                      variant: "info",
                    })}
                  >
                    Stay Updated
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* Render all active toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          onClose={toast.onClose}
        />
      ))}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-white dark:bg-slate-800 shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back!</p>
            </div>
            
            <nav className="mt-6">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {menuItems.find(item => item.id === activeSection)?.label}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome to your dashboard, {user.name}
                  </p>
                </div>
              </div>
              
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
