import { apiClient, ApiResponse } from "@/lib/axios";
import { API_URLS } from "@/lib/constants/api-urls";
import {
  AdminDashboard,
  LeaderboardList,
  StudentDashboard,
  TeacherDashboard,
} from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useAdminDashboard = () =>
  useQuery<AdminDashboard>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AdminDashboard>>(
        `${API_URLS.dashboard}/admin`
      );
      return response.data;
    },
  });

export const useTeacherDashboard = () =>
  useQuery<TeacherDashboard>({
    queryKey: ["teacher-dashboard"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TeacherDashboard>>(
        `${API_URLS.dashboard}/teacher`
      );
      return response.data;
    },
  });

export const useStudentsDashboard = () =>
  useQuery<StudentDashboard>({
    queryKey: ["student-dashboard"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<StudentDashboard>>(
        `${API_URLS.dashboard}/student`
      );
      return response.data;
    },
  });

export const useLeaderBoard = () =>
  useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<LeaderboardList>>(
        `${API_URLS.dashboard}/leaderboard`
      );
      return response.data;
    },
  });
