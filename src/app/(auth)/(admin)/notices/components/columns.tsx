import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Notice } from "@/types/notice";
import { Pencil, Trash } from "lucide-react";

export const getColumns = (
  handleDelete: (id: string) => void
): ColumnDef<Notice>[] => [
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: false,
  },
  {
    accessorKey: "content",
    header: "Content",
    enableSorting: false,
  },
  {
    accessorKey: "fromDate",
    header: "From Date",
    enableSorting: false,
  },
  {
    accessorKey: "toDate",
    header: "To Date",
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const notice = row.original;

      return (
        <div className="flex flex-wrap gap-2">
          <Link href={`/notices/update/${notice.id}`} passHref>
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
                  onClick={() => handleDelete(notice.id)}
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
