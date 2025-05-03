import { z } from "zod";
import { categorySchema } from "./category";
import { userSchema } from "./user";
import { questionSchema } from "./question";

// Define a schema for a single question set
export const questionSetSchema = z.object({
    id: z.string(),
    categoryId: z.string(),
    category: categorySchema,
    name: z.string(),
    isFree: z.boolean(),
    isTimer: z.boolean(),
    timer: z.number(),
    questions: z.array(questionSchema),
    status: z.enum(["published", "draft"]),
    createdById: z.string(),
    createdBy: userSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const questionSetListSchema = z.object({
    data: z.array(questionSetSchema),
    totalItems: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    pageSize: z.number()
})

export const questionSetReqDto = z.object({
    categoryId: z.string().min(1, { message: "Category is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    isFree: z.boolean()
})

export type QuestionSetReqDto = z.infer<typeof questionSetReqDto>;
export type QuestionSet = z.infer<typeof questionSetSchema>;
export type QuestionSetList = z.infer<typeof questionSetListSchema>;

