import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { SetUserPreference, User, UserPreference } from "@/types/user";
import { Category } from "@/types/category";

export const useGetUserProfile = () => useQuery<User>({
  queryKey: ["user"],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<User>>(`${API_URLS.user}/profile`)
    return response.data
  }
})

export const useGetUserPreference = () => useQuery<UserPreference>({
  queryKey: ["userPreference"],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<UserPreference>>(`${API_URLS.user}/preferences/`)
    return response.data
  }
})

export const useSetUserPreference = () =>
  useMutation<Category[], ApiError, { data: SetUserPreference }>({
    mutationKey: ["updateSubSubject"],
    mutationFn: async ({ data }) => await apiClient.patch<Category[], SetUserPreference>(`${API_URLS.user}/preferences`, data)
  });
