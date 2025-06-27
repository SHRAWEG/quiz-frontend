'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { COOKIE_KEYS } from '@/constants/cookie-keys'
import { LoginResDto } from '@/types/auth/login.dto'

type User = {
  email: string
  name: string
  role: string
  hasPreference: boolean
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginResDto) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Client-side cookie helpers
const getClientCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

const setClientCookie = (
  name: string,
  value: string,
  options: { maxAge: number; path: string }
) => {
  if (typeof window === 'undefined') return
  document.cookie = `${name}=${value}; max-age=${options.maxAge}; path=${options.path}`
}

const deleteClientCookie = (name: string) => {
  if (typeof window === 'undefined') return
  document.cookie = `${name}=; max-age=0; path=/`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getClientCookie(COOKIE_KEYS.TOKEN)
        const storedRole = getClientCookie(COOKIE_KEYS.ROLE)
        const storedEmail = getClientCookie(COOKIE_KEYS.EMAIL)
        const storedName = getClientCookie(COOKIE_KEYS.NAME)
        const hasPreference = getClientCookie(COOKIE_KEYS.HASPREFERENCE) === "true"

        if (storedToken) {
          setToken(storedToken)
          setUser({
            email: storedEmail || '',
            name: storedName || '',
            role: storedRole || '',
            hasPreference: hasPreference
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        toast.error('Failed to initialize authentication state.')
        clearAuth()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginResDto) => {
    setIsLoading(true)
    try {
      const { accessToken, role, name, email, hasPreference } = data
      setClientCookie(COOKIE_KEYS.TOKEN, accessToken, { maxAge: 60 * 60 * 24, path: '/' })
      setClientCookie(COOKIE_KEYS.EMAIL, email, { maxAge: 60 * 60 * 24, path: '/' })
      setClientCookie(COOKIE_KEYS.NAME, name, { maxAge: 60 * 60 * 24, path: '/' })
      setClientCookie(COOKIE_KEYS.ROLE, role, { maxAge: 60 * 60 * 24, path: '/' })
      setClientCookie(COOKIE_KEYS.HASPREFERENCE, hasPreference.toString(), { maxAge: 60 * 60 * 24, path: '/' })

      setToken(accessToken)
      setUser({ email, name, role, hasPreference })
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to login.')
      clearAuth()
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    deleteClientCookie(COOKIE_KEYS.TOKEN)
    deleteClientCookie(COOKIE_KEYS.ROLE)
    deleteClientCookie(COOKIE_KEYS.EMAIL)
    deleteClientCookie(COOKIE_KEYS.NAME)
    deleteClientCookie(COOKIE_KEYS.HASPREFERENCE)

    localStorage.removeItem('preferencesModalSeen')

    setToken(null)
    setUser(null)
    router.push('/login')
  }

  const clearAuth = () => {
    deleteClientCookie(COOKIE_KEYS.TOKEN)
    deleteClientCookie(COOKIE_KEYS.ROLE)
    deleteClientCookie(COOKIE_KEYS.EMAIL)
    deleteClientCookie(COOKIE_KEYS.NAME)
    deleteClientCookie(COOKIE_KEYS.HASPREFERENCE)

    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}