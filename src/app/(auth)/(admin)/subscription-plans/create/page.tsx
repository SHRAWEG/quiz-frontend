"use client";

import { subscriptionPlanReqSchema, SubscriptionPlanReqDto } from "@/types/subscription-plan";
import { useCreateSubscriptionPlan, useGetSubscriptionPlans } from "@/hooks/api/useSubscriptionPlan";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../components/form";
import { PageHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Page() {
    const { mutate: createSubscriptionPlan, isPending } = useCreateSubscriptionPlan();
    const router = useRouter();
    const { refetch } = useGetSubscriptionPlans();

    const form = useForm<SubscriptionPlanReqDto>({
        resolver: zodResolver(subscriptionPlanReqSchema),
        defaultValues: {
            name: "",
            description: "",
            duration: "MONTHLY", // Default value, can be changed as needed
            price: 0,
        },
        mode: "onBlur",
    });

    const onSubmit = (data: SubscriptionPlanReqDto, redirect: boolean) => {
        createSubscriptionPlan(data, {
            onSuccess: () => {
                refetch();

                toast.success("Subscription Plan created successfully");

                if (redirect) {
                    router.push("/subscription-plans");
                } else {
                    form.reset();
                }
            },

            onError: (error: ApiError) => {
                if (error.status === 400 && error.data.errors) {
                    Object.entries(error.data.errors).forEach(([field, messages]) => {
                        form.setError(field as keyof SubscriptionPlanReqDto, {
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
                title="Create Subscription Plan"
                description="Create your subscription plans here"
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Subscription Plans", href: "/subscription-plans" },
                    { label: "Create" }
                ]}
                actions={
                    <Button onClick={() => router.push("/subscription-plans")}>
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