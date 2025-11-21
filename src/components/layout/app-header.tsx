"use client"

import { CheckCircle2, Crown, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useRouter } from "next/navigation";
import { HeaderCredits } from "../shared/header-credit/header-credit";
import { redirectToForum } from "@/lib/forum-redirect";
import { useCallback } from "react";

export function Header() {
  const router = useRouter();

  const { user } = useAuthContext();
  const { isActive, expiresAt } = useSubscription();

  const handleForumRedirect = useCallback(() => {
    redirectToForum();
  }, []);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger />
        <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
          {/* Explore Forum Button - Responsive */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleForumRedirect}
            type="button"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Explore Forum</span>
          </Button>

          {
            user?.role === 'student' && (!isActive ? (
              <Button
                variant="default"
                className="flex bg-amber-500 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md"
                onClick={() => router.push('/pricings')}
              >
                <Crown className="mr-2" />
                <span className="hidden sm:inline">Go Premium</span>
                <span className="sm:hidden">Premium</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800 hidden sm:inline">
                  {expiresAt ? `Premium until ${new Date(expiresAt).toLocaleDateString()}` : 'Premium Member'}
                </span>
                <span className="text-sm font-medium text-emerald-800 sm:hidden">
                  Premium
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