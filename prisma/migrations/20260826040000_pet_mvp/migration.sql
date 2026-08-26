-- CreateEnum
CREATE TYPE "WorldTheme" AS ENUM ('FANTASY', 'SPACE', 'CYBERPUNK');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'PET');

-- DropForeignKey
ALTER TABLE "AnalyticsEvent" DROP CONSTRAINT "AnalyticsEvent_gameRunId_fkey";

-- DropForeignKey
ALTER TABLE "AnalyticsEvent" DROP CONSTRAINT "AnalyticsEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "Discovery" DROP CONSTRAINT "Discovery_gameRunId_fkey";

-- DropForeignKey
ALTER TABLE "Discovery" DROP CONSTRAINT "Discovery_userId_fkey";

-- DropForeignKey
ALTER TABLE "GameRun" DROP CONSTRAINT "GameRun_userId_fkey";

-- DropForeignKey
ALTER TABLE "LeaderboardEntry" DROP CONSTRAINT "LeaderboardEntry_gameRunId_fkey";

-- DropForeignKey
ALTER TABLE "LeaderboardEntry" DROP CONSTRAINT "LeaderboardEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerAchievement" DROP CONSTRAINT "PlayerAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerAchievement" DROP CONSTRAINT "PlayerAchievement_gameRunId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerAchievement" DROP CONSTRAINT "PlayerAchievement_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "crystals" INTEGER NOT NULL DEFAULT 50;

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "AnalyticsEvent";

-- DropTable
DROP TABLE "Discovery";

-- DropTable
DROP TABLE "EndingDefinitionRow";

-- DropTable
DROP TABLE "EventDefinitionRow";

-- DropTable
DROP TABLE "GameRun";

-- DropTable
DROP TABLE "ItemDefinitionRow";

-- DropTable
DROP TABLE "LeaderboardEntry";

-- DropTable
DROP TABLE "LocationDefinitionRow";

-- DropTable
DROP TABLE "NpcDefinitionRow";

-- DropTable
DROP TABLE "PlayerAchievement";

-- DropTable
DROP TABLE "RunCounter";

-- DropEnum
DROP TYPE "GameRunStatus";

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "world" "WorldTheme" NOT NULL,
    "trust" INTEGER NOT NULL DEFAULT 50,
    "intelligence" INTEGER NOT NULL DEFAULT 10,
    "strength" INTEGER NOT NULL DEFAULT 10,
    "energy" INTEGER NOT NULL DEFAULT 80,
    "hunger" INTEGER NOT NULL DEFAULT 70,
    "personality" JSONB NOT NULL,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "bornAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastFedAt" TIMESTAMP(3),
    "neglected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatCounter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ChatCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pet_userId_key" ON "Pet"("userId");

-- CreateIndex
CREATE INDEX "Pet_userId_idx" ON "Pet"("userId");

-- CreateIndex
CREATE INDEX "ChatMessage_petId_createdAt_idx" ON "ChatMessage"("petId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChatCounter_userId_day_key" ON "ChatCounter"("userId", "day");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

