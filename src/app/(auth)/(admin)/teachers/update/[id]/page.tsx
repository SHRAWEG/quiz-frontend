// app/categories/[id]/page.tsx
"use client"

import { PageHeader } from "@/components/ui/page-header";
import { categoryReqDto, CategoryReqDto } from "@/types/category"
import { useGetAllCategories, useGetCategoryDetail, useUpdateCategory } from "@/hooks/api/useCategory"
import { useParams, useRouter } from "next/navigation"
import { CategoryForm } from "../../components/form";
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
    const categoryId = params.id as string
    const { data, isFetching } = useGetCategoryDetail(categoryId);
    const { mutate: updateCategory, isPending } = useUpdateCategory()
    const { refetch } = useGetAllCategories();

    const form = useForm<CategoryReqDto>({
        resolver: zodResolver(categoryReqDto),
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

    const onSubmit = (data: CategoryReqDto) => {
        updateCategory({ categoryId, data }, {
            onSuccess: () => {
                refetch();
                toast.success("Category updated successfully");

                router.push("/categories");
            },

            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    Object.entries(error.data.errors).forEach(([field, messages]) => {
                        form.setError(field as keyof CategoryReqDto, {
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
                title={`Update Category`}
                description="Update the category name below"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Subjects", href: "/categories" },
                    { label: "Update" }
                ]}
                actions={
                    <Button onClick={() => router.push("/categories")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                }
            />
            <CategoryForm
                isPending={isPending}
                onSubmit={onSubmit}
                form={form}
                isUpdate={true}
            />
        </Card>
    )
}