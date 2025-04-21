"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCreateSubSubject, useGetAllSubSubjects } from "@/hooks/api/useSubSubject";
import { SubSubjectReqDto } from "@/types/sub-subject";
import { SubSubjectForm } from "../components/form";
import { useGetAllSubjects } from "@/hooks/api/useSubject";

export default function Page() {
    const { mutate: CreateSubSubject, isPending } = useCreateSubSubject();
    const router = useRouter();
    const { refetch } = useGetAllSubSubjects();
    const { data: subjects, isFetching } = useGetAllSubjects();

    const onSubmit = (data: SubSubjectReqDto) => {
        CreateSubSubject(data, {
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
        return <Loader2 className="animate-spin" />
    }

    return (
        <><Card className="p-4">
            <PageHeader
                title="Create Sub-Subject"
                description="Create your sub-subjects here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Sub-Subjects", href: "/sub-subjects" },
                    { label: "Create" }
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
            />
        </Card>
        </>

    );
}