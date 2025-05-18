import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { AnswerReqDto, QuestionSetAttempt, QuestionSetAttemptList, QuestionSetAttemptResDto } from "@/types/question-set-attempt";

export type QuestionSetParams = {
  page: number;
  limit: number;
  search: string;
  categoryId: string;
}

export const useGetQuestionSetAttempts = () => useQuery<QuestionSetAttemptList>({
  queryKey: ["questionSetAttempts"],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<QuestionSetAttemptList>>(API_URLS.questionSetAttempt)
    return response.data;
  }
})

export const useGetQuestionSetAttemptDetail = (questionSetAttemptId: string) => useQuery<QuestionSetAttempt>({
  queryKey: ["questionSetAttempt", questionSetAttemptId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<QuestionSetAttempt>>(`${API_URLS.questionSetAttempt}/${questionSetAttemptId}`)
    return response.data;
  }
})

export const useStartQuestionSetAttempt = () =>
  useMutation<ApiResponse<QuestionSetAttemptResDto>, ApiError, { questionSetId: string }>({
    mutationKey: ["startQuestionSetAttempt"],
    mutationFn: async ({ questionSetId }) => await apiClient.post(`${API_URLS.questionSetAttempt}/start/${questionSetId}`)
  });

export const useAnswerQuestion = () =>
  useMutation<ApiResponse<QuestionSetAttempt>, ApiError, { questionSetAttemptId: string, data: AnswerReqDto }>({
    mutationKey: ["answerQuestion"],
    mutationFn: async ({questionSetAttemptId, data}) => await apiClient.post(`${API_URLS.questionSetAttempt}/answer/${questionSetAttemptId}`, data)
  });

export const useFinishQuestionSetAttempt = () =>
  useMutation<ApiResponse, ApiError, { questionSetId: string;}>({
    mutationKey: ["finishQuestionSet"],
    mutationFn: async ({ questionSetId }) => await apiClient.put<ApiResponse>(`${API_URLS.questionSetAttempt}/${questionSetId}/finish`)
  });
