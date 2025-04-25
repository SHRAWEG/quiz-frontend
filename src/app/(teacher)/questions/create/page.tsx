"use client";

import { useGetAllSubjects } from "@/hooks/api/useSubject";
import { useRouter } from "next/navigation";
import { QuestionForm } from "../components/form";
import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetAllSubSubjects } from "@/hooks/api/useSubSubject";
import { useState } from "react";
import { useCreateQuestion, useGetQuestions } from "@/hooks/api/useQuestion";
import { questionReqDto, QuestionReqDto } from "@/types/question";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";

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
    const { mutate: createQuestion, isPending } = useCreateQuestion();
    const { refetch } = useGetQuestions();
    const { data: subjects = [] } = useGetAllSubjects();
    const [subSubjectId, setSubSubjectId] = useState<string>();
    const { data: subSubjects = [] } = useGetAllSubSubjects(subSubjectId);

    const form = useForm<QuestionFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "mcq",
            subjectId: "",
            subSubjectId: "",
            question: "",
            options: [
                { option: "", isCorrect: false },
                { option: "", isCorrect: false },
                { option: "", isCorrect: false },
                { option: "", isCorrect: false }
            ],
            difficulty: 3,
        },
        mode: "onBlur",
    });

    const onSubmit = (data: QuestionReqDto) => {
        createQuestion(data, {
            onSuccess: () => {
                refetch();

                toast.success("Question created successfully");

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

    return (
        <Card className="p-4">
            <PageHeader
                title="Create Question"
                description="Create your questions here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Questions", href: "/questions" },
                    { label: "Create" }
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
            />
        </Card>

    );
}