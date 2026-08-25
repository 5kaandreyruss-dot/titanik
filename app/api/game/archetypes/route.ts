import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getContentRegistry } from "@/lib/content";
import { SubscriptionService } from "@/lib/subscription";

export async function GET() {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const content = getContentRegistry();
  const isPremium = SubscriptionService.isPremium(user);

  const archetypes = content.archetypes.map((a) => ({
    id: a.id,
    name: a.name,
    socialClass: a.socialClass,
    description: a.description,
    locked: Boolean(a.premiumOnly) && !isPremium,
  }));

  return NextResponse.json({ archetypes });
}
