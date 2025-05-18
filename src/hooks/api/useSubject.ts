import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Subject, SubjectList, SubjectReqDto } from "@/types/subject";
import { API_URLS } from "@/lib/constants/api-urls";

export type SubjectParams = {
  page: number;
  limit: number;
  search: string;
}

export const useGetSubjects = (params?: SubjectParams) => useQuery<SubjectList>({
  queryKey: ["subjects"],
  queryFn: async () => await apiClient.get<SubjectList>(`${API_URLS.subject}`, { params })
});

export const useGetSubjectDetail = (subjectId: string) => useQuery<Subject>({
  queryKey: ["subject", subjectId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<Subject>>(`${API_URLS.subject}/${subjectId}`)
    return response.data;
  }
})

export const useGetAllSubjects = () => useQuery<Subject[]>({
  queryKey: ["allSubjects"],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<Subject[]>>(`${API_URLS.subject}/search`)
    return response.data;
  }
});

export const useCreateSubject = () =>
  useMutation<Subject, ApiError, SubjectReqDto>({
    mutationKey: ["createSubject"],
    mutationFn: async (data: SubjectReqDto) => await apiClient.post<Subject, SubjectReqDto>(`${API_URLS.subject}`, data)
  });

export const useUpdateSubject = () =>
  useMutation<Subject, ApiError, { subjectId: string; data: SubjectReqDto }>({
    mutationKey: ["updateSubject"],
    mutationFn: async ({ subjectId, data }) => await apiClient.put<Subject, SubjectReqDto>(`${API_URLS.subject}/${subjectId}`, data)
  });

export const useDeleteSubject = () =>
  useMutation<Subject, ApiError, { subjectId: string }>({
    mutationKey: ["deleteSubject"],
    mutationFn: async ({ subjectId }) => await apiClient.delete<Subject>(`${API_URLS.subject}/${subjectId}`)
  })
