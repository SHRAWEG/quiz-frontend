import { LoginReqDto, LoginResDto } from "@/types/auth/login.dto";
import { RegisterResDto, RegisterReqDto } from "@/types/auth/register.dto";
import { apiClient, ApiResponse } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation<LoginResDto, Error, LoginReqDto>({
    mutationKey: ["login"],
    mutationFn: async (data: LoginReqDto) => {
      const response = await apiClient.post<ApiResponse<LoginResDto>, LoginReqDto>("/auth/login", data)
      return response.data;
    }
  });

export const useRegister = () =>
  useMutation<RegisterResDto, Error, RegisterReqDto>({
    mutationKey: ["signup"],
    mutationFn: async (data: RegisterReqDto) => await apiClient.post<RegisterResDto, RegisterReqDto>("/auth/register-user", data)
  });

