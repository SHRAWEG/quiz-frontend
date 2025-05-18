import { z } from "zod";

// Define a schema for a single subject
export const subjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  subSubjects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    subjectId: z.string(),
  }))
});

export const subjectListSchema = z.object({
  data: z.array(subjectSchema),
  totalPages: z.number(),
  totalItems: z.number(),
  currentPage: z.number(),
  pageSize: z.number()
});

export const subjectReqDto = z.object({
  name: z.string().min(1, { message: "Name is required" })
})

export type SubjectReqDto = z.infer<typeof subjectReqDto>;
export type Subject = z.infer<typeof subjectSchema>;
export type SubjectList = z.infer<typeof subjectListSchema>;