/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Jabatan` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `role` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Jabatan" DROP CONSTRAINT "Jabatan_parentId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_jabatanId_fkey";

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "password",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_id_seq";

-- DropTable
DROP TABLE "Jabatan";

-- CreateTable
CREATE TABLE "jabatan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "bidang" TEXT,
    "parentId" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jabatan" ADD CONSTRAINT "jabatan_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
