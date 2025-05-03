import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionParams, useGetQuestions } from "@/hooks/api/useQuestion";
import { useGetAllSubjects } from "@/hooks/api/useSubject";
import { useGetAllSubSubjects } from "@/hooks/api/useSubSubject";
import { Question } from "@/types/question";
import { Filter, Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [subSubjectId, setSubSubjectId] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<string | null>(null);

  const { data: subjects } = useGetAllSubjects();
  const { data: subSubjects } = useGetAllSubSubjects(subjectId || "");


  const params: QuestionParams = {
    page: 1,
    limit: 10,
    search: searchTerm,
    subjectId: subjectId || "",
    subSubjectId: subSubjectId || "",
    questionType: questionType || "",
  }

  const { data, refetch, isFetching } = useGetQuestions(params)

  const handleSubjectChange = (value: string) => {
    if (value == "all") {
      setSubjectId("");
    } else {
      setSubjectId(value);
    }
  }

  const handleSubSubjectChange = (value: string) => {
    if (value == "all") {
      setSubSubjectId("");
    } else {
      setSubSubjectId(value);
    }
  }

  const handleFilter = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Question Management</h1>
      <div className="flex flex-col gap-6">
        {/* Column 1: Current Questions in Set */}
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

        {/* Column 2: Question Bank */}
        <div className="border rounded-lg p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-3">Add Questions</h3>
            <form onSubmit={handleFilter} className="flex flex-wrap gap-8">
              <Input
                placeholder="Search questions..."
                className="w-[400px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select onValueChange={handleSubjectChange} value={subjectId ?? ""}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={handleSubSubjectChange} value={subSubjectId ?? ""} disabled={!subjectId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub subjects</SelectItem>
                  {subSubjects?.map((subSubject) => (
                    <SelectItem key={subSubject.id} value={subSubject.id}>
                      {subSubject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="default" type="submit"><Filter />Filter</Button>
            </form>
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
          </div>
        </div>
      </div>
    </div>
  );
}