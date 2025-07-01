// contexts/SubscriptionContext.tsx
'use client'

import { useGetUserSubscriptionStatus } from '@/hooks/api/useUserSubscription'
import { userSubscriptionStatusSchema } from '@/types/user-subscription'
import { createContext, useContext } from 'react'

type SubscriptionContextType = import('zod').infer<typeof userSubscriptionStatusSchema>

const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { data } = useGetUserSubscriptionStatus();

  const subscriptionStatus = {
    isActive: data?.isActive ?? false,
    expiresAt: data?.expiresAt ?? new Date()
  }

  return (
    <SubscriptionContext.Provider value={subscriptionStatus}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}