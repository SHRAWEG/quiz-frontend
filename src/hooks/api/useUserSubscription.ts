import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { UserSubscription, UserSubscriptionStatus } from "@/types/user-subscription";

// export const useGetSubscriptionPlanDetail = (subscriptionPlanId: string) => useQuery<UserSubscription>({
//   queryKey: ["subscriptionPlan", subscriptionPlanId],
//   queryFn: async () => {
//     const response = await apiClient.get<ApiResponse<UserSubscription>>(`${API_URLS.subscriptionPlan}/${subscriptionPlanId}`)
//     return response.data;
//   }
// })

export const useGetUserSubscriptionStatus = () => useQuery<UserSubscriptionStatus>({
  queryKey: ["userSubscriptionStatus"],
  queryFn: async () => {
    return await apiClient.get<UserSubscriptionStatus>(`${API_URLS.userSubscription}/status`);
  }
});

export const useCheckout = () =>
  useMutation<ApiResponse<UserSubscription>, ApiError, { subscriptionPlanId: string }>({
    mutationKey: ["checkout"],
    mutationFn: async ({ subscriptionPlanId }) => await apiClient.post<ApiResponse<UserSubscription>>(`${API_URLS.userSubscription}/checkout/${subscriptionPlanId}`)
  });

export const useUpdatePayment = () =>
  useMutation<ApiResponse<UserSubscription>, ApiError, { data: string }>({
    mutationKey: ["updatePayment"],
    mutationFn: async ({ data }) => await apiClient.post<ApiResponse<UserSubscription>>(`${API_URLS.userSubscription}/updatePayment/${data}`)
  });

