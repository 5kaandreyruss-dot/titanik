import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { PetApp } from "@/components/pet/PetApp";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 text-center relative overflow-hidden">
        <div className="ambient-glow" />
        <div className="anim-fade-in-up relative z-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-widest text-[var(--gold-bright)]">
            AI PET
          </h1>
          <p className="text-sm sm:text-base tracking-[0.3em] text-[var(--ink-dim)] mt-2">ЖИВОЕ СУЩЕСТВО</p>
        </div>
        <p className="max-w-sm text-[var(--ink-dim)] leading-relaxed relative z-10 anim-fade-in-up">
          Вырасти питомца, который правда тебя помнит. Его характер зависит от того, как ты с ним общаешься.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs relative z-10 anim-fade-in-up">
          <Link href="/register" className="btn btn-primary">
            Создать аккаунт
          </Link>
          <Link href="/login" className="btn">
            Войти
          </Link>
        </div>
      </div>
    );
  }

  return <PetApp nickname={user.nickname} crystals={user.crystals} />;
}
