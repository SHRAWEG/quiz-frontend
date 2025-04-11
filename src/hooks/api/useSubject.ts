import { LoginReqDto, LoginResDto } from "@/dtos/auth/login.dto";
import { SubjectReqDto, SubjectResDto, SubjectResDtoArray } from "@/dtos/master/subject.dto";
import { instance } from "@/lib/axios";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export const useGetAllSubjects = () => useQuery<SubjectResDtoArray>({
  queryKey: ["allSubjects"],
  queryFn: async () => {
    const response = await instance.get<SubjectResDtoArray>("/subjects");
    return response.data; // Extracting only the data
  },
});

export const useCreateSubject = () =>
  useMutation<SubjectResDto, Error, SubjectReqDto>({
    mutationKey: ["createSubject"],
    mutationFn: async (data: SubjectReqDto) => {
      const response = await instance.post<SubjectResDto>("/subjects", data);
      return response.data; // Extracting only the data
    },
  });

export const useUpdateSubject = (id: string) =>
  useMutation<SubjectResDto, Error, SubjectReqDto>({
    mutationKey: ["updateSubject"],
    mutationFn: async (data: SubjectReqDto) => {
      const response = await instance.put<SubjectResDto>(
        "/subjects/" + id,
        data
      );
      return response.data; // Extracting only the data
    },
  });

