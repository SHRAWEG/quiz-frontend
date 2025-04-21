// app/subjects/[id]/page.tsx
"use client"

import { PageHeader } from "@/components/layout/app-header";
import { useParams, useRouter } from "next/navigation"
import FullPageLoader from "@/components/ui/full-page-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetAllSubSubjects, useGetSubSubjectDetail, useUpdateSubSubject } from "@/hooks/api/useSubSubject";
import { useGetAllSubjects } from "@/hooks/api/useSubject";
import { SubSubjectReqDto } from "@/types/sub-subject";
import { SubSubjectForm } from "../../components/form";

export default function SubjectPage() {
    const router = useRouter();

    const params = useParams()
    const subSubjectId = params.id as string
    const { data, isFetching } = useGetSubSubjectDetail(subSubjectId);
    const { mutate: updateSubject, isPending } = useUpdateSubSubject()
    const { refetch } = useGetAllSubSubjects();
    const { data: subjects, isFetching: isFetchingSubjects } = useGetAllSubjects();

    const onSubmit = (data: SubSubjectReqDto) => {
        updateSubject({ subSubjectId, data }, {
            onSuccess: () => {
                refetch();

                router.push("/sub-subjects");
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
                title={`Update Sub-Subject`}
                description="Update the sub-subject name below"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Sub-Subjects", href: "/sub-subjects" },
                    { label: "Update" }
                ]}
                actions={
                    <Button onClick={() => router.push("/sub-subjects")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                }
            />
            <SubSubjectForm
                isPending={isPending}
                onSubmit={onSubmit}
                initialValues={{
                    subjectId: data?.subject.id || "",
                    name: data?.name || ""
                }}
                subjects={subjects || []}
            />
        </Card>
    )
}