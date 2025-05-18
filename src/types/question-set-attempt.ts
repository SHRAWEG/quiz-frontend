import { z } from "zod";
import { categorySchema } from "./category";
import { questionTypes } from "@/enums/questions";
import { subjectSchema } from "./subject";
import { subSubjectSchema } from "./sub-subject";

const questionAttemptSchema = z.object({
    id: z.string(),
    type: z.enum(questionTypes.map(type => type.value) as [string, ...string[]]),
    subjectId: z.string(),
    subject: subjectSchema,
    subSubjectId: z.string(),
    subSubject: subSubjectSchema,
    question: z.string(),
    options: z.array(z.object({
        id: z.string(),
        option: z.string()
    })),
    difficulty: z.number(),
    questionAttempts: z.array(z.object({
        id: z.string(),
        questionAttemptId: z.string(),
        questionSetAttemptId: z.string(),
        selectedOptionId: z.string().nullable(),
        selectedBooleanAnswer: z.boolean().nullable(),
        selectedTextAnswer: z.string().nullable(),
        isCorrect: z.boolean()
    })),
    selectedOptionId: z.string().nullable(),
    selectedBooleanAnswer: z.boolean().nullable(),
    selectedTextAnswer: z.string().nullable(),
    status: z.enum(["viewed", "answered"])
});

export const questionSetAttemptSchema = z.object({
    id: z.string(),
    questionSetId: z.string(),
    startedAt: z.date(),
    completedAt: z.date().nullable(),
    isCompleted: z.boolean(),
    score: z.number(),
    percentage: z.number(),
    questionSet: z.object({
        id: z.string(),
        categoryId: z.string(),
        category: categorySchema,
        name: z.string(),
        isFree: z.boolean(),
        isTimer: z.boolean(),
        timer: z.number(),
        questions: z.array(questionAttemptSchema),
    })
})

export const questionSetAttemptResSchema = z.object({
    id: z.string(),
    questionSetId: z.string(),
    startedAt: z.date(),
    completedAt: z.date().nullable(),
    isCompleted: z.boolean(),
    score: z.number(),
    percentage: z.number()
});

export const answerReqSchema = z.object({
    questionId: z.string(),
    selectedOptionId: z.string().nullable(),
    selectedBooleanAnswer: z.boolean().nullable(),
    selectedTextAnswer: z.string().nullable(),
}).refine(
    (data) => !(data.selectedOptionId === null && data.selectedBooleanAnswer === null && data.selectedTextAnswer === null),
    {
        message: "At least one answer must be provided",
    }
)

export type AnswerReqDto = z.infer<typeof answerReqSchema>;
export type QuestionAttempt = z.infer<typeof questionAttemptSchema>;
export type QuestionSetAttempt = z.infer<typeof questionSetAttemptSchema>;
export type QuestionSetAttemptList = z.infer<typeof questionSetAttemptSchema>[];
export type QuestionSetAttemptResDto = z.infer<typeof questionSetAttemptResSchema>;

