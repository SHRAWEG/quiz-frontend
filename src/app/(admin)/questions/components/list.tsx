"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuestionAccordionItem } from "@/app/(common)/questions/components/accordion-item";
import { QuestionParams, useApproveQuestion, useGetQuestions, useRejectQuestion } from "@/hooks/api/useQuestion";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/app-header";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllSubjects } from "@/hooks/api/useSubject";
import { Subject } from "@/types/subject";
import { toast } from "sonner";

export default function QuestionsList() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [searchParam, setSearch] = useState("");
  const [subjectParam, setSubject] = useState("");
  const [pageParam, setPage] = useState(1);
  const [limitParam, setLimit] = useState(10);

  // Create params object for API call
  const params: QuestionParams = {
    page: pageParam,
    limit: limitParam,
    search: searchParam,
    subjectId: subjectParam
  };

  const { data: questionList, isFetching, refetch } = useGetQuestions(params);
  const { data: subjects } = useGetAllSubjects();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubject = (value: string) => {
    if (value === "all") {
      setSubject("");
    } else {
      setSubject(value);
    };
  }

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const { mutate: approveQuestion } = useApproveQuestion();
  const { mutate: rejectQuestion } = useRejectQuestion();

  const handleApprove = (questionId: string) => {
    approveQuestion({ questionId: questionId }, {
      onSuccess: () => {
        toast.success("Question approved successfully")
      },
      onError: (error: Error) => {
        toast.error(error.message);
      }
    })

    refetch();
  }

  const handleReject = (questionId: string) => {
    {
      rejectQuestion({ questionId: questionId }, {
        onSuccess: () => {
          toast.success("Question rejected successfully")
        },
        onError: (error: Error) => {
          toast.error(error.message);
        }
      })

      refetch();
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-4">
      <PageHeader
        title="Questions"
        description="Manage your questions here"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Questions" }
        ]}
      />
      {/* Filters */}
      <QuestionFilters
        onSearch={handleSearch}
        subjects={subjects || []}
        onSubjectChange={handleSubject}
        handleFilter={handleFilter}
        searchValue={searchParam}
        subjectValue={subjectParam}
      />

      {/* Questions List */}
      <div className="space-y-4 my-6">
        {questionList?.data != undefined && questionList.data.length > 0 ? (
          questionList.data.map((question) => (
            <QuestionAccordionItem
              key={question.id}
              question={question}
              isExpanded={expandedId === question.id}
              onToggle={() => toggleExpand(question.id)}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No questions found. Try adjusting your filters.
          </div>
        )}
      </div>

      <QuestionPagination
        currentPage={pageParam}
        totalPages={questionList?.totalPages ?? 1}
        onPageChange={setPage}
        onLimitChange={setLimit}
        limit={limitParam}
      />
    </Card>
  );
}

interface QuestionFiltersProps {
  subjects: Subject[];
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubjectChange: (value: string) => void;
  handleFilter: (e: React.FormEvent<HTMLFormElement>) => void;
  searchValue: string;
  subjectValue: string;
}

function QuestionFilters({
  onSearch,
  subjects,
  onSubjectChange,
  searchValue,
  subjectValue,
  handleFilter
}: QuestionFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 w-full">
        <Input
          placeholder="Search questions..."
          className="max-w-md"
          value={searchValue}
          onChange={onSearch}
        />
        <Select onValueChange={onSubjectChange} value={subjectValue}>
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
        <Button type="submit" variant="default" className="w-[180px]">Filter</Button>
      </form>
    </div>
  );
}

interface QuestionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limit: number;
}

function QuestionPagination({
  currentPage,
  totalPages,
  onPageChange,
  onLimitChange,
  limit
}: QuestionPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Rows per page
        </p>
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={limit.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
