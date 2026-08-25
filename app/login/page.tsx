import { AuthForm } from "@/components/auth/AuthForm";
import { getLocale } from "@/lib/i18n/locale";

export default async function LoginPage() {
  const locale = await getLocale();
  return <AuthForm mode="login" locale={locale} />;
}
