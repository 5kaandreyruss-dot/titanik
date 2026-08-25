import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/locale";
import { getUiDictionary } from "@/lib/i18n/ui";
import { Panel } from "@/components/ui/Panel";
import { AdminPremiumForm } from "@/components/admin/AdminPremiumForm";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/menu");

  const locale = await getLocale();
  const ui = getUiDictionary(locale);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold text-[var(--gold)]">{ui.admin.title}</h1>
      <Panel className="w-full max-w-md">
        <h2 className="font-medium mb-3">{ui.admin.grantRevokeTitle}</h2>
        <AdminPremiumForm locale={locale} />
      </Panel>
    </div>
  );
}
