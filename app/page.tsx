import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/menu");

  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 text-center relative overflow-hidden">
      <div className="ambient-glow" />
      <LocaleSwitcher locale={locale} className="absolute top-4 right-4 z-10" />
      <div className="anim-fade-in-up relative z-10">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-widest text-[var(--gold-bright)]">{ui.landing.title}</h1>
        <p className="text-sm sm:text-base tracking-[0.4em] text-[var(--ink-dim)] mt-2">{ui.landing.subtitle}</p>
      </div>
      <p className="max-w-sm text-[var(--ink-dim)] leading-relaxed relative z-10 anim-fade-in-up">{ui.landing.tagline}</p>
      <div className="flex flex-col gap-3 w-full max-w-xs relative z-10 anim-fade-in-up">
        <Link href="/register" className="btn btn-primary">
          {ui.landing.newAccount}
        </Link>
        <Link href="/login" className="btn">
          {ui.landing.signIn}
        </Link>
      </div>
    </div>
  );
}
