// app/subjects/[id]/page.tsx
"use client"

import { PageHeader } from "@/components/ui/page-header";
import { useParams, useRouter } from "next/navigation"
import FullPageLoader from "@/components/ui/full-page-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGetAllSubSubjects, useGetSubSubjectDetail, useUpdateSubSubject } from "@/hooks/api/useSubSubject";
import { useGetAllSubjects } from "@/hooks/api/useSubject";
import { subSubjectReqDto, SubSubjectReqDto } from "@/types/sub-subject";
import { SubSubjectForm } from "../../components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";

export default function SubjectPage() {
    const router = useRouter();

    const params = useParams()
    const subSubjectId = params.id as string
    const { data, isFetching } = useGetSubSubjectDetail(subSubjectId);
    const { mutate: updateSubject, isPending } = useUpdateSubSubject()
    const { refetch } = useGetAllSubSubjects();
    const { data: subjects, isFetching: isSubjectFetching } = useGetAllSubjects();

    const form = useForm<SubSubjectReqDto>({
        resolver: zodResolver(subSubjectReqDto),
        defaultValues: {
            subjectId: "",
            name: ""
        },
        mode: "onBlur",
    });

    useEffect(() => {
        if (data) {
            form.reset({
                subjectId: data.subject.id,
                name: data.name || "",
            });
            form.setValue("subjectId", data.subjectId);
        }
    }, [data, form]);

    const onSubmit = (data: SubSubjectReqDto) => {
        updateSubject({ subSubjectId, data }, {
            onSuccess: () => {
                refetch();

                toast.success("Sub-Subject updated successfully");
            },

            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    Object.entries(error.data.errors).forEach(([field, messages]) => {
                        form.setError(field as keyof SubSubjectReqDto, {
                            type: "manual",
                            message: (messages as string[]).join(", "),
                        });
                    });
                }
            }
        });
    }

    if (isFetching || isSubjectFetching) {
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
                subjects={subjects || []}
                form={form}
                isUpdate={true}
            />
        </Card>
    )
}