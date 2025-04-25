import { z } from "zod";
import { subjectSchema } from "./subject";
import { subSubjectSchema } from "./sub-subject";
import { questionTypes } from "@/enums/questions";
import { optionSchema } from "./option";
import { userSchema } from "./user";

// Define a schema for a single subject
export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(questionTypes.map(type => type.value) as [string, ...string[]]),
  subjectId: z.string(),
  subject: subjectSchema,
  subSubjectId: z.string(),
  subSubject: subSubjectSchema,
  question: z.string(),
  options: z.array(optionSchema),
  difficulty: z.number(),
  status: z.enum(["pending", "approved", "rejected"]),
  createdById: z.string(),
  processedById: z.string().nullable(),
  createdBy: userSchema,
  processedBy: userSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const questionListSchema = z.object({
  data: z.array(questionSchema),
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  pageSize: z.number()
})

export const questionReqDto = z.object({
  type: z.enum(questionTypes.map(type => type.value) as [string, ...string[]]),
  // subjectId: z.string().min(1, { message: "Subject is required" }),
  subSubjectId: z.string().min(1, { message: "Sub-Subject is required" }),
  question: z.string().min(1, { message: "Name is required" }),
  options: z.array(z.object({
    option: z.string().min(1, { message: "Option is required" }),
    isCorrect: z.boolean()
  })),
  difficulty: z.number().min(1, { message: "Difficulty is required" }).max(5)
})
  .refine(
    (data) => !(data.type === "mcq" && data.options.length === 0),
    {
      message: "Options are required for MCQ type questions",
      path: ["options"],
    }
  )
  .refine(
    (data) => !(data.type !== "mcq" && data.options.length > 0),
    {
      message: "Options should be empty for non-MCQ type questions",
      path: ["options"],
    }
  );



export type QuestionReqDto = z.infer<typeof questionReqDto>;
export type Question = z.infer<typeof questionSchema>;
export type QuestionList = z.infer<typeof questionListSchema>;

