import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { questionTypes } from "@/enums/questions";
import { questionStatuses } from "@/enums/questionStatus";
import { useGetAllSubjects } from "@/hooks/api/useSubject";
import { useGetAllSubSubjects } from "@/hooks/api/useSubSubject";
import { QuestionList } from "@/types/question";
import { QueryObserverResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

interface QuestionFiltersProps {
  refetch: () => Promise<QueryObserverResult<QuestionList, Error>>,
  search?: string,
  setSearch?: Dispatch<SetStateAction<string>>,
  subjectId?: string,
  setSubjectId?: Dispatch<SetStateAction<string>>,
  subSubjectId?: string,
  setSubSubjectId?: Dispatch<SetStateAction<string>>,
  questionType?: string,
  setQuestionType?: Dispatch<SetStateAction<string>>,
  status?: string,
  setStatus?: Dispatch<SetStateAction<string>>,
  setPage?: Dispatch<SetStateAction<number>>
}

export default function QuestionFilters({
  refetch,
  search,
  setSearch,
  subjectId,
  setSubjectId,
  subSubjectId,
  setSubSubjectId,
  questionType,
  setQuestionType,
  status,
  setStatus,
  setPage,
}: QuestionFiltersProps) {

  const { data: subjects } = useGetAllSubjects();
  const { data: subSubjects } = useGetAllSubSubjects(subjectId);

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage?.(1);
    refetch();
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 w-full">
        {
          setSearch && (
            <Input
              placeholder="Search questions..."
              className="max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )
        }

        {
          setQuestionType && (
            <Select
              onValueChange={(value) => setQuestionType(value === "all" ? "" : value)}
              value={questionType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Question Types</SelectItem>
                {questionTypes?.map((questionTypes) => (
                  <SelectItem key={questionTypes.value} value={questionTypes.value}>
                    {questionTypes.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        {
          setSubjectId && (
            <Select
              onValueChange={(value) => {
                setSubjectId(value === "all" ? "" : value)
                setSubSubjectId?.("")
              }}
              value={subjectId}
            >
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
          )
        }

        {
          setSubSubjectId && (
            <Select
              onValueChange={(value) => setSubSubjectId(value === "all" ? "" : value)}
              value={subSubjectId}
              disabled={subjectId === ""}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Sub Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub Subjects</SelectItem>
                {subSubjects?.map((subSubject) => (
                  <SelectItem key={subSubject.id} value={subSubject.id}>
                    {subSubject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        {
          setStatus && (
            <Select
              onValueChange={(value) => setStatus(value === "all" ? "" : value)}
              value={status}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {questionStatuses?.map((questionStatus) => (
                  <SelectItem key={questionStatus.value} value={questionStatus.value}>
                    {questionStatus.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }

        <Button type="submit" variant="default" className="w-[180px]">Filter</Button>
      </form>
    </div >
  );
}