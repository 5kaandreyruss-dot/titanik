import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const CATEGORY_ORDER: Record<string, { field: string; direction: "asc" | "desc" }> = {
  rescuers: { field: "peopleRescued", direction: "desc" },
  explorers: { field: "explorationPercent", direction: "desc" },
  detectives: { field: "secretsDiscovered", direction: "desc" },
  survivors: { field: "survived", direction: "desc" },
  heroes: { field: "heroicEnding", direction: "desc" },
  speed: { field: "durationMinutes", direction: "asc" },
  collectors: { field: "achievementsCount", direction: "desc" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "rescuers";
  const order = CATEGORY_ORDER[category] ?? CATEGORY_ORDER.rescuers;

  const entries = await prisma.leaderboardEntry.findMany({
    orderBy: { [order.field]: order.direction },
    take: 50,
    select: {
      nickname: true,
      peopleRescued: true,
      explorationPercent: true,
      secretsDiscovered: true,
      survived: true,
      heroicEnding: true,
      durationMinutes: true,
      achievementsCount: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ category, entries });
}
