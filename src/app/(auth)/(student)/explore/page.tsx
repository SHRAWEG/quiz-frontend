"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { QuestionSetParams, useGetQuizzes } from "@/hooks/api/useQuestionSet";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/ui/pagination";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params: QuestionSetParams = {
    page,
    limit: limit, // Use a multiple of 3 for better grid layout
    search,
    categoryId: ""
  };

  const {
    data: questionSets,
    isLoading,
    isError,
    refetch
  } = useGetQuizzes(params);

  useEffect(() => {
    refetch();
  }, [page, limit, refetch]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when filtering
    refetch();
  };

  if (isError) {
    return (
      <Card className="p-8">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-red-500">
            Failed to load quizzes
          </h2>
          <Button
            onClick={() => refetch()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Explore Quizzes</h1>
        </div>

        {/* Search and Filters */}
        <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </form>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionSets?.data.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-primary">🏷️</span>
                  <CardTitle className="truncate">{quiz.name}</CardTitle>
                </div>
                <CardDescription>Category: {quiz.category?.name || "Uncategorized"}</CardDescription>
                <span className={`inline-flex w-13 items-center px-3 py-1 rounded-full text-sm ${quiz.isFree ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"}`}>
                  {quiz.isFree ? "Free" : "Paid"}
                </span>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600">
                    {quiz.questions?.length || 0} Questions
                  </p>
                  <Button className="mt-4 w-full">Start Quiz</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {isLoading && (
            <>
              {[...Array(3)].map((_, i) => (
                <Card key={`skeleton-${i}`} className="h-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>

      <Pagination
        currentPage={page}
        limit={limit}
        totalPages={questionSets?.totalPages ?? 0}
        onLimitChange={setLimit}
        onPageChange={setPage}
      />
    </Card>
  );
}