import { LoginReqDto, LoginResDto, ResendVerificationDto } from "@/types/auth/login.dto";
import { RegisterResDto, RegisterReqDto } from "@/types/auth/register.dto";
import { apiClient, ApiError, ApiResponse } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

type VerifyResponse = {
  message: string;
}

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

// export const useSendVerification = () => {
//   useMutation<RegisterResDto, ApiError, RegisterReqDto>({
//     mutationKey: ["send-verification"],
//     mutationFn: async (data: RegisterReqDto) => await apiClient.post<RegisterResDto, RegisterReqDto>("/auth/send-verification", data)
//   });
// }

export const useResendVerification = () =>
  useMutation<RegisterResDto, ApiError, ResendVerificationDto>({
    mutationKey: ["resend-verification"],
    mutationFn: async (data: ResendVerificationDto) => await apiClient.post<RegisterResDto, ResendVerificationDto>("/auth/resend-verification", data)
  });

export const useVerifyEmail = (params: { token: string }) => useQuery<VerifyResponse>({
  queryKey: ["verify-email", params.token],
  queryFn: async () => {
    return await apiClient.get<VerifyResponse>("/auth/verify-email", { params })
  }
})
