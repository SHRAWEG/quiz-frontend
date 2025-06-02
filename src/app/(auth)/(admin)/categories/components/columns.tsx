import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Category } from "@/types/category";
import { Pencil, Trash } from "lucide-react";

export const getColumns = (
  handleDelete: (id: string) => void
): ColumnDef<Category>[] => [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="flex flex-wrap gap-2">
            <Link href={`/categories/update/${category.id}`} passHref>
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
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];