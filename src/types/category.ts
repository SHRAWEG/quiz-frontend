import { z } from "zod";

// Define a schema for a single subject
export const categorySchema = z.object({
  id: z.string(),
  name: z.string()
});

export const categoryReqDto = z.object({
  name: z.string().min(1, { message: "Name is required" })
})

export type CategoryReqDto = z.infer<typeof categoryReqDto>;
export type Category = z.infer<typeof categorySchema>;