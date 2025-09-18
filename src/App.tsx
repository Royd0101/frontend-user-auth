import { useState, useEffect } from "react"
import { LoginForm } from "./components/login-form"
import { SidebarLayout } from './components/SidebarLayout'
import { authService } from "./services/auth"
import { useToast } from "./components/ui/toast"

interface User {
  id: number
  name: string
  email: string
  first_name?: string
  last_name?: string
  username?: string
  role: string
  permissions: string[]
  company_name?: string
  department_name?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { toast } = useToast()

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.login(email, password)
      setUser(response.user)
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.name}!`,
        variant: "success",
      })
    } catch (error: any) {
      console.error("Login failed:", error)
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "error",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "success",
    })
  }

  // Setup auth interceptor and check for existing session
  useEffect(() => {
    const initAuth = async () => {
      // Setup axios interceptors for automatic cookie handling
      authService.setupAxiosInterceptor()

      // Check for existing valid session
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        try {
          const isAuth = await authService.isAuthenticated()
          if (isAuth) {
            setUser(currentUser)
          } else {
            authService.logout()
          }
        } catch {
          authService.logout()
        }
      }
      setIsCheckingAuth(false)
    }

    initAuth()
  }, [])

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <SidebarLayout key={user.id} user={user} onLogout={handleLogout} />
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm onLogin={handleLogin} isLoading={isLoading} />
    </div>
  )
}

export default App
