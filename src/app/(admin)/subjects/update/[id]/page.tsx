// app/subjects/[id]/page.tsx
"use client"

import { PageHeader } from "@/components/layout/app-header";
import { SubjectReqDto, SubjectResDto } from "@/dtos/master/subject.dto"
import { useGetAllSubjects, useUpdateSubject } from "@/hooks/api/useSubject"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react";

export default function SubjectPage() {
    const router = useRouter();
    const [ initialValues, setInitialValues ] = useState<SubjectResDto>({
        id: "",
        name: ""
    });

    const params = useParams()
    const subjectId = params.id as string
    const {  } = useUpdateSubject(subjectId)
    const { refetch } = useGetAllSubjects();

    const onSubmit = (data: SubjectReqDto) => {
        updateSubject(data, {
            onSuccess: () => {
                router.push("/subjects");
            },

            onError: (error: Error) => {
                console.log(error);
            }
        });

        refetch();
    }

    return (
        <div className="container mx-auto py-8">
            <PageHeader
                title={`Update Subject`}
                description="Update the subject name below"
            />

            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
                <NameForm subjectId={subjectId} />
            </div>
        </div>
    )
}