"use client";

import { SubjectReqDto } from "@/dtos/master/subject.dto";
import { useCreateSubject, useGetAllSubjects } from "@/hooks/api/useSubject";
import { useRouter } from "next/navigation";
import { SubjectForm } from "../components/form";
import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Page() {
    const { mutate: createSubject } = useCreateSubject();
    const router = useRouter();
    const { refetch } = useGetAllSubjects();

    const onSubmit = (data: SubjectReqDto) => {
        createSubject(data, {
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
        <>
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

            <SubjectForm onSubmit={onSubmit} />
        </>
    );
}