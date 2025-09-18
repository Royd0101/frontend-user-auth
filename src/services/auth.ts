import api from "../api/axios"

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

interface LoginApiResponse {
  user_id: number
  role: string
  permissions: string[]
}

interface LoginResponse {
  user: User
}

class AuthService {
  private static instance: AuthService

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // Login user - cookies are set by backend
  public async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('🔍 Attempting login...')
      const response = await api.post<LoginApiResponse>('/api/auth/login/', { email, password })
      console.log('✅ Login response:', response.data)
      
      const { user_id, role, permissions } = response.data
      console.log('📊 User ID:', user_id, 'Role from login:', role, 'Permissions from login:', permissions)
      
      // Fetch full user details immediately after login
      console.log('🔄 Fetching user details from /api/users/me/...')
      const userResponse = await api.get('/api/users/me/')
      console.log('📋 Raw user data from backend:', userResponse.data)
      
      const userData = userResponse.data
      
      // Extract role - handle both string and object formats
      let primaryRole = 'User'

      if (userData.role) {
        if (typeof userData.role === 'object' && userData.role.name) {
          primaryRole = userData.role.name
        } else if (typeof userData.role === 'string') {
          primaryRole = userData.role
        } else if (Array.isArray(userData.role) && userData.role.length > 0) {
          const firstRole = userData.role[0]
          if (firstRole && firstRole.name) {
            primaryRole = firstRole.name
          } else if (typeof firstRole === 'string') {
            primaryRole = firstRole
          }
        }
      }

      console.log('✅ Final extracted role:', primaryRole)

      const user: User = {
        id: userData.id,
        name: userData.first_name || userData.username || email.split('@')[0],
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        role: primaryRole,
        permissions: userData.permissions || [],
        company_name: userData.company_name,
        department_name: userData.department_name
      }

      console.log('💾 Final user object:', user)
      localStorage.setItem('user', JSON.stringify(user))
      return { user }
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.detail || "Invalid credentials")
    }
  }

  // Logout user - cookies are cleared by backend
  public async logout() {
    try {
      console.log('Attempting logout...')
      await api.post('/api/auth/logout/')
      console.log('Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('user')
      console.log('User cleared from localStorage')
    }
  }

  // Get current user from localStorage
  public getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
        return null
      }
    }
    return null
  }

  // Check if user is authenticated by making a test API call
  public async isAuthenticated(): Promise<boolean> {
    try {
      console.log('Checking authentication...')
      await api.get('/api/users/me/')
      console.log('Authentication valid')
      return true
    } catch (error: any) {
      console.error('Authentication check failed:', {
        status: error.response?.status,
        message: error.response?.data?.detail || error.message,
        url: error.config?.url
      })
      if (error.response?.status === 401) {
        return false
      }
      return false
    }
  }

  // Setup axios interceptor for automatic cookie handling
  public setupAxiosInterceptor() {
    // Request interceptor - cookies are automatically sent by browser
    api.interceptors.request.use(
      (config) => {
        console.log('Request:', config.url, 'with cookies:', config.withCredentials)
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for handling auth errors
    api.interceptors.response.use(
      (response) => {
        console.log('Response:', response.status, response.config.url)
        return response
      },
      async (error) => {
        console.error('Response error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.detail || error.message
        })
        
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          console.log('Attempting token refresh...')

          try {
            await api.post('/api/auth/refresh/')
            console.log('Token refresh successful')
            return api(originalRequest)
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            await this.logout()
            window.location.href = '/'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Get user info (for profile page)
  public async getUserProfile(): Promise<User> {
    try {
      const response = await api.get('/api/users/me/')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const authService = AuthService.getInstance()
export type { User, LoginApiResponse, LoginResponse }
