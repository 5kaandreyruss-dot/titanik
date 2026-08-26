import "server-only";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionService } from "@/lib/subscription";
import type { User } from "@prisma/client";

const FREE_MESSAGES_PER_DAY = 20;
const PREMIUM_MESSAGES_PER_DAY = 300;

function todayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getRemainingFreeMessages(user: User): Promise<number | null> {
  if (SubscriptionService.isPremium(user)) return null; // null = effectively unlimited for the UI
  const day = todayUtc();
  const counter = await prisma.chatCounter.findUnique({ where: { userId_day: { userId: user.id, day } } });
  return Math.max(0, FREE_MESSAGES_PER_DAY - (counter?.count ?? 0));
}

export async function consumeMessageQuota(user: User): Promise<boolean> {
  const day = todayUtc();
  const limit = SubscriptionService.isPremium(user) ? PREMIUM_MESSAGES_PER_DAY : FREE_MESSAGES_PER_DAY;

  const counter = await prisma.chatCounter.upsert({
    where: { userId_day: { userId: user.id, day } },
    create: { userId: user.id, day, count: 0 },
    update: {},
  });

  if (counter.count >= limit) return false;

  await prisma.chatCounter.update({
    where: { userId_day: { userId: user.id, day } },
    data: { count: { increment: 1 } },
  });
  return true;
}
