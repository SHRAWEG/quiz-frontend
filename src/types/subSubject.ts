import { z } from "zod";
import { subjectSchema } from "./subject";

// Define a schema for a single subject
export const subSubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: subjectSchema
});

export const subSubjectReqDto = z.object({
  subjectId: z.string().min(1, { message: "Subject is required" }),
  name: z.string().min(1, { message: "Name is required" })
})

export const subSubjectResDto = z.object({
  success: z.boolean(),
  message: z.string(),
  data: subSubjectSchema
})

export type SubSubjectReqDto = z.infer<typeof subSubjectReqDto>;
export type SubSubject = z.infer<typeof subSubjectSchema>;