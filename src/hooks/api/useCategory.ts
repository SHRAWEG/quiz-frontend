import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Category, CategoryReqDto } from "@/types/category";
import { API_URLS } from "@/lib/constants/api-urls";

export const useGetCategoryDetail = (categoryId: string) => useQuery<Category>({
  queryKey: ["category", categoryId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<Category>>(`${API_URLS.category}/${categoryId}`)
    return response.data;
  }
})

export const useGetAllCategories = () => useQuery<Category[]>({
  queryKey: ["allCategories"],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<Category[]>>(`${API_URLS.category}/search`)
    return response.data;
  }
});

export const useCreateCategory = () =>
  useMutation<Category, ApiError, CategoryReqDto>({
    mutationKey: ["createCategory"],
    mutationFn: async (data: CategoryReqDto) => await apiClient.post<Category, CategoryReqDto>(`${API_URLS.category}`, data)
  });

export const useUpdateCategory = () =>
  useMutation<Category, ApiError, { categoryId: string; data: CategoryReqDto }>({
    mutationKey: ["updateCategory"],
    mutationFn: async ({ categoryId, data }) => await apiClient.put<Category, CategoryReqDto>(`${API_URLS.category}/${categoryId}`, data)
  });

export const useDeleteCategory = () =>
  useMutation<Category, ApiError, { categoryId: string }>({
    mutationKey: ["deleteCategory"],
    mutationFn: async ({ categoryId }) => await apiClient.delete<Category>(`${API_URLS.category}/${categoryId}`)
  })
