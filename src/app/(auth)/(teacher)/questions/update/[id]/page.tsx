"use client";

import { useGetAllSubjects } from "@/hooks/api/useSubject";
import { useParams, useRouter } from "next/navigation";
import { QuestionForm } from "../../components/form";
import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetAllSubSubjects } from "@/hooks/api/useSubSubject";
import { useEffect, useState } from "react";
import { useGetQuestionDetail, useGetQuestions, useUpdateQuestion } from "@/hooks/api/useQuestion";
import { questionReqDto, QuestionReqDto } from "@/types/question";
import FullPageLoader from "@/components/ui/full-page-loader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { QUESTION_TYPES } from "@/constants/questions";

// Create a schema for the subjectId field
const subjectIdSchema = z.object({
    subjectId: z.string().min(1, "Subject is required"),
});

// Merge the original schema with our new field
const formSchema = z.intersection(
    questionReqDto,
    subjectIdSchema
);

// Define the type for our form data
export type QuestionFormData = QuestionReqDto & { subjectId: string };

export default function Page() {
    const router = useRouter();

    const params = useParams()
    const questionId = params.id as string
    const { data, isFetching: isQuestionFetching } = useGetQuestionDetail(questionId);
    const { mutate: updateQuestion, isPending } = useUpdateQuestion();
    const { refetch } = useGetQuestions();
    const { data: subjects = [], isFetching: isSubjectFetching } = useGetAllSubjects();
    const [subSubjectId, setSubSubjectId] = useState<string>();
    const { data: subSubjects = [], isFetching: isSubSubjectFetching } = useGetAllSubSubjects(subSubjectId);

    const form = useForm<QuestionFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "mcq",
            subjectId: "",
            subSubjectId: "",
            questionText: "",
            options: [
                { optionText: "", isCorrect: false },
                { optionText: "", isCorrect: false },
                { optionText: "", isCorrect: false },
                { optionText: "", isCorrect: false }
            ],
            correctAnswerBoolean: false,
            correctAnswerText: "",
            difficulty: 3,
        },
        mode: "onBlur",
    });

    useEffect(() => {
        if (data) {
            form.reset({
                type: data.type,
                subjectId: data.subjectId,
                subSubjectId: data.subSubjectId,
                questionText: data.questionText,
                options: data.options.map(x => ({ optionText: x.optionText, isCorrect: x.isCorrect })) || [],
                correctAnswerBoolean: data.type === QUESTION_TYPES.TRUE_FALSE ? data.correctAnswerBoolean : null,
                correctAnswerText: data.type === QUESTION_TYPES.FILL_IN_THE_BLANKS ? data.correctAnswerText : "",
                difficulty: data.difficulty,
            });
            form.setValue("subjectId", data.subjectId);
            form.setValue("subSubjectId", data.subSubjectId);
            setSubSubjectId(data.subjectId);
        }
        form.watch();
    }, [data, form]);

    const onSubmit = (data: QuestionReqDto) => {
        updateQuestion({ questionId, data }, {
            onSuccess: () => {
                refetch();

                toast.success("Question updated successfully");

                router.push("/questions");
            },

            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    Object.entries(error.data.errors).forEach(([field, messages]) => {
                        form.setError(field as keyof QuestionReqDto, {
                            type: "manual",
                            message: (messages as string[]).join(", "),
                        });
                    })
                }
            }
        })
    }

    const subjectChange = (subjectId: string) => {
        setSubSubjectId(subjectId);
    }

    if (isQuestionFetching || isSubjectFetching || isSubSubjectFetching) {
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
                form={form}
                isUpdate={true}
            />
        </Card>

    );
}