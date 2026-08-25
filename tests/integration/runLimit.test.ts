import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { createNewRun, getRemainingFreeRuns, RunLimitError, FREE_RUNS_PER_DAY } from "@/lib/runLimit";
import { SubscriptionService } from "@/lib/subscription";
import { hashPassword } from "@/lib/auth/password";

const nickname = `test_runlimit_${Date.now()}`;

describe("server-side free run limit", () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: { nickname, passwordHash: await hashPassword("irrelevant-password") },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.gameRun.deleteMany({ where: { userId } });
    await prisma.subscriptionEvent.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it(`allows exactly ${FREE_RUNS_PER_DAY} runs per day for a free user, then rejects further creation`, async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    for (let i = 0; i < FREE_RUNS_PER_DAY; i++) {
      await createNewRun(user, "steward");
    }

    const remaining = await getRemainingFreeRuns(user);
    expect(remaining).toBe(0);

    await expect(createNewRun(user, "steward")).rejects.toBeInstanceOf(RunLimitError);
  });

  it("grants unlimited runs once premium is activated", async () => {
    await SubscriptionService.activate(userId, null, "test");
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    expect(await getRemainingFreeRuns(user)).toBeNull();
    await expect(createNewRun(user, "steward")).resolves.toBeDefined();

    await SubscriptionService.deactivate(userId, "test");
  });
});
