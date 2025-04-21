import { z } from "zod";

// Define a schema for a single subject
export const subjectSchema = z.object({
  id: z.string(),
  name: z.string()
});

export const subjectReqDto = z.object({
  name: z.string().min(1, { message: "Name is required" })
})

export type SubjectReqDto = z.infer<typeof subjectReqDto>;
export type Subject = z.infer<typeof subjectSchema>;