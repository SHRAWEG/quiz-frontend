import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, BookmarkMinus, BookmarkCheck, Loader2 } from "lucide-react";
import { QuestionSet } from "@/types/question-set";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const getColumns = (
  handleDelete: (id: string) => void,
  handlePublishQuestionSet: (id: string) => void,
  handleDraftQuestionSet: (id: string) => void,
  isPending: boolean,
  pendingId: string
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
      accessorKey: "timeLimit",
      header: "Time Limit",
      enableSorting: false,
      cell: ({ row }) => {
        const questionSet = row.original;
        if (!questionSet.isTimeLimited) return "No Limit";
        const hours = Math.floor(questionSet.timeLimitSeconds / 3600);
        const minutes = Math.floor((questionSet.timeLimitSeconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => {
        const questionSet = row.original;
        return (
          isPending && pendingId === questionSet.id ? <Loader2 className="animate-spin" /> :
            <span className={`px-2 py-1 rounded-full text-xs ${questionSet.status === "published"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}>
              {questionSet.status === "published" ? "Published" : "Draft"}
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
          <div className="flex flex-wrap gap-2">
            <Link href={`/question-sets/view/${questionSet.id}`} passHref>
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
            <Link href={`/question-sets/update/${questionSet.id}`} passHref>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {
                    isPending && pendingId === questionSet.id ? <Button disabled variant="secondary"><Loader2 className="animate-spin" /></Button> : (
                      <Button
                        variant="default"
                        className={questionSet.status === "published" ? "bg-violet-500" : "bg-green-500"}
                        onClick={() => {
                          if (questionSet.status === "published") {
                            handleDraftQuestionSet(questionSet.id)
                          } else {
                            handlePublishQuestionSet(questionSet.id)
                          }
                        }}
                      >
                        {
                          questionSet.status === "published" ? (
                            <BookmarkMinus />
                          ) : (
                            <BookmarkCheck />
                          )
                        }
                      </Button>
                    )
                  }

                </TooltipTrigger>
                <TooltipContent>
                  <p>{questionSet.status === "published" ? "Draft" : "Publish"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(questionSet.id)}
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