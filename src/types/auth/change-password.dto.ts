import { z } from "zod";

export const changePasswordReqDto = z.object({
  oldPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(1, { message: "New password is required" })
    .min(8, { message: "New password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }),
  confirmNewPassword: z
    .string()
    .min(1, { message: "Please confirm your new password" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
}).refine((data) => data.oldPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

export const changePasswordResDto = z.object({
  message: z.string(),
});

export type ChangePasswordReqDto = z.infer<typeof changePasswordReqDto>;
export type ChangePasswordResDto = z.infer<typeof changePasswordResDto>;
