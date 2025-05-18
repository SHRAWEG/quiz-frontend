import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { QuestionSet, QuestionSetList, QuestionSetReqDto, QuestionSetsToAttemptList } from "@/types/question-set";

export type QuestionSetParams = {
  page: number;
  limit: number;
  search: string;
  categoryId: string;
}

export const useGetQuestionSets = (params?: QuestionSetParams) => useQuery<QuestionSetList>({
  queryKey: ["questionSets", params],
  queryFn: async () => await apiClient.get<QuestionSetList>(`${API_URLS.questionSet}`, { params })
});

export const UseGetQuestionSetsToAttempt = (params?: QuestionSetParams) => useQuery<QuestionSetsToAttemptList>({
  queryKey: ["questionSetsToAttemptList", params],
  queryFn: async () => await apiClient.get<QuestionSetsToAttemptList>(`${API_URLS.questionSet}/question-sets-to-attempt`, { params })
});

export const useGetQuestionSetDetail = (questionSetId: string) => useQuery<QuestionSet>({
  queryKey: ["questionSet", questionSetId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<QuestionSet>>(`${API_URLS.questionSet}/${questionSetId}`)
    return response.data;
  }
})

export const useGetAllQuestionSets = (subjectId?: string) => useQuery<QuestionSet[]>({
  queryKey: ["allQuestionSets", subjectId],
  queryFn: async () => await apiClient.get<QuestionSet[]>(`${API_URLS.questionSet}/search/`, { params: { subjectId } })
});

export const usePublishQuestionSet = () =>
  useMutation<QuestionSet, ApiError, { questionSetId: string }>({
    mutationKey: ["publishQuestionSet"],
    mutationFn: async ({ questionSetId }) => await apiClient.post(`${API_URLS.questionSet}/publish/${questionSetId}`)
  });

export const useDraftQuestionSet = () =>
  useMutation<QuestionSet, ApiError, { questionSetId: string }>({
    mutationKey: ["draftQuestionSet"],
    mutationFn: async ({ questionSetId }) => await apiClient.post(`${API_URLS.questionSet}/draft/${questionSetId}`)
  });

export const useCreateQuestionSet = () =>
  useMutation<ApiResponse<QuestionSet>, ApiError, QuestionSetReqDto>({
    mutationKey: ["createQuestionSet",],
    mutationFn: async (data: QuestionSetReqDto) => await apiClient.post(`${API_URLS.questionSet}`, data)
  });

export const useAddQuestionToSet = () =>
  useMutation<QuestionSet, ApiError, { questionSetId: string; questionId: string }>({
    mutationKey: ["addQuestionToSet"],
    mutationFn: async ({ questionSetId, questionId }) => await apiClient.post(`${API_URLS.questionSet}/add-question`, { questionSetId, questionId })
  });

export const useRemoveQuestionFromSet = () =>
  useMutation<QuestionSet, ApiError, { questionSetId: string; questionId: string }>({
    mutationKey: ["deleteQuestionFromSet"],
    mutationFn: async ({ questionSetId, questionId }) => await apiClient.post(`${API_URLS.questionSet}/remove-question`, { questionSetId, questionId })
  });

export const useUpdateQuestionSet = () =>
  useMutation<QuestionSet, ApiError, { questionSetId: string; data: QuestionSetReqDto }>({
    mutationKey: ["updateQuestionSet"],
    mutationFn: async ({ questionSetId, data }) => await apiClient.put<QuestionSet, QuestionSetReqDto>(`${API_URLS.questionSet}/${questionSetId}`, data)
  });

export const useDeleteQuestionSet = () =>
  useMutation<QuestionSet, ApiError, { questionSetId: string }>({
    mutationKey: ["deleteQuestionSet"],
    mutationFn: async ({ questionSetId }) => await apiClient.delete<QuestionSet>(`${API_URLS.questionSet}/${questionSetId}`)
  })
