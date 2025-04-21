"use client";

import { useGetAllSubjects } from "@/hooks/api/useSubject";
import { useParams, useRouter } from "next/navigation";
import { QuestionForm } from "../../components/form";
import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetAllSubSubjects } from "@/hooks/api/useSubSubject";
import { useState } from "react";
import { useCreateQuestion, useGetAllQuestions, useGetQuestionDetail, useGetQuestions, useUpdateQuestion } from "@/hooks/api/useQuestion";
import { QuestionReqDto } from "@/types/question";
import FullPageLoader from "@/components/ui/full-page-loader";

export default function Page() {
    const router = useRouter();

    const params = useParams()
    const questionId = params.id as string
    const { data, isFetching } = useGetQuestionDetail(questionId);
    const { mutate: updateQuestion, isPending } = useUpdateQuestion();
    const { refetch } = useGetQuestions();
    const { data: subjects = [] } = useGetAllSubjects();
    const [subSubjectId, setSubSubjectId] = useState<string>();
    const { data: subSubjects = [] } = useGetAllSubSubjects(subSubjectId);

    const onSubmit = (data: QuestionReqDto) => {
        updateQuestion({ questionId, data }, {
            onSuccess: () => {
                refetch();

                router.push("/questions");
            },

            onError: (error: Error) => {
                console.log(error);
            }
        })
    }

    const subjectChange = (subjectId: string) => {
        setSubSubjectId(subjectId);
    }

    console.log(subSubjects);

    if (isFetching) {
        return <FullPageLoader />
    }

    return (
        <Card className="p-4">
            <PageHeader
                title="Update Question"
                description="Update your questions here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Questions", href: "/questions" },
                    { label: "Update" }
                ]}
                actions={
                    <Button onClick={() => router.push("/questions")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                }
            />
            <QuestionForm
                isPending={isPending}
                onSubmit={onSubmit}
                subjects={subjects}
                subSubjects={subSubjects}
                subjectChange={subjectChange}
                initialValues={{
                    type: data?.type || "",
                    subjectId: data?.subject?.id || "",
                    subSubjectId: data?.subSubject?.id || "",
                    question: data?.question || "",
                    difficulty: data?.difficulty || 3,
                    options: data?.options?.map(x => ({option: x.option, isCorrect: x.isCorrect})) || [],
                }}
            />
        </Card>

    );
}