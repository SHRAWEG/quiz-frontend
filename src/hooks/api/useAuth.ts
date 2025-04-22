import { LoginReqDto, LoginResDto, ResendVerificationDto } from "@/types/auth/login.dto";
import { RegisterResDto, RegisterReqDto } from "@/types/auth/register.dto";
import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation<LoginResDto, ApiError, LoginReqDto>({
    mutationKey: ["login"],
    mutationFn: async (data: LoginReqDto) => {
      const response = await apiClient.post<ApiResponse<LoginResDto>, LoginReqDto>("/auth/login", data)
      return response.data;
    }
  });

export const useRegister = () =>
  useMutation<RegisterResDto, ApiError, RegisterReqDto>({
    mutationKey: ["signup"],
    mutationFn: async (data: RegisterReqDto) => await apiClient.post<RegisterResDto, RegisterReqDto>("/auth/register-user", data)
  });

export const useResendVerification = () =>
  useMutation<RegisterResDto, ApiError, ResendVerificationDto>({
    mutationKey: ["resend-verification"],
    mutationFn: async (data: ResendVerificationDto) => await apiClient.post<RegisterResDto, ResendVerificationDto>("/auth/resend-verification", data)
  });

