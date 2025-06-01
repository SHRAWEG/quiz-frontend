import { z } from "zod";
import { questionSchema } from "./question";
import { questionSetSchema } from "./question-set";

const questionAttemptSchema = z.object({
    id: z.string(),
    selectedTextAnswer: z.string().nullable(),
    selectedBooleanAnswer: z.boolean().nullable(),
    selectedOptionId: z.string().nullable(),
    isCorrect: z.boolean(),
    questionId: z.string(),
    question: questionSchema
});

export const questionSetAttemptSchema = z.object({
    id: z.string(),
    questionSetId: z.string(),
    startedAt: z.date(),
    completedAt: z.date().nullable(),
    isCompleted: z.boolean(),
    score: z.number(),
    percentage: z.number(),
    questionSet: questionSetSchema,
    questionAttempts: z.array(questionAttemptSchema)
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
    questionAttemptId: z.string(),
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

