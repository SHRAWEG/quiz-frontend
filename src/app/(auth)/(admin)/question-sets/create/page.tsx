"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCreateQuestionSet, useGetQuestionSets } from "@/hooks/api/useQuestionSet";
import { questionSetReqDto, QuestionSetReqDto } from "@/types/question-set";
import { QuestionSetForm } from "../components/form";
import { useGetAllCategories } from "@/hooks/api/useCategory";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";

export default function Page() {
  const { mutate: CreateQuestionSet, isPending } = useCreateQuestionSet();
  const router = useRouter();
  const { refetch } = useGetQuestionSets();
  const { data: categories, isFetching } = useGetAllCategories();

  const form = useForm<QuestionSetReqDto>({
    resolver: zodResolver(questionSetReqDto),
    defaultValues: {
      categoryId: "",
      name: "",
      isFree: false,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: QuestionSetReqDto) => {
    CreateQuestionSet(data, {
      onSuccess: (res) => {
        refetch();

        toast.success("Question-set created successfully");
        
        router.push(`/question-sets/update/${res.data.id}`)
      },

      onError: (error: ApiError) => {
        if (error.status === 400 && error.data.errors) {
          Object.entries(error.data.errors).forEach(([field, messages]) => {
            form.setError(field as keyof QuestionSetReqDto, {
              type: "manual",
              message: (messages as string[]).join(", "),
            });
          })
        }
      }
    });
  }

  if (isFetching) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <><Card className="p-4">
      <PageHeader
        title="Create Question Set"
        description="Create your question-sets here"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "question-sets", href: "/question-sets" },
          { label: "Create" }
        ]}
        actions={
          <Button onClick={() => router.push("/question-sets")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <QuestionSetForm
        isPending={isPending}
        onSubmit={onSubmit}
        categories={categories || []}
        form={form}
      />
    </Card>
    </>

  );
}