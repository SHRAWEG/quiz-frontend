import { z } from "zod";

export const optionSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  optionText: z.string(),
  isCorrect: z.boolean()
});

export type Option = z.infer<typeof optionSchema>;