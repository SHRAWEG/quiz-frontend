import { LoginReqDto, LoginResDto } from "@/dtos/auth/login.dto";
import { SignUpReqDto, SignUpResDto } from "@/dtos/auth/signUp.dto";
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

export const useSignUp = () =>
  useMutation<SignUpResDto, Error, SignUpReqDto>({
    mutationKey: ["signup"],
    mutationFn: async (data: SignUpReqDto) => {
      const response = await instance.post<SignUpResDto>(
        "/auth/register-user",
        data
      );
      return response.data; // Extracting only the data
    },
  });

