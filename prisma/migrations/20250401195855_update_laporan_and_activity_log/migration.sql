/*
  Warnings:

  - You are about to drop the `activty_log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."activty_log" DROP CONSTRAINT "activty_log_userId_fkey";

-- DropTable
DROP TABLE "public"."activty_log";

-- CreateTable
CREATE TABLE "public"."activity_log" (
    "id" BIGSERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" BIGINT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_log_entityType_entityId_idx" ON "public"."activity_log"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "activity_log_createdAt_idx" ON "public"."activity_log"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."activity_log" ADD CONSTRAINT "activity_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
