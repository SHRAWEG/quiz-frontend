import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { InitiateCredit } from "@/types/credit";

// export const useGetSubscriptionPlanDetail = (subscriptionPlanId: string) => useQuery<UserSubscription>({
//   queryKey: ["subscriptionPlan", subscriptionPlanId],
//   queryFn: async () => {
//     const response = await apiClient.get<ApiResponse<UserSubscription>>(`${API_URLS.subscriptionPlan}/${subscriptionPlanId}`)
//     return response.data;
//   }
// })

export const useGetBalance = () => useQuery<number>({
  queryKey: ["balance"],
  queryFn: async () => {
    return await apiClient.get<number>(`${API_URLS.credit}/balance`);
  }
});

export const useInitiateCredit = () =>
  useMutation<ApiResponse<InitiateCredit>, ApiError, { credits: number }>({
    mutationKey: ["initiateCredit"],
    mutationFn: async ({ credits }) => await apiClient.post<ApiResponse<InitiateCredit>>(`${API_URLS.creditPurchase}/initiate/${credits}`)
  });

export const useCancelCredit = () =>
  useMutation<ApiResponse, ApiError, { transactionUuid: string }>({
    mutationKey: ["cancelCredit"],
    mutationFn: async ({ transactionUuid }) => await apiClient.post<ApiResponse>(`${API_URLS.creditPurchase}/cancel/${transactionUuid}`)
  });

export const useVerifyCredit = () =>
  useMutation<ApiResponse, ApiError, { data: string }>({
    mutationKey: ["verifyCredit"],
    mutationFn: async ({ data }) => await apiClient.post<ApiResponse>(`${API_URLS.creditPurchase}/verify/${data}`)
  });

export const usePurchaseQuestionSet = () =>
  useMutation<ApiResponse, ApiError, { questionSetId: string }>({
    mutationKey: ["purchaseQuestionSet"],
    mutationFn: async ({ questionSetId }) => await apiClient.post<ApiResponse>(`${API_URLS.credit}/purchase/${questionSetId}`)
  });

