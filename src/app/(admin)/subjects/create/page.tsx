"use client";

import { subjectReqDto, SubjectReqDto } from "@/types/subject";
import { useCreateSubject, useGetAllSubjects } from "@/hooks/api/useSubject";
import { useRouter } from "next/navigation";
import { SubjectForm } from "../components/form";
import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Page() {
    const { mutate: createSubject, isPending } = useCreateSubject();
    const router = useRouter();
    const { refetch } = useGetAllSubjects();

    const form = useForm<SubjectReqDto>({
        resolver: zodResolver(subjectReqDto),
        defaultValues: {
            name: "",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: SubjectReqDto, redirect: boolean) => {
        createSubject(data, {
            onSuccess: () => {
                refetch();

                toast.success("Subject created successfully");

                if (redirect) {
                    router.push("/subjects");
                } else {
                    form.reset();
                }
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

    return (
        <Card className="p-4">
            <PageHeader
                title="Create Subject"
                description="Create your subjects here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Subjects", href: "/subjects" },
                    { label: "Create" }
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

    );
}