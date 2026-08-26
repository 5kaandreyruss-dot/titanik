import { z } from "zod";

export const nicknameSchema = z
  .string()
  .min(3, "Никнейм должен содержать не менее 3 символов")
  .max(20, "Никнейм должен содержать не более 20 символов")
  .regex(/^[a-zA-Z0-9_]+$/, "Никнейм может содержать только латинские буквы, цифры и подчёркивание");

export const passwordSchema = z
  .string()
  .min(8, "Пароль должен содержать не менее 8 символов")
  .max(72, "Пароль должен содержать не более 72 символов");

export const registerSchema = z.object({
  nickname: nicknameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  nickname: z.string().min(1),
  password: z.string().min(1),
});
