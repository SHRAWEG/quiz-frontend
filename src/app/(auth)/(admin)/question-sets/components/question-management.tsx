import QuestionFilters from "@/components/shared/questions/filter";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { QuestionParams, useGetQuestions } from "@/hooks/api/useQuestion";
import { Question } from "@/types/question";
import { Loader2, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

type QuestionManagementProps = {
  addedQuestions: Question[];
  addQuestion: (questionId: string) => void;
  removeQuestion: (questionId: string) => void;
};

export default function QuestionManagement({
  addedQuestions,
  addQuestion,
  removeQuestion,
}: QuestionManagementProps
) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5)
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subSubjectId, setSubSubjectId] = useState("");
  const [questionType, setQuestionType] = useState("");

  const params: QuestionParams = {
    page: page,
    limit: limit,
    search: search,
    subjectId: subjectId || "",
    subSubjectId: subSubjectId || "",
    questionType: questionType || "",
    status: "approved"
  }

  const { data, refetch, isFetching } = useGetQuestions(params)

  useEffect(() => {
    refetch()
  }, [page, limit, refetch])

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Question Management</h1>
      <div className="flex flex-col gap-6">

        <div className="border rounded-lg p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-3">Add Questions</h3>
            <QuestionFilters
              refetch={refetch}
              search={search}
              setSearch={setSearch}
              subjectId={subjectId}
              setSubjectId={setSubjectId}
              subSubjectId={subSubjectId}
              setSubSubjectId={setSubSubjectId}
              questionType={questionType}
              setQuestionType={setQuestionType}
            />
          </div>

          <div className="flex-grow overflow-y-auto space-y-3">
            {isFetching && !data ? (
              <Loader2 className="animate-spin" />
            ) : (
              data?.data.map((question) => (
                <div key={question.id} className="border p-3 rounded-lg flex justify-between items-start">
                  <div>
                    <div className="font-medium">{question.question}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {question.subject.name} • {question.subSubject.name} • {question.type}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuestion(question.id)}
                    disabled={addedQuestions.some(q => q.id === question.id)}
                  >
                    {addedQuestions.some(q => q.id === question.id) ? 'Added' : 'Add'}
                  </Button>
                </div>
              ))
            )
            }

            <Pagination
              limit={limit}
              totalPages={data?.totalPages ?? 0}
              currentPage={data?.currentPage ?? 0}
              onLimitChange={setLimit}
              onPageChange={setPage}
            />
          </div>

        </div>

        <div className="border rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">
              Questions in Set ({addedQuestions.length})
            </h3>
          </div>

          {addedQuestions.length > 0 ? (
            <div className="space-y-3 flex-grow overflow-y-auto">
              {addedQuestions.map((question, index) => (
                <div key={question.id} className="border p-3 rounded-lg flex justify-between items-start">
                  <div>
                    <span className="text-muted-foreground text-sm mr-2">Q{index + 1}.</span>
                    <span>{question.question}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-muted-foreground">
              No questions added yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}