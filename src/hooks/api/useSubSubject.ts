import { apiClient, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { SubSubject, SubSubjectReqDto } from "@/types/sub-subject";

export const useGetSubSubjectDetail = (subSubjectId: string) => useQuery<SubSubject>({
  queryKey: ["subSubject", subSubjectId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<SubSubject>>(`${API_URLS.subSubject}/${subSubjectId}`)
    return response.data;
  }
})

export const useGetAllSubSubjects = (subjectId?: string) => useQuery<SubSubject[]>({
  queryKey: ["allSubSubjects", subjectId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<SubSubject[]>>(`${API_URLS.subSubject}/search/`, { params: { subjectId } })
    return response.data;
  }
});

export const useCreateSubSubject = () =>
  useMutation<SubSubject, Error, SubSubjectReqDto>({
    mutationKey: ["createSubSubject"],
    mutationFn: async (data: SubSubjectReqDto) => await apiClient.post<SubSubject, SubSubjectReqDto>(`${API_URLS.subSubject}`, data)
  });

export const useUpdateSubSubject = () =>
  useMutation<SubSubject, Error, { subSubjectId: string; data: SubSubjectReqDto }>({
    mutationKey: ["updateSubSubject"],
    mutationFn: async ({ subSubjectId, data }) => await apiClient.put<SubSubject, SubSubjectReqDto>(`${API_URLS.subSubject}/${subSubjectId}`, data)
  });

export const useDeleteSubSubject = () =>
  useMutation<SubSubject, Error, { subSubjectId: string }>({
    mutationKey: ["deleteSubSubject"],
    mutationFn: async ({ subSubjectId }) => await apiClient.delete<SubSubject>(`${API_URLS.subSubject}/${subSubjectId}`)
  })
