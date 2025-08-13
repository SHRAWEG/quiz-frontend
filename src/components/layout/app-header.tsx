"use client"

import { CheckCircle2, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useRouter } from "next/navigation";
import { HeaderCredits } from "../shared/header-credit/header-credit";

export function Header() {
  const router = useRouter();

  const { user } = useAuthContext();
  const { isActive, expiresAt } = useSubscription();

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger />
        <div className="ml-auto flex items-center space-x-4">
          {
            user?.role === 'student' && (!isActive ? (
              <Button
                variant="default"
                className="flex bg-amber-500 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md"
                onClick={() => router.push('/pricings')}
              >
                <Crown className="mr-2" />
                Go Premium
              </Button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">
                  {expiresAt ? `Premium until ${new Date(expiresAt).toLocaleDateString()}` : 'Premium Member'}
                </span>
              </div>
            ))
          }

          {user?.role === 'student' && (
            <HeaderCredits />
          )}
        </div>
      </div>
    </header>
  )

}