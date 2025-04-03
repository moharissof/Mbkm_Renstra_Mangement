/*
  Warnings:

  - The values [Planning] on the enum `Status_Proker` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Status_Proker_new" AS ENUM ('Draft', 'Planningnpx', 'Menunggu_Approve_Waket', 'Disetujui', 'Ditolak', 'On_Progress', 'Done');
ALTER TABLE "public"."program_kerja" ALTER COLUMN "status" TYPE "public"."Status_Proker_new" USING ("status"::text::"public"."Status_Proker_new");
ALTER TYPE "public"."Status_Proker" RENAME TO "Status_Proker_old";
ALTER TYPE "public"."Status_Proker_new" RENAME TO "Status_Proker";
DROP TYPE "public"."Status_Proker_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."laporan" (
    "id" BIGSERIAL NOT NULL,
    "program_kerja_id" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,
    "laporan" TEXT,
    "realisasi" INTEGER,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "laporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."komentar" (
    "id" BIGSERIAL NOT NULL,
    "program_kerja_id" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "komentar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_fileToprogram_kerja" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_fileToprogram_kerja_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_fileToprogram_kerja_B_index" ON "public"."_fileToprogram_kerja"("B");

-- AddForeignKey
ALTER TABLE "public"."laporan" ADD CONSTRAINT "laporan_program_kerja_id_fkey" FOREIGN KEY ("program_kerja_id") REFERENCES "public"."program_kerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."laporan" ADD CONSTRAINT "laporan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."komentar" ADD CONSTRAINT "komentar_program_kerja_id_fkey" FOREIGN KEY ("program_kerja_id") REFERENCES "public"."program_kerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."komentar" ADD CONSTRAINT "komentar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_fileToprogram_kerja" ADD CONSTRAINT "_fileToprogram_kerja_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."file"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_fileToprogram_kerja" ADD CONSTRAINT "_fileToprogram_kerja_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."program_kerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
