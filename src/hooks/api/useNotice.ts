import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Notice, NoticeList, NoticeReqDto } from "@/types/notice";
import { API_URLS } from "@/lib/constants/api-urls";

export type NoticeParams = {
  page: number;
  limit: number;
  search: string;
};

export const useGetNotices = (params?: NoticeParams) =>
  useQuery<NoticeList>({
    queryKey: ["notices"],
    queryFn: async () =>
      await apiClient.get<NoticeList>(`${API_URLS.notice}`, { params }),
  });

export const useGetNoticeDetail = (noticeId: string) =>
  useQuery<Notice>({
    queryKey: ["notice", noticeId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Notice>>(
        `${API_URLS.notice}/${noticeId}`
      );
      return response.data;
    },
  });

export const useGetAllNotices = () =>
  useQuery<Notice[]>({
    queryKey: ["allNotices"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Notice[]>>(
        `${API_URLS.notice}/search`
      );
      return response.data;
    },
  });

export const useCreateNotice = () =>
  useMutation<Notice, ApiError, NoticeReqDto>({
    mutationKey: ["createNotice"],
    mutationFn: async (data: NoticeReqDto) =>
      await apiClient.post<Notice, NoticeReqDto>(`${API_URLS.notice}`, data),
  });

export const useUpdateNotice = () =>
  useMutation<Notice, ApiError, { noticeId: string; data: NoticeReqDto }>({
    mutationKey: ["updateNotice"],
    mutationFn: async ({ noticeId, data }) =>
      await apiClient.put<Notice, NoticeReqDto>(
        `${API_URLS.notice}/${noticeId}`,
        data
      ),
  });

export const useDeleteNotice = () =>
  useMutation<Notice, ApiError, { noticeId: string }>({
    mutationKey: ["deleteNotice"],
    mutationFn: async ({ noticeId }) =>
      await apiClient.delete<Notice>(`${API_URLS.notice}/${noticeId}`),
  });
