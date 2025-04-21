// app/subjects/[id]/page.tsx
"use client"

import { PageHeader } from "@/components/layout/app-header";
import { SubjectReqDto } from "@/types/subject"
import { useGetAllSubjects, useGetSubjectDetail, useUpdateSubject } from "@/hooks/api/useSubject"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react";
import { SubjectForm } from "../../components/form";
import FullPageLoader from "@/components/ui/full-page-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SubjectPage() {
    const router = useRouter();

    const params = useParams()
    const subjectId = params.id as string
    const { data, isFetching } = useGetSubjectDetail(subjectId);
    const { mutate: updateSubject, isPending } = useUpdateSubject()
    const { refetch } = useGetAllSubjects();

    const onSubmit = (data: SubjectReqDto) => {
        updateSubject({ subjectId, data }, {
            onSuccess: () => {
                refetch();

                router.push("/subjects");
            },

            onError: (error: Error) => {
                console.log(error);
            }
        });
    }

    if (isFetching) {
        return <FullPageLoader />
    }

    return (
        <Card className="p-4">
            <PageHeader
                title={`Update Subject`}
                description="Update the subject name below"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Subjects", href: "/subjects" },
                    { label: "Update" }
                ]}
                actions={
                    <Button onClick={() => router.push("/subjects")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                }
            />
            <SubjectForm
                isPending={isPending}
                onSubmit={onSubmit}
                initialValues={{ name: data?.name || "" }}
            />
        </Card>
    )
}