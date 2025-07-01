import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionPlan } from "@/types/subscription-plan";
import { subscriptionDuration } from "@/enums/subscription-duration";

export const getColumns = (
  // handleDelete: (id: string) => void
): ColumnDef<SubscriptionPlan>[] => [
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
            {subscriptionDuration.find(
              (d) => d.value === duration.duration)?.label || "Unknown"}
          </span>
        );
      }
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
          <span className={`text-${isActive ? 'green' : 'red'}-500`}>
            {isActive ? "Yes" : "No"}
          </span>
        );
      }
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
    // {
    //   id: "actions",
    //   header: "Actions",
    //   enableSorting: false,
    //   cell: ({ row }) => {
    //     const subscriptionPlan = row.original;

    //     return (
    //       <div className="flex flex-wrap gap-2">
    //         <Link href={`/subscription-plans/update/${subscriptionPlan.id}`} passHref>
    //           <TooltipProvider>
    //             <Tooltip>
    //               <TooltipTrigger asChild>
    //                 <Button
    //                   variant="default"
    //                   className="bg-yellow-500 hover:bg-yellow-400"
    //                 >
    //                   <Pencil />
    //                 </Button>
    //               </TooltipTrigger>
    //               <TooltipContent>
    //                 <p>Update</p>
    //               </TooltipContent>
    //             </Tooltip>
    //           </TooltipProvider>
    //         </Link>
    //         <TooltipProvider>
    //           <Tooltip>
    //             <TooltipTrigger asChild>
    //               <Button
    //                 variant="destructive"
    //                 onClick={() => handleDelete(subscriptionPlan.id)}
    //               >
    //                 <Trash />
    //               </Button>
    //             </TooltipTrigger>
    //             <TooltipContent>
    //               <p>Delete</p>
    //             </TooltipContent>
    //           </Tooltip>
    //         </TooltipProvider>
    //       </div>
    //     );
    //   },
    // },
  ];