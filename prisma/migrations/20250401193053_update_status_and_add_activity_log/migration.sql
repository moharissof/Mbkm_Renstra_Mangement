/*
  Warnings:

  - The values [Planningnpx] on the enum `Status_Proker` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ActivityLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Status_Proker_new" AS ENUM ('Draft', 'Planning', 'Menunggu_Approve_Waket', 'Disetujui', 'Ditolak', 'On_Progress', 'Done');
ALTER TABLE "public"."program_kerja" ALTER COLUMN "status" TYPE "public"."Status_Proker_new" USING ("status"::text::"public"."Status_Proker_new");
ALTER TYPE "public"."Status_Proker" RENAME TO "Status_Proker_old";
ALTER TYPE "public"."Status_Proker_new" RENAME TO "Status_Proker";
DROP TYPE "public"."Status_Proker_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."ActivityLog" DROP CONSTRAINT "ActivityLog_userId_fkey";

-- DropTable
DROP TABLE "public"."ActivityLog";

-- CreateTable
CREATE TABLE "public"."activty_log" (
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

    CONSTRAINT "activty_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activty_log_entityType_entityId_idx" ON "public"."activty_log"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "activty_log_createdAt_idx" ON "public"."activty_log"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."activty_log" ADD CONSTRAINT "activty_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
