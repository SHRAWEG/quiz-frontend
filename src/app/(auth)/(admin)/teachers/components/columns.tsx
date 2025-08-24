import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const getColumns = (
  onViewProfile?: (user: User) => void
): ColumnDef<User>[] => [
    {
      accessorKey: "firstName",
      header: "First Name",
      enableSorting: false,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      enableSorting: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: false,
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      enableSorting: false,
    },
    {
      accessorKey: "isEmailVerified",
      header: "Is Email Verified",
      enableSorting: false,
      cell: ({ row }) => {
        return (<div className="flex justify-center items-center">
          {
            row ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-destructive" />
          }
        </div>
        )
      }
    },
    {
      accessorKey: "isActive",
      header: "Is Active",
      enableSorting: false,
      cell: ({ row }) => {
        return (<div className="flex justify-center items-center">
          {
            row ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-destructive" />
          }
        </div>
        )
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
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewProfile?.(user)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];