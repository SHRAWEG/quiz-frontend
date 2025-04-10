// context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { COOKIE_KEYS } from '@/constants/local-storage-keys'
import { getCookie } from 'cookies-next'

type AuthContextType = {
    name: string | null
    email: string | null
    role: string | null
    isLoading: boolean
    isAdmin: boolean
    isTeacher: boolean
    isStudent: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [authState, setAuthState] = useState<Omit<AuthContextType, 'isAdmin' | 'isTeacher' | 'isStudent'>>({
        name: null,
        email: null,
        role: null,
        isLoading: true
    })

    useEffect(() => {
        const token = getCookie(COOKIE_KEYS.TOKEN) as string | undefined
        const name = getCookie(COOKIE_KEYS.NAME) as string | undefined
        const email = getCookie(COOKIE_KEYS.EMAIL) as string | undefined
        const role = getCookie(COOKIE_KEYS.ROLE) as string | undefined
        const isValidRole = role && ['Admin', 'Teacher', 'Student'].includes(role)

        setAuthState({
            name: name || null,
            email: email || null,
            role: isValidRole ? role : null,
            isLoading: false
        })

        if (!token) {
            router.push('/login')
        }

        if (!isValidRole) {
            router.push('/login')
        }
    }, [router])

    const value = {
        ...authState,
        isAdmin: authState.role === 'Admin',
        isTeacher: authState.role === 'Teacher',
        isStudent: authState.role === 'Student'
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(requiredRole?: string) {
    const router = useRouter()

    const context = useContext(AuthContext)

    if (requiredRole && context && context.role !== requiredRole) {
        router.push('/unauthorized')
    }

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}