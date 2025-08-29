"use client";

import { noticeReqDto, NoticeReqDto } from "@/types/notice";
import { useCreateNotice, useGetAllNotices } from "@/hooks/api/useNotice";
import { useRouter } from "next/navigation";
import { NoticeForm } from "../components/form";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Page() {
    const { mutate: createNotice, isPending } = useCreateNotice();
    const router = useRouter();
    const { refetch } = useGetAllNotices();

    const form = useForm<NoticeReqDto>({
        resolver: zodResolver(noticeReqDto),
        defaultValues: {
            title: "",
            content: "",
            fromDate: "",
            toDate: "",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: NoticeReqDto, redirect: boolean) => {
        createNotice(data, {
            onSuccess: () => {
                refetch();

                toast.success("Notice created successfully");

                if (redirect) {
                    router.push("/notices");
                } else {
                    form.reset();
                }
            },

            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    Object.entries(error.data.errors).forEach(([field, messages]) => {
                        form.setError(field as keyof NoticeReqDto, {
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
                title="Create Notice"
                description="Create your notices here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Notices", href: "/notices" },
                    { label: "Create" }
                ]}
                actions={
                    <Button onClick={() => router.push("/notices")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                }
            />
            <NoticeForm
                isPending={isPending}
                onSubmit={onSubmit}
                form={form}
            />
        </Card>

    );
}