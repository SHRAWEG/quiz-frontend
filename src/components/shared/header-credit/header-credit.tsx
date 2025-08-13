"use client";

import { DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useGetBalance } from "@/hooks/api/useCredit";

export function HeaderCredits() {
  const { data: balance, isLoading } = useGetBalance();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 px-3 hover:bg-accent"
        >
          <DollarSign />
          <span className="font-medium">
            {isLoading ? "..." : balance ?? 0}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex justify-between">
          <span>Balance:</span>
          <span className="font-medium">{balance} credits</span>
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/purchase-credits")}
        >
          <Plus className="h-4 w-4 text-primary" />
          <span>Purchase Credits</span>
        </DropdownMenuItem>

        {/* <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/credits/history")}
        >
          <CreditCard className="h-4 w-4 text-primary" />
          <span>Transaction History</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
