import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";
import { getContentRegistry } from "../lib/content";

const prisma = new PrismaClient();

async function main() {
  const content = getContentRegistry();

  await prisma.achievement.createMany({
    data: content.achievements.map((a) => ({
      id: a.id,
      name: a.name.en,
      description: a.description.en,
      secret: a.secret,
    })),
    skipDuplicates: true,
  });

  await prisma.npcDefinitionRow.createMany({
    data: content.npcs.map((n) => ({ id: n.id, name: n.name })),
    skipDuplicates: true,
  });
  await prisma.locationDefinitionRow.createMany({
    data: content.locations.map((l) => ({ id: l.id, name: l.name.en })),
    skipDuplicates: true,
  });
  await prisma.itemDefinitionRow.createMany({
    data: content.items.map((i) => ({ id: i.id, name: i.name.en })),
    skipDuplicates: true,
  });
  await prisma.endingDefinitionRow.createMany({
    data: content.endings.map((e) => ({ id: e.id, name: e.name.en })),
    skipDuplicates: true,
  });
  await prisma.eventDefinitionRow.createMany({
    data: content.events.map((e) => ({ id: e.id, name: e.name })),
    skipDuplicates: true,
  });

  const adminNickname = process.env.SEED_ADMIN_NICKNAME ?? "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  const existingAdmin = await prisma.user.findUnique({ where: { nickname: adminNickname } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        nickname: adminNickname,
        passwordHash: await hashPassword(adminPassword),
        role: "ADMIN",
      },
    });
    console.log(`Created admin user "${adminNickname}" with password "${adminPassword}" — change it!`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
