import { LoginReqDto, LoginResDto } from "@/types/auth/login.dto";
import { RegisterResDto, RegisterReqDto } from "@/types/auth/register.dto";
import { apiClient } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation<LoginResDto, Error, LoginReqDto>({
    mutationKey: ["login"],
    mutationFn: async (data: LoginReqDto) => await apiClient.post<LoginResDto, LoginReqDto>("/auth/login", data)
  });

export const useRegister = () =>
  useMutation<RegisterResDto, Error, RegisterReqDto>({
    mutationKey: ["signup"],
    mutationFn: async (data: RegisterReqDto) => await apiClient.post<RegisterResDto, RegisterReqDto>("/auth/register", data)
  });

