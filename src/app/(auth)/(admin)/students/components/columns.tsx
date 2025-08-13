import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { Check, X } from "lucide-react";

export const getColumns = (
  // handleDelete: (id: string) => void
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
  ];