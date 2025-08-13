"use client";

import { categoryReqDto, CategoryReqDto } from "@/types/category";
import { useCreateCategory, useGetAllCategories } from "@/hooks/api/useCategory";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../components/form";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Page() {
    const { mutate: createCategory, isPending } = useCreateCategory();
    const router = useRouter();
    const { refetch } = useGetAllCategories();

    const form = useForm<CategoryReqDto>({
        resolver: zodResolver(categoryReqDto),
        defaultValues: {
            name: "",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: CategoryReqDto, redirect: boolean) => {
        createCategory(data, {
            onSuccess: () => {
                refetch();

                toast.success("Category created successfully");

                if (redirect) {
                    router.push("/categories");
                } else {
                    form.reset();
                }
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

    return (
        <Card className="p-4">
            <PageHeader
                title="Create Category"
                description="Create your categories here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Categories", href: "/categories" },
                    { label: "Create" }
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
            />
        </Card>

    );
}