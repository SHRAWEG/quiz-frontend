import { z } from "zod";

// Define a schema for a single subject
export const subjectSchema = z.object({
  id: z.string(),
  name: z.string()
});

export const subjectReqDto = z.object({
  name: z.string().min(1, { message: "Name is required" })
})

export const subjectResDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: subjectSchema
})

export const subjectResDtoArray = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(subjectSchema)
})

export type SubjectReqDto = z.infer<typeof subjectReqDto>;
export type SubjectResDto = z.infer<typeof subjectResDto>;
export type SubjectResDtoArray = z.infer<typeof subjectResDtoArray>;