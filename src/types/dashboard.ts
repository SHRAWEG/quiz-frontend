import { z } from "zod";

export const adminDashboardSchema = z.object({
  totalStudents: z.number(),
  totalTeachers: z.number(),
  newStudentsThisWeek: z.number(),
  newTeachersThisWeek: z.number(),
  totalQuestionSetAttempts: z.number(),
  averageQuestionsPerTeacher: z.number(),
});

export type AdminDashboard = z.infer<typeof adminDashboardSchema>;

export const teacherDashboardSchema = z.object({
  totalQuestionsAuthored: z.number(),
  totalUsedInQuestionSets: z.number(),
  totalApprovedQuestions: z.number(),
});

export type TeacherDashboard = z.infer<typeof teacherDashboardSchema>;

export const studentDashboardSchema = z.object({
  totalQuestionSetsAttempted: z.number(),
  completedQuestionSets: z.number(),
  incompleteQuestionSets: z.number(),
  timeSpentInSeconds: z.number(),
});

export type StudentDashboard = z.infer<typeof studentDashboardSchema>;
