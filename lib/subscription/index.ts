import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { User } from "@prisma/client";

/**
 * Subscription/Premium abstraction. No real payment provider is integrated
 * yet (spec #32) — this exists so one can be plugged in later without
 * touching call sites. Premium never affects gameplay difficulty/odds; it
 * only gates additional content (spec #30, #33).
 */
export const SubscriptionService = {
  isPremium(user: Pick<User, "isPremium" | "premiumUntil">): boolean {
    if (!user.isPremium) return false;
    if (!user.premiumUntil) return true; // no expiry set = permanent grant
    return user.premiumUntil.getTime() > Date.now();
  },

  async activate(userId: string, until: Date | null, source: string): Promise<void> {
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { isPremium: true, premiumUntil: until } }),
      prisma.subscriptionEvent.create({
        data: { userId, action: "activated", source, until },
      }),
    ]);
  },

  async deactivate(userId: string, source: string): Promise<void> {
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { isPremium: false, premiumUntil: null } }),
      prisma.subscriptionEvent.create({
        data: { userId, action: "deactivated", source },
      }),
    ]);
  },
};
