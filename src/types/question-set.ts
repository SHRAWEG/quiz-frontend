import { z } from "zod";
import { categorySchema } from "./category";
import { userSchema } from "./user";
import { questionSchema } from "./question";
import { questionSetAccessType } from "@/enums/question-set-access-type";

// Define a schema for a single question set
export const questionSetSchema = z.object({
    id: z.string(),
    categoryId: z.string(),
    category: categorySchema,
    name: z.string(),
    accessType: z.enum(questionSetAccessType.map(type => type.value) as [string, ...string[]]),
    creditCost: z.number(),
    isTimeLimited: z.boolean(),
    timeLimitSeconds: z.number(),
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

export const purchaseInfo = z.object({
    isPurchased: z.boolean(),
    totalPurchases: z.number(),
    unusedPurchases: z.number()
})

export const questionSetToAttemptSchema = z.object({
    id: z.string(),
    accessType: z.enum(questionSetAccessType.map(type => type.value) as [string, ...string[]]),
    creditCost: z.number(),
    isTimeLimited: z.boolean(),
    timeLimitSeconds: z.number().optional(),
    categoryId: z.string(),
    category: categorySchema,
    name: z.string(),
    questionsCount: z.number(),
    totalAttempts: z.number(),
    purchaseInfo: purchaseInfo
})

export const questionSetsToAttemptListSchema = z.object({
    data: z.array(questionSetToAttemptSchema),
    totalItems: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    pageSize: z.number()
})


export const questionSetReqDto = z.object({
    categoryId: z.string().min(1, { message: "Category is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    isTimeLimited: z.boolean(),
    timeLimitSeconds: z.number().min(60, { message: "Time limit must be at least 1 minute" }).optional(),
    accessType: z.enum(questionSetAccessType.map(type => type.value) as [string, ...string[]]),
    creditCost: z.number().nullish(),
}).superRefine((data, ctx) => {
    if (data.isTimeLimited && (!data.timeLimitSeconds || data.timeLimitSeconds < 1)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Time limit must be at least 5 minute when timer is enabled",
            path: ["timeLimitSeconds"]
        });
    }

    if (data.accessType === "exclusive" && data.creditCost === null) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify credit cost.",
            path: ["creditCost"]
        })
    }
});

export type QuestionSetReqDto = z.infer<typeof questionSetReqDto>;
export type QuestionSet = z.infer<typeof questionSetSchema>;
export type QuestionSetList = z.infer<typeof questionSetListSchema>;
export type QuestionSetToAttempt = z.infer<typeof questionSetToAttemptSchema>;
export type QuestionSetsToAttemptList = z.infer<typeof questionSetsToAttemptListSchema>;

