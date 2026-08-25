"use client";

import { useRouter } from "next/navigation";
import { setLocaleCookie } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/types";

export function LocaleSwitcher({ locale, className = "" }: { locale: Locale; className?: string }) {
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    setLocaleCookie(next);
    router.refresh();
  }

  return (
    <div className={`inline-flex rounded border border-[var(--panel-border)] overflow-hidden text-xs ${className}`}>
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`px-2.5 py-1.5 ${locale === "en" ? "bg-[var(--gold)] text-[#14202b] font-semibold" : "text-[var(--ink-dim)]"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo("ru")}
        className={`px-2.5 py-1.5 ${locale === "ru" ? "bg-[var(--gold)] text-[#14202b] font-semibold" : "text-[var(--ink-dim)]"}`}
      >
        RU
      </button>
    </div>
  );
}
