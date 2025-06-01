import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Subject } from "@/types/subject";
import { Eye, Pencil, Plus, Trash } from "lucide-react";

export const getColumns = (
  handleDelete: (id: string) => void
): ColumnDef<Subject>[] => [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
    },
    {
      accessorKey: "subSubjectCount",
      header: "#Sub-Subjects",
      enableSorting: false,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const subject = row.original;

        return (
          <div className="flex flex-wrap gap-2">
            <Link href={`/subjects/view/${subject.id}`} passHref>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                    >
                      <Eye />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <Link href={`/subjects/update/${subject.id}`} passHref>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
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
            <Link href={`/subjects/${subject.id}/create-sub-subject`} passHref>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      className="bg-green-600"
                    >
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Sub-subjects</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(subject.id)}
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