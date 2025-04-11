"use client";

import { COOKIE_KEYS } from '@/constants/local-storage-keys';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useUser(requiredRole?: string) {
    const router = useRouter();
    const [authState, setAuthState] = useState<{
        name: string | null
        role: string | null
        email: string | null
        isLoading: boolean
    }>({
        name: null,
        role: null,
        email: null,
        isLoading: true
    })

    useEffect(() => {
        const token = getCookie(COOKIE_KEYS.TOKEN) as string | null
        const role = getCookie(COOKIE_KEYS.ROLE) as string | null
        const name = getCookie(COOKIE_KEYS.NAME) as string | null
        const email = getCookie(COOKIE_KEYS.EMAIL) as string | null
        const isValidRole = role && ['Admin', 'Teacher', 'Student'].includes(role)

        setAuthState({
            name: name,
            email: email,
            role: isValidRole ? role : null,
            isLoading: false
        })

        if (!token || !isValidRole) { 
            router.push('/login')
        }

        if (!isValidRole || (requiredRole && role !== requiredRole)) {
            router.push('/unauthorized')
        }
    }, [router]);

    return authState;
}

export function useLogout(){
    const router = useRouter();
    const logout = () => {
        deleteCookie(COOKIE_KEYS.TOKEN);
        deleteCookie(COOKIE_KEYS.NAME);
        deleteCookie(COOKIE_KEYS.EMAIL);
        deleteCookie(COOKIE_KEYS.ROLE);
        router.push('/login');
    }
    return logout;
}