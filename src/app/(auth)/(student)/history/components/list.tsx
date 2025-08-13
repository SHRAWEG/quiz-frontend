// app/history/page.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetQuestionSetAttempts } from "@/hooks/api/useQuestionSetAttempt";
import { QuestionSetAttempt } from "@/types/question-set-attempt";
import { formatISODate } from "@/lib/format-date";

export default function QuestionSetAttemptList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  // const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");

  const params = {
    page,
    limit: pageSize,
    search: "",
    status: statusFilter === "all" ? "" : statusFilter,
  };

  const { data, isLoading, isError } = useGetQuestionSetAttempts(params);

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setPage(1); // Reset to first page when searching
  // };

  const getStatusBadge = (attempt: QuestionSetAttempt) => {
    if (!attempt.isCompleted) {
      return <Badge variant="secondary">In Progress</Badge>;
    }
    if (!attempt.isChecked) {
      return (
        <Badge variant="default" className="bg-amber-500">
          Review Pending
        </Badge>
      );
    }
    if (attempt.isChecked) {
      return <Badge variant="success">Completed</Badge>;
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 60) return "text-lime-600";
    if (percentage >= 40) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="">
      {/* Filters */}
      <div className="mb-6">
        <form className="flex gap-4 mb-4">
          {/* <Input
            placeholder="Search question sets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          /> */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Attempts</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">Review Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button type="submit">Search</Button> */}
        </form>
      </div>

      {/* Attempts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))
        ) : isError ? (
          <div className="text-red-500">Error loading attempts</div>
        ) : data?.data.length ? (
          data.data.map((attempt) => (
            <Card
              key={attempt.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {attempt.questionSet.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Attempt #{attempt.attemptNumber} •{" "}
                      {formatISODate(attempt?.startedAt?.toString())}
                    </p>
                  </div>
                  {getStatusBadge(attempt)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p
                      className={`text-xl font-semibold ${
                        attempt.isChecked
                          ? getPercentageColor(attempt.percentage)
                          : "text-muted-foreground"
                      }`}
                    >
                      {attempt.isChecked ? attempt.score : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Percentage</p>
                    <p
                      className={`text-xl font-semibold ${
                        attempt.isChecked
                          ? getPercentageColor(attempt.percentage)
                          : "text-muted-foreground"
                      }`}
                    >
                      {attempt.isChecked
                        ? `${attempt.percentage.toFixed(1)}%`
                        : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion</p>
                    <p className="text-xl font-semibold">
                      {attempt.completedAt
                        ? `${formatISODate(attempt?.completedAt?.toString())}`
                        : "Not completed"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                {attempt.isCompleted ? (
                  <Button
                    variant="default"
                    className="cursor-pointer hover:bg-gray-600"
                    disabled={!attempt.isChecked}
                    onClick={() =>
                      (window.location.href = `/question-set-attempt/${attempt.id}/results`)
                    }
                  >
                    View Details
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="cursor-pointer hover:bg-gray-600"
                      onClick={() =>
                      (window.location.href = `/question-set-attempt/${attempt.id}`)
                    }
                  >
                    Continue Attempt
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No attempts found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page {data.currentPage} of {data.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(data.totalPages, page + 1))}
              disabled={page === data.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(data.totalPages)}
              disabled={page === data.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[6, 9, 21, 30, 42, 51].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
