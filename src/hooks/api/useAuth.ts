import { LoginReqDto, LoginResDto } from "@/dtos/auth/login.dto";
import { RegisterResDto, RegisterReqDto } from "@/dtos/auth/register.dto";
import { instance } from "@/lib/axios";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation<LoginResDto, Error, LoginReqDto>({
    mutationKey: ["login"],
    mutationFn: async (data: LoginReqDto) => {
      const response = await instance.post<LoginResDto>("/auth/login", data);
      return response.data; // Extracting only the data
    },
  });

export const useRegister = () =>
  useMutation<RegisterResDto, Error, RegisterReqDto>({
    mutationKey: ["signup"],
    mutationFn: async (data: RegisterReqDto) => {
      const response = await instance.post<RegisterResDto>(
        "/auth/register-user",
        data
      );
      return response.data; // Extracting only the data
    },
  });

