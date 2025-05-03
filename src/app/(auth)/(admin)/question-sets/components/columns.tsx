import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash, EyeOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { QuestionSet } from "@/types/question-set";
import Link from "next/link";

export const getColumns = (
  handleDelete: (id: string) => void,
  handlePublishQuestionSet: (id: string) => void,
  handleDraftQuestionSet: (id: string) => void
): ColumnDef<QuestionSet>[] => [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: false,
    },
    {
      accessorKey: "category.name",
      header: "Category",
      enableSorting: false,
    },
    {
      accessorKey: "isFree",
      header: "Is Free?",
      enableSorting: false,
      cell: ({ row }) => {
        const isFree = row.getValue("isFree") as boolean;
        return isFree ? "Yes" : "No";
      },
    },
    {
      id: "questions",
      header: "#Questions",
      enableSorting: false,
      cell: ({ row }) => row.original.questions.length
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${status === "published"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}>
            {status === "published" ? "Published" : "Draft"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const questionSet = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/question-sets/view/${questionSet.id}`} passHref>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
              </Link>

              <Link href={`/question-sets/update/${questionSet.id}`} passHref>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                onClick={() => handleDelete(questionSet.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              {
                questionSet.status === "published" ? (
                  <DropdownMenuItem
                    onClick={() => handleDraftQuestionSet(questionSet.id)}
                  >
                    <EyeOff className="mr-2 h-4 w-4" /> Unpublish
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handlePublishQuestionSet(questionSet.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" /> Publish
                  </DropdownMenuItem>
                )
              }
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];