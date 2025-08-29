// app/notices/[id]/page.tsx
"use client";

import { PageHeader } from "@/components/ui/page-header";
import { noticeReqDto, NoticeReqDto } from "@/types/notice";
import {
  useGetAllNotices,
  useGetNoticeDetail,
  useUpdateNotice,
} from "@/hooks/api/useNotice";
import { useParams, useRouter } from "next/navigation";
import { NoticeForm } from "../../components/form";
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

  const params = useParams();
  const noticeId = params.id as string;
  const { data, isFetching } = useGetNoticeDetail(noticeId);
  const { mutate: updateNotice, isPending } = useUpdateNotice();
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

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title || "",
        content: data.content || "",
        fromDate: data.fromDate || "",
        toDate: data.toDate || "",
      });
    }
  }, [data, form]);

  const onSubmit = (data: NoticeReqDto) => {
    updateNotice(
      { noticeId, data },
      {
        onSuccess: () => {
          refetch();
          toast.success("Notice updated successfully");

          router.push("/notices");
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
        },
      }
    );
  };
  if (isFetching) {
    return <FullPageLoader />;
  }

  return (
    <Card className="p-4">
      <PageHeader
        title={`Update Notice`}
        description="Update the notice name below"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Subjects", href: "/notices" },
          { label: "Update" },
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
        isUpdate={true}
      />
    </Card>
  );
}
