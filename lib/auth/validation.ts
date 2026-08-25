import { z } from "zod";
import type { Locale } from "@/lib/i18n/types";

const messages: Record<Locale, { nicknameLength: string; nicknameMax: string; nicknameChars: string; passwordMin: string; passwordMax: string }> = {
  en: {
    nicknameLength: "Nickname must be at least 3 characters",
    nicknameMax: "Nickname must be at most 20 characters",
    nicknameChars: "Nickname may only contain letters, digits and underscores",
    passwordMin: "Password must be at least 8 characters",
    passwordMax: "Password must be at most 72 characters",
  },
  ru: {
    nicknameLength: "Никнейм должен содержать не менее 3 символов",
    nicknameMax: "Никнейм должен содержать не более 20 символов",
    nicknameChars: "Никнейм может содержать только латинские буквы, цифры и подчёркивание",
    passwordMin: "Пароль должен содержать не менее 8 символов",
    passwordMax: "Пароль должен содержать не более 72 символов",
  },
};

export function getNicknameSchema(locale: Locale) {
  const m = messages[locale];
  return z
    .string()
    .min(3, m.nicknameLength)
    .max(20, m.nicknameMax)
    .regex(/^[a-zA-Z0-9_]+$/, m.nicknameChars);
}

export function getPasswordSchema(locale: Locale) {
  const m = messages[locale];
  return z.string().min(8, m.passwordMin).max(72, m.passwordMax);
}

export function getRegisterSchema(locale: Locale) {
  return z.object({
    nickname: getNicknameSchema(locale),
    password: getPasswordSchema(locale),
  });
}

export function getLoginSchema() {
  return z.object({
    nickname: z.string().min(1),
    password: z.string().min(1),
  });
}
