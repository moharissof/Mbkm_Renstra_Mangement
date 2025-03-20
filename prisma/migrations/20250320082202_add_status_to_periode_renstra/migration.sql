-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Aktif', 'Diarsipkan');

-- AlterTable
ALTER TABLE "public"."periode_renstra" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'Aktif';
