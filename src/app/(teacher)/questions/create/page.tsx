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
import { useCreateQuestion, useGetAllQuestions } from "@/hooks/api/useQuestion";
import { QuestionReqDto } from "@/types/question";

export default function Page() {
    const router = useRouter();
    const { mutate: createQuestion, isPending } = useCreateQuestion();
    const { refetch } = useGetAllQuestions();
    const { data: subjects = [] } = useGetAllSubjects();
    const [subSubjectId, setSubSubjectId] = useState<string>();
    const { data: subSubjects = [] } = useGetAllSubSubjects(subSubjectId);

    const onSubmit = (data: QuestionReqDto) => {
        createQuestion(data, {
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
            />
        </Card>

    );
}