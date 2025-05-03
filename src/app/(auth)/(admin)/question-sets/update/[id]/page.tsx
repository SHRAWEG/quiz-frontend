// app/categories/[id]/page.tsx
"use client"

import { PageHeader } from "@/components/layout/app-header";
import { useParams, useRouter } from "next/navigation"
import FullPageLoader from "@/components/ui/full-page-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetQuestionSets, useGetQuestionSetDetail, useUpdateQuestionSet, useAddQuestionToSet, useRemoveQuestionFromSet } from "@/hooks/api/useQuestionSet";
import { useGetAllCategories } from "@/hooks/api/useCategory";
import { questionSetReqDto, QuestionSetReqDto } from "@/types/question-set";
import { QuestionSetForm } from "../../components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import QuestionManagement from "../../components/question-management";

export default function SubjectPage() {
    const router = useRouter();

    const params = useParams()
    const questionSetId = params.id as string
    const { data, isFetching, refetch: refetchDetail } = useGetQuestionSetDetail(questionSetId);
    const { mutate: updateQuestionSet, isPending } = useUpdateQuestionSet()
    const { refetch } = useGetQuestionSets();
    const { data: categories, isFetching: isCategoryFetching } = useGetAllCategories();
    const { mutate: addQuestionToSet } = useAddQuestionToSet()
    const { mutate: removeQuestionFromSet } = useRemoveQuestionFromSet()

    const form = useForm<QuestionSetReqDto>({
        resolver: zodResolver(questionSetReqDto),
        defaultValues: {
            categoryId: "",
            name: "",
            isFree: false,
        },
        mode: "onBlur",
    });

    useEffect(() => {
        if (data) {
            form.reset({
                categoryId: data.categoryId,
                name: data.name || "",
                isFree: data.isFree || false,
            });
            form.setValue("categoryId", data.categoryId);
        }
    }, [data, form]);

    const onSubmit = (data: QuestionSetReqDto) => {
        updateQuestionSet({ questionSetId, data }, {
            onSuccess: () => {
                refetchDetail();

                toast.success("question-set updated successfully");
            },

            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    Object.entries(error.data.errors).forEach(([field, messages]) => {
                        form.setError(field as keyof QuestionSetReqDto, {
                            type: "manual",
                            message: (messages as string[]).join(", "),
                        });
                    });
                }
            }
        });
    }

    const addQuestion = (questionId: string) => {
        addQuestionToSet({ questionSetId, questionId }, {
            onSuccess: () => {
                refetchDetail();
                toast.success("question added successfully")
            },
            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    toast.error("Question already exists in this question-set or question is not approved")
                }
            }
        })
    }

    const removeQuestion = (questionId: string) => {
        removeQuestionFromSet({ questionSetId, questionId }, {
            onSuccess: () => {
                refetchDetail();
                toast.success("question removed successfully")
            },
            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    toast.error("Question already exists in this question-set or question is not approved")
                }
            }
        })
    }


    if (!data && isFetching) {
        return <FullPageLoader />
    }

    return (
        <Card className="p-4">
            <PageHeader
                title={`Update Question Set`}
                description="Update the question-set name below"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "question-sets", href: "/question-sets" },
                    { label: "Update" }
                ]}
                actions={
                    <Button onClick={() => router.push("/question-sets")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                }
            />
            <QuestionSetForm
                isPending={isPending}
                onSubmit={onSubmit}
                categories={categories || []}
                form={form}
                isUpdate={true}
            />

            <QuestionManagement
                addedQuestions={data?.questions || []}
                addQuestion={addQuestion}
                removeQuestion={removeQuestion}
            />
        </Card>
    )
}