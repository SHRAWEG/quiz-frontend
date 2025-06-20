import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URLS } from "@/lib/constants/api-urls";
import { Question, QuestionList, QuestionReqDto, UploadQuestionResDto } from "@/types/question";

export type QuestionParams = {
  page: number;
  limit: number;
  search: string;
  subjectId: string;
  subSubjectId: string;
  questionType: string;
  status: string;
}

export const useGetQuestions = (params?: QuestionParams) => useQuery<QuestionList>({
  queryKey: ["questions"],
  queryFn: async () => await apiClient.get<QuestionList>(`${API_URLS.question}`, { params })
});

export const useGetQuestionDetail = (questionId: string) => useQuery<Question>({
  queryKey: ["question", questionId],
  queryFn: async () => {
    const response = await apiClient.get<ApiResponse<Question>>(`${API_URLS.question}/${questionId}`)
    return response.data;
  }
})

export const useGetAllQuestions = (subjectId?: string) => useQuery<Question[]>({
  queryKey: ["allQuestions", subjectId],
  queryFn: async () => await apiClient.get<Question[]>(`${API_URLS.question}/search/`, { params: { subjectId } })
});

export const useApproveQuestion = () =>
  useMutation<Question, ApiError, { questionId: string }>({
    mutationKey: ["approveQuestion"],
    mutationFn: async ({ questionId }) => await apiClient.patch(`${API_URLS.question}/approve/${questionId}`)
  });

export const useRejectQuestion = () =>
  useMutation<Question, ApiError, { questionId: string }>({
    mutationKey: ["rejectquestion"],
    mutationFn: async ({ questionId }) => await apiClient.patch(`${API_URLS.question}/reject/${questionId}`)
  });

export const useCreateQuestion = () =>
  useMutation<Question, ApiError, QuestionReqDto>({
    mutationKey: ["createQuestion",],
    mutationFn: async (data: QuestionReqDto) => await apiClient.post(`${API_URLS.question}`, data)
  });

export const useUpdateQuestion = () =>
  useMutation<Question, ApiError, { questionId: string; data: QuestionReqDto }>({
    mutationKey: ["updateQuestion"],
    mutationFn: async ({ questionId, data }) => await apiClient.put<Question, QuestionReqDto>(`${API_URLS.question}/${questionId}`, data)
  });

export const useDeleteQuestion = () =>
  useMutation<Question, ApiError, { questionId: string }>({
    mutationKey: ["deleteQuestion"],
    mutationFn: async ({ questionId }) => await apiClient.delete<Question>(`${API_URLS.question}/${questionId}`)
  })

export const useImportQuestions = () =>
  useMutation<ApiResponse<UploadQuestionResDto>, ApiError, { file: File }>({
    mutationKey: ["importQuestions"],
    mutationFn: async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);
      return await apiClient.post<ApiResponse<UploadQuestionResDto>>(`${API_URLS.question}/upload-csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    }
  })
