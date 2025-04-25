import { z } from "zod";

export const registerReqDto = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Must be a valid email address" }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .refine(
        (phone) =>
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(
            phone
          ),
        { message: "Please enter a valid phone number" }
      ),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    role: z.string().min(1, { message: "Role is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerResDto = z.object({
  id: z.string(),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  isEmailVerified: z.boolean(),
  isActive: z.boolean(),
  lastActive: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type RegisterResDto = z.infer<typeof registerResDto>;
export type RegisterReqDto = z.infer<typeof registerReqDto>;
