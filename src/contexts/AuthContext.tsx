'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'cookies-next'
import { COOKIE_KEYS } from '@/constants/cookie-keys'
import { LoginResDto } from '@/types/auth/login.dto'
import { toast } from 'sonner'

type User = {
    email: string
    name: string
    role: string
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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    console.log('AuthProvider initialized')

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = Cookies.getCookie(COOKIE_KEYS.TOKEN) as string | null
                const storedRole = Cookies.getCookie(COOKIE_KEYS.ROLE) as string | null
                const storedEmail = Cookies.getCookie(COOKIE_KEYS.EMAIL) as string | null
                const storedName = Cookies.getCookie(COOKIE_KEYS.NAME) as string | null

                const userCookie: User = {
                    email: storedEmail || '',
                    name: storedName || '',
                    role: storedRole || ''
                }

                if (storedToken) {
                    setToken(storedToken)
                    setUser(userCookie)
                }
            } catch (error) {
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
            const { accessToken, role, name, email } = data
            Cookies.setCookie(COOKIE_KEYS.TOKEN, accessToken, { maxAge: 60 * 60 * 24, path: '/' })
            Cookies.setCookie(COOKIE_KEYS.EMAIL, email, { maxAge: 60 * 60 * 24, path: '/' })
            Cookies.setCookie(COOKIE_KEYS.NAME, name, { maxAge: 60 * 60 * 24, path: '/' })
            Cookies.setCookie(COOKIE_KEYS.ROLE, role, { maxAge: 60 * 60 * 24, path: '/' })

            const userResponse: User = {
                email,
                name,
                role
            }

            setToken(accessToken)
            setUser(userResponse)

            router.push('/dashboard')
        } catch (error) {
            toast.error('Failed to login.')
            clearAuth()
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        Cookies.deleteCookie(COOKIE_KEYS.TOKEN);
        Cookies.deleteCookie(COOKIE_KEYS.ROLE);
        Cookies.deleteCookie(COOKIE_KEYS.EMAIL);
        Cookies.deleteCookie(COOKIE_KEYS.NAME);

        setToken(null)
        setUser(null)
        router.push('/login')
    }

    const clearAuth = () => {
        Cookies.deleteCookie(COOKIE_KEYS.TOKEN);
        Cookies.deleteCookie(COOKIE_KEYS.ROLE);
        Cookies.deleteCookie(COOKIE_KEYS.EMAIL);
        Cookies.deleteCookie(COOKIE_KEYS.NAME);

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