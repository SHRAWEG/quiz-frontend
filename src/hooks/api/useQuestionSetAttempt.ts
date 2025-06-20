import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { AnswerReqDto, MarkReqDto, QuestionSetAttempt, QuestionSetAttemptList, QuestionSetAttemptResDto } from "@/types/question-set-attempt";


export type StatusRes = {
  id: string;
  remainingTimeSeconds: number;
  startedAt: string;
  expiryAt: string;
  isExpired: boolean;
  timeLimitSeconds: number | null;
  isCompleted: boolean;
}

export type QuestionSetAttemptParams = {
  page: number;
  limit: number;
  search: string;
  status: string;
}

export const useGetQuestionSetAttempts = (params?: QuestionSetAttemptParams) => useQuery<QuestionSetAttemptList>({
  queryKey: ["questionSetAttempts", params],
  queryFn: async () => await apiClient.get<QuestionSetAttemptList>(`${API_URLS.questionSetAttempt}`, { params })
});

export const useGetQuestionSetAttemptsToReview = () => useQuery<QuestionSetAttempt[]>({
  queryKey: ["questionSetAttempts"],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<QuestionSetAttempt[]>>(`${API_URLS.questionSetAttempt}/review`)
    return response.data;
  }
})

export const useGetQuestionSetAttemptToReview = (questionSetAttemptId: string) => useQuery<QuestionSetAttempt>({
  queryKey: ["questionSetAttempt", questionSetAttemptId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<QuestionSetAttempt>>(`${API_URLS.questionSetAttempt}/review/${questionSetAttemptId}`)
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

export const useGetStatus = (questionSetAttemptId: string) => useQuery<StatusRes>({
  queryKey: ["questionSetAttempt", questionSetAttemptId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<StatusRes>>(`${API_URLS.questionSetAttempt}/${questionSetAttemptId}`)
    return response.data;
  }
})

export const useGetQuestionSetAttemptResult = (questionSetAttemptId: string) => useQuery<QuestionSetAttempt>({
  queryKey: ["questionSetAttemptResult", questionSetAttemptId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<QuestionSetAttempt>>(`${API_URLS.questionSetAttempt}/report/${questionSetAttemptId}`)
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
    mutationFn: async ({ questionSetAttemptId, data }) => await apiClient.post(`${API_URLS.questionSetAttempt}/answer/${questionSetAttemptId}`, data)
  });

export const useFinishQuestionSetAttempt = () =>
  useMutation<ApiResponse, ApiError, { questionSetAttemptId: string; }>({
    mutationKey: ["finishQuestionSet"],
    mutationFn: async ({ questionSetAttemptId }) => await apiClient.put<ApiResponse>(`${API_URLS.questionSetAttempt}/finish/${questionSetAttemptId}`)
  });

export const useMarkQuestion = () =>
  useMutation<ApiResponse<QuestionSetAttempt>, ApiError, { questionAttemptId: string, data: MarkReqDto }>({
    mutationKey: ["markQuestion"],
    mutationFn: async ({ questionAttemptId, data }) => await apiClient.put(`${API_URLS.questionSetAttempt}/reviewAnswer/${questionAttemptId}`, data)
  });

export const useMarkQuestionSet = () =>
  useMutation<ApiResponse, ApiError, { questionSetAttemptId: string; }>({
    mutationKey: ["markQuestionSet"],
    mutationFn: async ({ questionSetAttemptId }) => await apiClient.put<ApiResponse>(`${API_URLS.questionSetAttempt}/markChecked/${questionSetAttemptId}`)
  });
