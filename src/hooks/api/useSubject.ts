import { apiClient } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Subject, SubjectReqDto } from "@/types/subject";
import { API_URLS } from "@/lib/constants/api-urls";

export const useGetSubjectDetail = (subjectId: string) => useQuery<Subject>({
  queryKey: ["subject", subjectId],
  queryFn: async () => await apiClient.get<Subject>(`${API_URLS.subject}/${subjectId}`),
})

export const useGetAllSubjects = () => useQuery<Subject[]>({
  queryKey: ["allSubjects"],
  queryFn: async () => await apiClient.get<Subject[]>(`${API_URLS.subject}`)
});

export const useCreateSubject = () =>
  useMutation<Subject, Error, SubjectReqDto>({
    mutationKey: ["createSubject"],
    mutationFn: async (data: SubjectReqDto) => await apiClient.post<Subject, SubjectReqDto>(`${API_URLS.subject}`, data)
  });

export const useUpdateSubject = () =>
  useMutation<Subject, Error, { subjectId: string; data: SubjectReqDto }>({
    mutationKey: ["updateSubject"],
    mutationFn: async ({ subjectId, data }) => await apiClient.patch<Subject, SubjectReqDto>(`${API_URLS.subject}/${subjectId}`, data)
  });

export const useDeleteSubject = () =>
  useMutation<Subject, Error, { subjectId: string }>({
    mutationKey: ["deleteSubject"],
    mutationFn: async ({ subjectId }) => await apiClient.delete<Subject>(`${API_URLS.subject}/${subjectId}`)
  })
