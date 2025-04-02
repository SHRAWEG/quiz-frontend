import { LoginReqDto, LoginResDto } from "@/dtos/auth/login.dto";
import { instance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () =>
  useMutation<LoginResDto, Error, LoginReqDto>({
    mutationKey: ["login"],
    mutationFn: async (data: LoginReqDto) => {
      const response = await instance.post<LoginResDto>("/auth/login", data);
      return response.data; // Extracting only the data
    },
  });
