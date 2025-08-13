import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionPlan } from "@/types/subscription-plan";
import { subscriptionDuration } from "@/enums/subscription-duration";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Pencil, X } from "lucide-react";

export const getColumns = (
  handleMarkActive: (id: string) => void,
  handleMarkInactive: (id: string) => void,
  isPending: boolean,
  pendingId: string
): // handleDelete: (id: string) => void
ColumnDef<SubscriptionPlan>[] => [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: false,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    enableSorting: false,
    cell: ({ row }) => {
      const duration = row.original;
      return (
        <span>
          {subscriptionDuration.find((d) => d.value === duration.duration)
            ?.label || "Unknown"}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: "Active",
    enableSorting: false,
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <span className={`text-${isActive ? "green" : "red"}-500`}>
          {isActive ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: false,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const subscriptionPlan = row.original;

      return (
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/subscription-plans/update/${subscriptionPlan.id}`}
            passHref
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-yellow-500 hover:bg-yellow-400"
                  >
                    <Pencil />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Update</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {isPending && pendingId === subscriptionPlan.id ? (
                  <Button disabled variant="secondary">
                    <Loader2 className="animate-spin" />
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className={
                      subscriptionPlan.isActive
                        ? "bg-violet-500 hover:bg-violet-400"
                        : "bg-green-500 hover:bg-green-400"
                    }
                    onClick={() => {
                      if (subscriptionPlan.isActive) {
                        handleMarkInactive(subscriptionPlan.id);
                      } else {
                        handleMarkActive(subscriptionPlan.id);
                      }
                    }}
                  >
                    {subscriptionPlan.isActive ? <X /> : <Check />}
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{subscriptionPlan.isActive ? "Deactivate" : "Activate"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
