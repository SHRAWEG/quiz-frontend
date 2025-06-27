import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UseGetQuestionSetsToAttempt } from "@/hooks/api/useQuestionSet";
import { useStartQuestionSetAttempt } from "@/hooks/api/useQuestionSetAttempt";
import { QuestionSetToAttempt } from "@/types/question-set";
import { Award, Clock, Filter, Search, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type filter = {
  search: string;
  categoryId: string;
}

const formatTime = (totalSeconds: number): string => {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export default function QuestionSetList() {
  const router = useRouter();

  // State management
  const [search, setSearch] = useState<string>("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [filter, setFilter] = useState<filter>({
    search: "",
    categoryId: "",
  })

  const [allQuestionSets, setAllQuestionSets] = useState<QuestionSetToAttempt[]>([])
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Infinite scroll observer ref
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // API params
  const params = useMemo(() => ({
    page,
    limit: 9,
    search: filter.search,
    categoryId: filter.categoryId,
  }), [page, filter]);

  const {
    data: questionSets,
    isLoading,
    isError,
    refetch
  } = UseGetQuestionSetsToAttempt(params);

  const { mutate: startQuiz } = useStartQuestionSetAttempt();

  useEffect(() => {
    if (!questionSets?.data) return;

    if (page === 1) {
      // On filter/search, reset the list
      setAllQuestionSets(questionSets.data);
    } else {
      console.log("page", page);
      // On scroll, append new data
      setAllQuestionSets(prev => [...prev, ...questionSets.data]);
    }
    setHasMore(page < (questionSets.totalPages || 1));
    setIsInitialLoad(false);
  }, [questionSets, page])

  // Infinite scroll observer callback
  const lastQuizRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isInitialLoad) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, isInitialLoad]);

  // Handle filter submission
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({
      search,
      categoryId,
    })
    setPage(1);
    setAllQuestionSets([]);
    refetch();
  };

  const handleStatQuiz = (questionSetId: string) => {
    startQuiz({ questionSetId }, {
      onSuccess: (res) => {
        router.push(`/question-set-attempt/${res.data.id}`);

        toast.success(res.message);
      },
      onError: (err) => {
        toast.error(err.data.message);
      }
    })
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load question sets
        </h2>
        <Button
          onClick={() => refetch()}
          className="mt-4 gap-2"
          variant="outline"
        >
          <Zap className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Filters */}
      <form onSubmit={handleFilter} className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button type="submit" className="h-12 gap-2">
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </form>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allQuestionSets?.map((questionSet, index) => (
          <Card
            key={`${questionSet.id}-${index}`}
            ref={index === allQuestionSets.length - 1 ? lastQuizRef : null}
            className="hover:shadow-lg transition-shadow h-full flex flex-col group"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <CardTitle className="text-lg line-clamp-2">
                    {questionSet.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {questionSet.category?.name || "General"}
                  </CardDescription>
                </div>
                <Badge
                  className={`${questionSet.isFree ? "bg-blue-500 text-white" : "bg-amber-500 text-white"}`}
                >
                  {questionSet.isFree ? "Free" : "Paid"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {questionSet.isTimeLimited ? (
                    <span>{formatTime(questionSet.timeLimitSeconds ?? 0)}</span>
                  ) : (
                    <span>No Time Limit</span>
                  )
                  }
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Questions</span>
                  <span className="font-medium">
                    {questionSet.questionsCount}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full group-hover:bg-primary/90 transition-colors"
                onClick={() => handleStatQuiz(questionSet.id)}
              >
                Start
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Loading Skeletons */}
        {(isLoading || isInitialLoad) && (
          <>
            {[...Array(9)].map((_, i) => (
              <Card key={`skeleton-${i}`} className="h-full">
                <CardHeader className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Loading spinner */}
      <div ref={loadingRef} className="flex justify-center py-4">
        {isLoading && !isInitialLoad && (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        )}
      </div>

      {/* End of results */}
      {!hasMore && allQuestionSets.length > 0 && (
        <div className="text-center py-6 text-muted-foreground">
          You've reached the end of available quizzes
        </div>
      )}

      {/* Empty state */}
      {!isLoading && allQuestionSets.length === 0 && !isInitialLoad && (
        <div className="text-center py-12 space-y-4">
          <Award className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold">No quizzes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setCategoryId('');
              setFilter({
                search: '',
                categoryId: '',
              });
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}