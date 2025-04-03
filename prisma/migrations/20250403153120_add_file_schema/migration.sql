/*
  Warnings:

  - You are about to drop the column `name` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `file` table. All the data in the column will be lost.
  - You are about to drop the `_fileToprogram_kerja` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `file` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_drive` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proker_id` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `file` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `file` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `file` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."_fileToprogram_kerja" DROP CONSTRAINT "_fileToprogram_kerja_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_fileToprogram_kerja" DROP CONSTRAINT "_fileToprogram_kerja_B_fkey";

-- AlterTable
ALTER TABLE "public"."file" DROP COLUMN "name",
DROP COLUMN "path",
DROP COLUMN "size",
DROP COLUMN "type",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "drive_file_id" TEXT,
ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "link_drive" TEXT NOT NULL,
ADD COLUMN     "mime_type" TEXT,
ADD COLUMN     "proker_id" BIGINT NOT NULL,
ADD COLUMN     "thumbnail_url" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL;

-- DropTable
DROP TABLE "public"."_fileToprogram_kerja";

-- AddForeignKey
ALTER TABLE "public"."file" ADD CONSTRAINT "file_proker_id_fkey" FOREIGN KEY ("proker_id") REFERENCES "public"."program_kerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file" ADD CONSTRAINT "file_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
