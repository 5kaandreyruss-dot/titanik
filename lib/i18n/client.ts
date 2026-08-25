"use client";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/types";

export function setLocaleCookie(locale: Locale): void {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${oneYear}; SameSite=Lax`;
}
