"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuestionAccordionItem } from "@/components/shared/questions/accordion-item";
import { QuestionParams, useApproveQuestion, useGetQuestions, useRejectQuestion } from "@/hooks/api/useQuestion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import QuestionFilters from "@/components/shared/questions/filter";
import { ApiError } from "@/lib/axios";

export default function QuestionsList() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [subSubjectId, setSubSubjectId] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [status, setStatus] = useState("");
    const [pageParam, setPage] = useState(1);
    const [limitParam, setLimit] = useState(10);

    // Create params object for API call
    const params: QuestionParams = {
        page: pageParam,
        limit: limitParam,
        search: search,
        subjectId: subjectId,
        subSubjectId: subSubjectId,
        questionType: questionType,
        status: status
    };

    const { data: questionList, isFetching, refetch } = useGetQuestions(params);

    const { mutate: approveQuestion } = useApproveQuestion();
    const { mutate: rejectQuestion } = useRejectQuestion();

    const handleApprove = (questionId: string) => {
        approveQuestion({ questionId: questionId }, {
            onSuccess: () => {
                refetch();

                toast.success("Question approved successfully")
            },
            onError: (error: ApiError) => {
                toast.error(error.data.message);
            }
        })
    }

    const handleReject = (questionId: string) => {
        {
            rejectQuestion({ questionId: questionId }, {
                onSuccess: () => {
                    refetch();
                    toast.success("Question rejected successfully")
                },
                onError: (error: ApiError) => {
                    toast.error(error.data.message);
                }
            })

        }
    }

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        refetch();
    }, [pageParam, limitParam, refetch])

    return (
        <>
            {/* Filters */}
            <QuestionFilters
                refetch={refetch}
                search={search}
                setSearch={setSearch}
                subjectId={subjectId}
                setSubjectId={setSubjectId}
                subSubjectId={subSubjectId}
                setSubSubjectId={setSubSubjectId}
                setPage={setPage}
                questionType={questionType}
                setQuestionType={setQuestionType}
                status={status}
                setStatus={setStatus}
            />
            {isFetching && !questionList ? (
                <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            ) : (
                <>
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
                </>
            )}

        </>
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
