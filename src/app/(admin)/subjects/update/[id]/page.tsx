// app/subjects/[id]/page.tsx
"use client"

import { PageHeader } from "@/components/layout/app-header";
import { subjectReqDto, SubjectReqDto } from "@/types/subject"
import { useGetAllSubjects, useGetSubjectDetail, useUpdateSubject } from "@/hooks/api/useSubject"
import { useParams, useRouter } from "next/navigation"
import { SubjectForm } from "../../components/form";
import FullPageLoader from "@/components/ui/full-page-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { useEffect } from "react";

export default function SubjectPage() {
    const router = useRouter();

    const params = useParams()
    const subjectId = params.id as string
    const { data, isFetching } = useGetSubjectDetail(subjectId);
    const { mutate: updateSubject, isPending } = useUpdateSubject()
    const { refetch } = useGetAllSubjects();

    const form = useForm<SubjectReqDto>({
        resolver: zodResolver(subjectReqDto),
        defaultValues: {
            name: "",
        },
        mode: "onBlur",
    });

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name || "",
            });
        }
    }, [data, form]);

    const onSubmit = (data: SubjectReqDto) => {
        updateSubject({ subjectId, data }, {
            onSuccess: () => {
                refetch();
                toast.success("Subject updated successfully");

                router.push("/subjects");
            },

            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    Object.entries(error.data.errors).forEach(([field, messages]) => {
                        form.setError(field as keyof SubjectReqDto, {
                            type: "manual",
                            message: (messages as string[]).join(", "),
                        });
                    });
                }
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
                form={form}
            />
        </Card>
    )
}