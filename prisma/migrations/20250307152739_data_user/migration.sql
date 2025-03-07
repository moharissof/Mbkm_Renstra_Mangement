-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KETUA', 'WAKET1', 'WAKET2', 'KABAG', 'STAFF');

-- CreateEnum
CREATE TYPE "Bidang" AS ENUM ('BIDANG_1', 'BIDANG_2');

-- CreateTable
CREATE TABLE "Jabatan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "bidang" "Bidang",
    "parentId" INTEGER,

    CONSTRAINT "Jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "jabatanId" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "Jabatan" ADD CONSTRAINT "Jabatan_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
