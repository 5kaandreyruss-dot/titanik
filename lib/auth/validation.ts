import { z } from "zod";

export const nicknameSchema = z
  .string()
  .min(3, "Nickname must be at least 3 characters")
  .max(20, "Nickname must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Nickname may only contain letters, digits and underscores");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const registerSchema = z.object({
  nickname: nicknameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  nickname: z.string().min(1),
  password: z.string().min(1),
});
