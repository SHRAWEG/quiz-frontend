import { z } from "zod";

// Define a schema for a single subject
export const noticeSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const noticeListSchema = z.object({
  data: z.array(noticeSchema),
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
});

export const noticeReqDto = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  fromDate: z.string().min(1, { message: "From date is required" }),
  toDate: z.string().min(1, { message: "To date is required" }),
});

export type NoticeList = z.infer<typeof noticeListSchema>;
export type NoticeReqDto = z.infer<typeof noticeReqDto>;
export type Notice = z.infer<typeof noticeSchema>;
