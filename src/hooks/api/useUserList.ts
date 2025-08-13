import { apiClient } from "@/lib/axios";
import { API_URLS } from "@/lib/constants/api-urls";
import { UserList } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export type UserListParams = {
  page: number;
  limit: number;
  search: string;
};

export const useGetTeachers = (params?: UserListParams) =>
  useQuery<UserList>({
    queryKey: ["teachers"],
    queryFn: async () =>
      await apiClient.get<UserList>(`${API_URLS.user}/teachers`, { params }),
  });

export const useGetStudents = (params?: UserListParams) =>
  useQuery<UserList>({
    queryKey: ["students"],
    queryFn: async () =>
      await apiClient.get<UserList>(`${API_URLS.user}/students`, { params }),
  });
