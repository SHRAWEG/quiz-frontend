"use client";

import { PageHeader } from "@/components/ui/page-header";
import {
  subscriptionPlanReqSchema,
  SubscriptionPlanReqDto,
} from "@/types/subscription-plan";
import {
  useGetSubscriptionPlanDetail,
  useUpdateSubscriptionPlan,
} from "@/hooks/api/useSubscriptionPlan";
import { useParams, useRouter } from "next/navigation";
import { SubscriptionPlanForm } from "../../components/form";
import FullPageLoader from "@/components/ui/full-page-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/axios";
import { useEffect } from "react";

export default function SubscriptionPlanUpdatePage() {
  const router = useRouter();

  const params = useParams();
  const subscriptionPlanId = params.id as string;
  const { data, isFetching } = useGetSubscriptionPlanDetail(subscriptionPlanId);
  const { mutate: updateSubscriptionPlan, isPending } =
    useUpdateSubscriptionPlan();

  const form = useForm<SubscriptionPlanReqDto>({
    resolver: zodResolver(subscriptionPlanReqSchema),
    defaultValues: {
      name: "",
      duration: data?.duration || "", // Initialize with empty string
      price: 0, // Initialize with 0
      description: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        duration: data.duration || "",
        price: data.price !== undefined ? Number(data.price) : 0,
        description: data.description || "",
      });
    }
  }, [data, form]);

  const onSubmit = (data: SubscriptionPlanReqDto, redirect: boolean) => {
    updateSubscriptionPlan(
      { subscriptionPlanId, data },
      {
        onSuccess: () => {
          toast.success("Subscription plan updated successfully");
          if (redirect) {
            router.push("/subscription-plans");
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
        title={`Update Subscription Plan`}
        description="Update the subscription plan details below"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Subscription Plans", href: "/subscription-plans" },
          { label: "Update" },
        ]}
        actions={
          <Button onClick={() => router.push("/subscription-plans")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />
      <SubscriptionPlanForm
        isPending={isPending}
        onSubmit={onSubmit}
        form={form}
        isUpdate={true}
      />
    </Card>
  );
}
