import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { SubscriptionPlan, SubscriptionPlanList, SubscriptionPlanReqDto } from "@/types/subscription-plan";

export interface SubscriptionPlanParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  duration?: string;
}

export const useGetSubscriptionPlans = (params?: SubscriptionPlanParams) => useQuery<SubscriptionPlanList>({
  queryKey: ["subscriptionPlans"],
  queryFn: async () => {
    return await apiClient.get<SubscriptionPlanList>(API_URLS.subscriptionPlan, { params });
  }
})

export const useGetSubscriptionPlanDetail = (subscriptionPlanId: string) => useQuery<SubscriptionPlan>({
  queryKey: ["subscriptionPlan", subscriptionPlanId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<SubscriptionPlan>>(`${API_URLS.subscriptionPlan}/${subscriptionPlanId}`)
    return response.data;
  }
})

export const useGetActiveSubscriptionPlans = () => useQuery<ApiResponse<SubscriptionPlan[]>>({
  queryKey: ["activeSubscriptionPlans"],
  queryFn: async () => {
    return await apiClient.get<ApiResponse<SubscriptionPlan[]>>(`${API_URLS.subscriptionPlan}/active`);
  }
});

export const useCreateSubscriptionPlan = () =>
  useMutation<SubscriptionPlan, ApiError, SubscriptionPlanReqDto>({
    mutationKey: ["createSubscriptionPlan"],
    mutationFn: async (data: SubscriptionPlanReqDto) => await apiClient.post<SubscriptionPlan, SubscriptionPlanReqDto>(`${API_URLS.subscriptionPlan}`, data)
  });

export const useUpdateSubscriptionPlan = () =>
  useMutation<SubscriptionPlan, ApiError, { subscriptionPlanId: string; data: SubscriptionPlanReqDto }>({
    mutationKey: ["updateSubscriptionPlan"],
    mutationFn: async ({ subscriptionPlanId, data }) => await apiClient.put<SubscriptionPlan, SubscriptionPlanReqDto>(`${API_URLS.subscriptionPlan}/${subscriptionPlanId}`, data)
  });

export const useDeleteSubscriptionPlan = () =>
  useMutation<SubscriptionPlan, ApiError, { subscriptionPlanId: string }>({
    mutationKey: ["deleteSubscriptionPlan"],
    mutationFn: async ({ subscriptionPlanId }) => await apiClient.delete<SubscriptionPlan>(`${API_URLS.subscriptionPlan}/${subscriptionPlanId}`)
  })
